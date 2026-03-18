'use client';

import { useState, useEffect, useRef } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import type { Algorithm } from './JwtToolClient';
import { JwtVerify } from '@/lib/jwt-verify';

const ALGORITHMS: Algorithm[] = ['HS256', 'RS256', 'ES256'];

const ALGORITHM_INFO: Record<Algorithm, {
  type: 'HMAC' | 'RSA' | 'ECDSA';
  hash: 'SHA-256';
  minBytes?: number;
  description: string;
  keyLabel: string;
  keyPlaceholder: string;
}> = {
  HS256: { type: 'HMAC', hash: 'SHA-256', minBytes: 32, description: 'HMAC-SHA256', keyLabel: 'Secret Key', keyPlaceholder: 'Enter your shared secret key (minimum 32 bytes)' },
  RS256: { type: 'RSA', hash: 'SHA-256', description: 'RSASSA-PKCS1-v1_5-SHA256', keyLabel: 'Private Key (PEM)', keyPlaceholder: '-----BEGIN PRIVATE KEY-----\n...' },
  ES256: { type: 'ECDSA', hash: 'SHA-256', description: 'ECDSA-P256-SHA256', keyLabel: 'Private Key (PEM)', keyPlaceholder: '-----BEGIN PRIVATE KEY-----\n...' },
};

interface KeyPair {
  privateKey: string;
  publicKey: string;
}

function generateSecretKey(bytes: number): string {
  // Generate printable ASCII characters only (32-126) to avoid display issues
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  // Map to printable ASCII range (32-126)
  const printableChars = array.map(byte => 32 + (byte % 95)); // 95 printable chars
  return String.fromCharCode(...printableChars);
}

