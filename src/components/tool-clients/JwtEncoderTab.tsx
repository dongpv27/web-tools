'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, X } from 'lucide-react';
import type { Algorithm } from './JwtToolClient';
import { JwtVerify } from '@/lib/jwt-verify';
import SignatureFormula from './SignatureFormula';

const ALGORITHMS: Algorithm[] = ['HS256', 'RS256', 'ES256'];

const ALGORITHM_INFO: Record<Algorithm, {
  type: 'HMAC' | 'RSA' | 'ECDSA';
  hash: 'SHA-256';
  minBytes?: number;
  description: string;
  keyLabel: string;
  keyPlaceholder: string;
}> = {
  HS256: { type: 'HMAC', hash: 'SHA-256', minBytes: 32, description: 'HMAC-SHA256', keyLabel: 'Signing Key', keyPlaceholder: 'Enter your signing key (minimum 32 bytes)' },
  RS256: { type: 'RSA', hash: 'SHA-256', description: 'RSASSA-PKCS1-v1_5-SHA256', keyLabel: 'Private Key (PEM)', keyPlaceholder: '-----BEGIN PRIVATE KEY-----\n...' },
  ES256: { type: 'ECDSA', hash: 'SHA-256', description: 'ECDSA-P256-SHA256', keyLabel: 'Private Key (PEM)', keyPlaceholder: '-----BEGIN PRIVATE KEY-----\n...' },
};

interface KeyPair {
  privateKey: string;
  publicKey: string;
}

function generateSecretKey(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  const printableChars = array.map(byte => 32 + (byte % 95));
  return String.fromCharCode(...printableChars);
}

function generateSecretKeyBase64Url(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  const base64 = btoa(String.fromCharCode(...array));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateKeyForAlgorithm(
  algorithm: Algorithm,
  base64UrlEncoded: boolean
): Promise<KeyPair | string> {
  if (algorithm === 'HS256') {
    if (base64UrlEncoded) {
      return generateSecretKeyBase64Url(32);
    }
    return generateSecretKey(32);
  } else if (algorithm === 'RS256') {
    return await generateRsaKeyPair();
  } else if (algorithm === 'ES256') {
    return await generateEcdsaKeyPair();
  }
  return '';
}

function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  if (!buffer) {
    throw new Error('Buffer is undefined');
  }
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  const base64 = btoa(binary);
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

async function generateRsaKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  return {
    privateKey: arrayBufferToPem(privateKey, 'PRIVATE KEY'),
    publicKey: arrayBufferToPem(publicKey, 'PUBLIC KEY'),
  };
}

async function generateEcdsaKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  return {
    privateKey: arrayBufferToPem(privateKey, 'PRIVATE KEY'),
    publicKey: arrayBufferToPem(publicKey, 'PUBLIC KEY'),
  };
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function highlightJson(json: string): string {
  if (!json.trim()) return '';
  try {
    const parsed = JSON.parse(json);
    const jsonString = JSON.stringify(parsed, null, 2);
    return jsonString
      .replace(/"([^"]*)":/g, '<span class="text-purple-600">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="text-green-600">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-green-600">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-blue-600">$1</span>');
  } catch {
    return json;
  }
}

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
  label: string;
}

function JsonEditor({ value, onChange, placeholder, rows, label }: JsonEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    const pre = textareaRef.current?.nextElementSibling as HTMLElement;
    if (pre) pre.scrollTop = textareaRef.current?.scrollTop || 0;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Title bar */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <label className="text-sm font-medium text-gray-600">{label}</label>
      </div>
      {/* Content */}
      <div className="p-4 bg-white relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onScroll={handleScroll}
          rows={rows}
          className={`w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent absolute top-4 left-4 right-4 resize-none overflow-auto ${isFocused ? 'z-10' : 'z-0'}`}
          placeholder={placeholder}
          style={{ color: 'transparent', caretColor: 'black' }}
        />
        <pre
          className={`w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg bg-white pointer-events-none ${isFocused ? 'z-0' : 'z-10'}`}
          style={{ minHeight: `${rows * 1.5 * 16 + 24}px`, overflow: 'hidden' }}
          dangerouslySetInnerHTML={{ __html: highlightJson(value) || `<span class="text-gray-400">${placeholder}</span>` }}
        />
      </div>
    </div>
  );
}