function generateSecretKeyBase64(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
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

// Generate appropriate key based on algorithm and encoding option
async function generateKeyForAlgorithm(
  algorithm: Algorithm,
  base64UrlEncoded: boolean
): Promise<KeyPair | string> {
  if (algorithm === 'HS256') {
    // For HMAC, return just the secret key (no public key)
    if (base64UrlEncoded) {
      // When Base64URL Encoded is ON, generate Base64URL encoded secret
      return generateSecretKeyBase64Url(32);
    }
    // When Base64URL Encoded is OFF, generate plain text secret
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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onScroll={handleScroll}
          rows={rows}
          className={`w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent absolute top-0 left-0 right-0 bottom-0 resize-none overflow-auto ${isFocused ? 'z-10' : 'z-0'}`}
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
  sharedState: {
    token: string;
    secretKey: string;
    algorithm: Algorithm;
    base64UrlEncoded: boolean;
    publicKey?: string;
  };
  onEncode: (token: string, secretKey: string, algorithm: Algorithm, base64UrlEncoded: boolean, publicKey?: string) => void;
}

export default function JwtEncoderTab({ sharedState, onEncode }: JwtEncoderTabProps) {
  const [algorithm, setAlgorithm] = useState<Algorithm>(sharedState.algorithm);
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [key, setKey] = useState(sharedState.secretKey || '');
  const [publicKey, setPublicKey] = useState<string>(sharedState.publicKey || '');
  const [base64UrlEncoded, setBase64UrlEncoded] = useState(sharedState.base64UrlEncoded);
  const [token, setToken] = useState(sharedState.token || '');
  const [error, setError] = useState('');
  const [keysAutoGenerated, setKeysAutoGenerated] = useState(false); // Track if keys were auto-generated

  // Generate key only if both local key AND shared state are empty
  useEffect(() => {
    if (!key && !sharedState.secretKey) {
      generateKeyForAlgorithm(algorithm, base64UrlEncoded).then(result => {
        if (typeof result === 'string') {
          setKey(result);
          setKeysAutoGenerated(true); // Keys were auto-generated
        } else {
          setKey(result.privateKey);
          setPublicKey(result.publicKey);
          setKeysAutoGenerated(true); // Keys were auto-generated
        }
      });
    }
  }, []);

  // Sync key from shared state when it changes
  useEffect(() => {
    // Always sync from shared state if it has a key
    // This preserves manually entered keys when switching between tabs
    if (sharedState.secretKey) {
      setKey(sharedState.secretKey);
      setKeysAutoGenerated(false); // Not auto-generated anymore
    }
    if (sharedState.publicKey) {
      setPublicKey(sharedState.publicKey);
    }
  }, [sharedState.secretKey, sharedState.publicKey]);

  // Sync key to shared state when user manually changes it (before encoding)
  useEffect(() => {
    // Only sync if key was manually entered (not auto-generated) and different from shared state
    if (!keysAutoGenerated && key && key !== sharedState.secretKey) {
      onEncode(sharedState.token || token, key, algorithm, base64UrlEncoded, publicKey);
    }
  }, [key, keysAutoGenerated, sharedState.secretKey, onEncode, algorithm, base64UrlEncoded, publicKey]);

  // Update header and regenerate key when algorithm changes
  useEffect(() => {
    try {
      const parsedHeader = JSON.parse(header);
      parsedHeader.alg = algorithm;
      setHeader(JSON.stringify(parsedHeader, null, 2));
    } catch {
      setHeader(`{\n  "alg": "${algorithm}",\n  "typ": "JWT"\n}`);
    }

    // Regenerate key when algorithm changes
    generateKeyForAlgorithm(algorithm, base64UrlEncoded).then(result => {
      if (typeof result === 'string') {
        setKey(result);
        setPublicKey('');
        setKeysAutoGenerated(true); // Keys were auto-generated
      } else if (result && result.privateKey && result.publicKey) {
        setKey(result.privateKey);
        setPublicKey(result.publicKey);
        setKeysAutoGenerated(true); // Keys were auto-generated
      } else {
        console.error('[JWT Encoder] Invalid key result:', result);
      }
    }).catch(err => {
      console.error('[JWT Encoder] Error generating key:', err);
    });

    setToken('');
    setError('');
    setAlgorithm(algorithm);
  }, [algorithm]);

  // Clear token when header, payload, key, or base64UrlEncoded changes
  useEffect(() => {
    setToken('');
    setError('');
  }, [header, payload, key, base64UrlEncoded]);

  // Sync public key when RSA/ECDSA key changes
  useEffect(() => {
    // Only clear public key if user manually changed the key (not auto-generated)
    if ((algorithm.startsWith('RS') || algorithm.startsWith('ES')) && !keysAutoGenerated) {
      // If user pastes a valid private key, we don't have the public key
      // So clear it to force user to provide the public key separately
      if (key.includes('-----BEGIN PRIVATE KEY-----') || key.includes('-----END PRIVATE KEY-----')) {
        setPublicKey('');
      }
    }
  }, [key]);

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
      setKeysAutoGenerated(true); // Keys were auto-generated
    }
    // For RSA/ECDSA, clear public key when encoding changes (though this shouldn't happen)
    if (algorithm.startsWith('RS') || algorithm.startsWith('ES')) {
      setPublicKey('');
      setKeysAutoGenerated(false); // Reset flag
    }
  }, [base64UrlEncoded]);

  const encodeJWT = async () => {
    try {
      setError('');

      JSON.parse(header);
      JSON.parse(payload);

      const info = ALGORITHM_INFO[algorithm];
      const isHMAC = algorithm === 'HS256';

      // Handle key based on Base64URL Encoded setting
      let cryptoKey: CryptoKey;

      if (info.type === 'HMAC') {
        let keyBytes: Uint8Array;
        if (base64UrlEncoded) {
          // When Base64URL Encoded is ON, decode the Base64URL key to bytes
          try {
            keyBytes = new TextEncoder().encode(JwtVerify.base64UrlDecode(key));
          } catch (e) {
            setError('Invalid Base64URL encoded secret.');
            return;
          }
        } else {
          // When Base64URL Encoded is OFF, use the plain text key as-is
          keyBytes = new TextEncoder().encode(key);
        }
        // For HMAC, validate key length
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

      console.log('[JWT Encode - Sign Data]', {
        message,
        messageLength: messageData.length
      });

      const signature = await crypto.subtle.sign(
        info.type === 'HMAC' ? { name: 'HMAC', hash: info.hash } :
        info.type === 'ECDSA' ? { name: 'ECDSA', hash: info.hash } :
        cryptoKey.algorithm,
        cryptoKey,
        messageData
      );

      const signatureBytes = new Uint8Array(signature);
      console.log('[JWT Encode - Signature]', {
        signatureLength: signatureBytes.length,
        signatureHex: Array.from(signatureBytes).map(b => b.toString(16).padStart(2, '0')).join('')
      });

      const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const fullToken = `${message}.${signatureBase64}`;
      setToken(fullToken);

      // Debug log
      console.log('[JWT Encode]', {
        base64UrlEncoded,
        originalKey: key,
        publicKey: publicKey,
        publicKeyLength: publicKey?.length || 0
      });

      // Sync with parent - pass original key and let decoder decode it
      // Sync with parent - include public key for RSA/ECDSA
      onEncode(fullToken, key, algorithm, base64UrlEncoded, publicKey || undefined);
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
      return key; // Return original key if decode fails
    }
  };

  const decodedKey = getDecodedKey();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        >
          <option value="HS256">HS256 - HMAC-SHA256</option>
          <option value="RS256">RS256 - RSASSA-PKCS1-v1_5-SHA256</option>
          <option value="ES256">ES256 - ECDSA-P256-SHA256</option>
        </select>
        <p className="text-xs text-gray-500 mt-2">
          {isHMAC && `Secret must be at least ${info.minBytes} bytes`}
          {!isHMAC && 'Private key in PEM format (PKCS#8)'}
        </p>
      </div>

      <JsonEditor
        value={header}
        onChange={setHeader}
        rows={4}
        label="Header (JSON)"
        placeholder='{"alg": "HS256", "typ": "JWT"}'
      />

      <JsonEditor
        value={payload}
        onChange={setPayload}
        rows={6}
        label="Payload (JSON)"
        placeholder='{"sub": "1234567890", "name": "John Doe"}'
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{info.keyLabel}</label>
          {isHMAC && (
            <div className="flex items-center gap-2">
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
        {isHMAC ? (
          <>
            <input
              type="text"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setKeysAutoGenerated(false); // User manually changed the key
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
              setKeysAutoGenerated(false); // User manually changed the key
            }}
            rows={10}
            className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={info.keyPlaceholder}
          />
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={encodeJWT}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Encode JWT
      </button>

      {token && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Generated JWT Token</label>
            <CopyButton text={token} />
          </div>
          <div className="bg-gray-900 rounded-lg p-4 break-all">
            <code className="text-sm font-mono text-green-400">{token}</code>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>Creates a JWT token with {info.description} signature. All processing happens in your browser.</p>
      </div>
    </div>
  );
}