interface JwtEncoderTabProps {
  slug?: string;
}

export default function JwtEncoderTab({ slug }: JwtEncoderTabProps) {
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256');
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [key, setKey] = useState('');
  const [base64UrlEncoded, setBase64UrlEncoded] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [keysAutoGenerated, setKeysAutoGenerated] = useState(false);

  // Generate key on mount if empty
  useEffect(() => {
    if (!key) {
      generateKeyForAlgorithm(algorithm, base64UrlEncoded).then(result => {
        if (typeof result === 'string') {
          setKey(result);
          setKeysAutoGenerated(true);
        } else {
          setKey(result.privateKey);
          setKeysAutoGenerated(true);
        }
      });
    }
  }, []);

  // Update header and regenerate key when algorithm changes
  useEffect(() => {
    try {
      const parsedHeader = JSON.parse(header);
      parsedHeader.alg = algorithm;
      setHeader(JSON.stringify(parsedHeader, null, 2));
    } catch {
      setHeader(`{\n  "alg": "${algorithm}",\n  "typ": "JWT"\n}`);
    }

    generateKeyForAlgorithm(algorithm, base64UrlEncoded).then(result => {
      if (typeof result === 'string') {
        setKey(result);
      } else if (result && result.privateKey && result.publicKey) {
        setKey(result.privateKey);
      }
    }).catch(err => {
      console.error('[JWT Encoder] Error generating key:', err);
    });

    setToken('');
    setError('');
  }, [algorithm]);

  // Clear token when header, payload, key, or base64UrlEncoded changes
  useEffect(() => {
    setToken('');
    setError('');
  }, [header, payload, key, base64UrlEncoded]);

  // Regenerate key when Base64URL Encoded toggle changes (for HS256 only)
  useEffect(() => {
    if (algorithm === 'HS256') {
      generateKeyForAlgorithm(algorithm, base64UrlEncoded).then(result => {
        if (typeof result === 'string') {
          setKey(result);
        }
      }).catch(err => {
        console.error('[JWT Encoder] Error generating key:', err);
      });
      setKeysAutoGenerated(true);
    }
  }, [base64UrlEncoded]);

  const encodeJWT = async () => {
    try {
      setError('');

      JSON.parse(header);
      JSON.parse(payload);

      const info = ALGORITHM_INFO[algorithm];
      const isHMAC = algorithm === 'HS256';

      let cryptoKey: CryptoKey;

      if (info.type === 'HMAC') {
        let keyBytes: Uint8Array;
        if (base64UrlEncoded) {
          try {
            keyBytes = new TextEncoder().encode(JwtVerify.base64UrlDecode(key));
          } catch (e) {
            setError('Invalid Base64URL encoded secret.');
            return;
          }
        } else {
          keyBytes = new TextEncoder().encode(key);
        }
        const minBytes = info.minBytes!;
        if (keyBytes.length < minBytes) {
          setError(`Secret key must be at least ${minBytes} bytes for ${algorithm}. Current: ${keyBytes.length} bytes.`);
          return;
        }

        cryptoKey = await crypto.subtle.importKey(
          'raw',
          new Uint8Array(keyBytes),
          { name: 'HMAC', hash: info.hash },
          false,
          ['sign']
        );
      } else {
        if (!key || !key.includes('-----BEGIN PRIVATE KEY-----') || !key.includes('-----END PRIVATE KEY-----')) {
          setError(`Invalid PEM format. Please provide a valid private key in PEM format.`);
          return;
        }

        const keyData = pemToArrayBuffer(key);
        let algorithmName: 'RSASSA-PKCS1-v1_5' | 'ECDSA' =
          info.type === 'RSA' ? 'RSASSA-PKCS1-v1_5' : 'ECDSA';

        const namedCurve = algorithm === 'ES256' ? 'P-256' : undefined;

        cryptoKey = await crypto.subtle.importKey(
          'pkcs8',
          keyData,
          namedCurve ?
            { name: 'ECDSA', namedCurve } :
            { name: algorithmName, hash: info.hash },
          false,
          ['sign']
        );
      }

      const encodedHeader = JwtVerify.base64UrlEncode(JSON.stringify(JSON.parse(header)));
      const encodedPayload = JwtVerify.base64UrlEncode(JSON.stringify(JSON.parse(payload)));

      const message = `${encodedHeader}.${encodedPayload}`;
      const messageData = new TextEncoder().encode(message);

      const signature = await crypto.subtle.sign(
        info.type === 'HMAC' ? { name: 'HMAC', hash: info.hash } :
        info.type === 'ECDSA' ? { name: 'ECDSA', hash: info.hash } :
        cryptoKey.algorithm,
        cryptoKey,
        messageData
      );

      const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const fullToken = `${message}.${signatureBase64}`;
      setToken(fullToken);
    } catch (error: any) {
      setError(error?.message || 'Error encoding JWT. Please check your inputs.');
    }
  };

  const isHMAC = algorithm === 'HS256';
  const info = ALGORITHM_INFO[algorithm];

  const getDecodedKey = (): string => {
    if (!isHMAC || !base64UrlEncoded) return key;
    try {
      return JwtVerify.base64UrlDecode(key);
    } catch {
      return key;
    }
  };

  const decodedKey = getDecodedKey();

  // Block component
  const JwtBlock = ({
    title,
    content,
    showCopy = false,
    showClear = false,
    onClear,
    children,
    titleRight,
  }: {
    title: string;
    content?: string;
    showCopy?: boolean;
    showClear?: boolean;
    onClear?: () => void;
    children?: React.ReactNode;
    titleRight?: React.ReactNode;
  }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="flex items-center gap-2">
          {titleRight}
          {showCopy && content && (
            <button
              onClick={() => navigator.clipboard.writeText(content)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          {showClear && onClear && (
            <button
              onClick={onClear}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4 bg-white">
        {children}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Generated JWT Token */}
      <div className="space-y-4">
        <JwtBlock
          title="Generated JWT Token"
          content={token}
          showCopy={!!token}
        >
          {token ? (
            <div className="bg-gray-900 rounded-lg p-4 break-all min-h-[200px]">
              <code className="text-sm font-mono text-green-400">{token}</code>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Configure your JWT and click Encode to generate token</p>
            </div>
          )}
        </JwtBlock>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={encodeJWT}
          className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Encode JWT
        </button>
      </div>

      {/* Right Column - Algorithm, Header, Payload, Signing Key */}
      <div className="space-y-4">
        {/* Algorithm Selection */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <label className="block text-xs font-medium text-gray-600 mb-1">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option value="HS256">HS256 - HMAC-SHA256</option>
            <option value="RS256">RS256 - RSASSA-PKCS1-v1_5-SHA256</option>
            <option value="ES256">ES256 - ECDSA-P256-SHA256</option>
          </select>
        </div>

        {/* Header Editor */}
        <JsonEditor
          value={header}
          onChange={setHeader}
          rows={4}
          label="Header"
          placeholder='{"alg": "HS256", "typ": "JWT"}'
        />

        {/* Payload Editor */}
        <JsonEditor
          value={payload}
          onChange={setPayload}
          rows={6}
          label="Payload"
          placeholder='{"sub": "1234567890", "name": "John Doe"}'
        />

        {/* Signing Key */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
            <label className="text-sm font-medium text-gray-600">{info.keyLabel}</label>
            {isHMAC && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600">Base64URL Encoded</span>
                <button
                  type="button"
                  onClick={() => setBase64UrlEncoded(!base64UrlEncoded)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    base64UrlEncoded ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      base64UrlEncoded ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
          {/* Content */}
          <div className="p-4 bg-white">
            {isHMAC ? (
              <>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setKeysAutoGenerated(false);
                  }}
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={info.keyPlaceholder}
                />
                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-gray-500">
                    {base64UrlEncoded
                      ? `Decoded length: ${new TextEncoder().encode(decodedKey).length} bytes`
                      : `Current length: ${new TextEncoder().encode(key).length} bytes`
                    }
                  </span>
                  <span className={new TextEncoder().encode(base64UrlEncoded ? decodedKey : key).length >= (info.minBytes || 0) ? 'text-green-600' : 'text-red-600'}>
                    Required: {info.minBytes} bytes
                  </span>
                </div>
              </>
            ) : (
              <textarea
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setKeysAutoGenerated(false);
                }}
                rows={8}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={info.keyPlaceholder}
              />
            )}

            {/* Signature Formula */}
            <SignatureFormula algorithm={algorithm} />
          </div>
        </div>
      </div>
    </div>
  );
}
