'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { X, Copy } from 'lucide-react';
import type { Algorithm } from './JwtToolClient';
import { JwtVerify, type VerificationResult } from '@/lib/jwt-verify';
import SignatureFormula from './SignatureFormula';

type VerificationStatus = 'valid' | 'invalid' | 'error' | 'pending' | null;

interface DecodedResult {
  header: any;
  payload: any;
  algorithm: string;
  headerEncoded: string;
  payloadEncoded: string;
}

interface JwtDecoderTabProps {
  slug?: string;
}

const ALGORITHMS: Algorithm[] = ['HS256', 'RS256', 'ES256'];

// Sample payload for all algorithms
const SAMPLE_PAYLOAD = {
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022,
};

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

// Key generation functions
function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  if (!buffer) {
    throw new Error('Buffer is undefined');
  }
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  const base64 = btoa(binary);
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
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

async function generateRsaKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
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

async function generateEcdsaKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
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

async function generateKeyForAlgorithm(algorithm: Algorithm): Promise<{ privateKey: string; publicKey: string }> {
  if (algorithm === 'HS256') {
    return { privateKey: 'your-256-bit-secret', publicKey: '' };
  } else if (algorithm === 'RS256') {
    return await generateRsaKeyPair();
  } else if (algorithm === 'ES256') {
    return await generateEcdsaKeyPair();
  }
  return { privateKey: '', publicKey: '' };
}

// JWT Encode function
async function encodeJWT(algorithm: Algorithm, payload: any, privateKey: string): Promise<string> {
  const header = { alg: algorithm, typ: 'JWT' };

  const encodedHeader = JwtVerify.base64UrlEncode(JSON.stringify(header));
  const encodedPayload = JwtVerify.base64UrlEncode(JSON.stringify(payload));

  const message = `${encodedHeader}.${encodedPayload}`;
  const messageData = new TextEncoder().encode(message);

  let signature: ArrayBuffer;

  if (algorithm === 'HS256') {
    const keyBytes = new TextEncoder().encode(privateKey);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    signature = await crypto.subtle.sign({ name: 'HMAC', hash: 'SHA-256' }, cryptoKey, messageData);
  } else if (algorithm === 'RS256') {
    const keyData = pemToArrayBuffer(privateKey);
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyData,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
    signature = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, cryptoKey, messageData);
  } else if (algorithm === 'ES256') {
    const keyData = pemToArrayBuffer(privateKey);
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyData,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );
    signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, messageData);
  } else {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${message}.${signatureBase64}`;
}

export default function JwtDecoderTab({ slug }: JwtDecoderTabProps) {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [decodedResult, setDecodedResult] = useState<DecodedResult | null>(null);
  const [decodeError, setDecodeError] = useState('');

  // Verification state
  const [verifyKey, setVerifyKey] = useState('');
  const [publicKey, setPublicKey] = useState<string>('');
  const [base64UrlEncoded, setBase64UrlEncoded] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);
  const [verificationError, setVerificationError] = useState('');
  const [keyError, setKeyError] = useState(''); // Key validation error
  const [isExpired, setIsExpired] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('HS256');
  const [privateKey, setPrivateKey] = useState<string>(''); // Store private key for encoding

  // Track if we've loaded initial sample
  const hasInitialized = useRef(false);

  // Track pending algorithm change to verify after token is decoded
  const pendingAlgorithmRef = useRef<Algorithm | null>(null);

  // Transition for smooth UI updates when switching algorithms
  const [isPending, startTransition] = useTransition();

  const decode = useCallback(() => {
    const tokenToDecode = input.trim();
    setDecodeError('');
    setHeader('');
    setPayload('');
    setSignature('');
    setVerificationStatus(null);
    setVerificationError('');
    setKeyError(''); // Clear key error on new decode
    setIsExpired(false);

    if (!tokenToDecode) {
      setDecodedResult(null);
      setIsGenerating(false); // Hide loading when decode is done
      return;
    }

    const parts = tokenToDecode.split('.');
    if (parts.length !== 3) {
      setDecodeError('Invalid JWT format. JWT must have 3 parts separated by dots.');
      setDecodedResult(null);
      setIsGenerating(false); // Hide loading when decode is done
      return;
    }

    try {
      const headerDecoded = JwtVerify.base64UrlDecode(parts[0]);
      const headerJson = JSON.parse(headerDecoded);
      setHeader(JSON.stringify(headerJson, null, 2));

      const payloadDecoded = JwtVerify.base64UrlDecode(parts[1]);
      const payloadJson = JSON.parse(payloadDecoded);
      setPayload(JSON.stringify(payloadJson, null, 2));

      setSignature(parts[2]);

      const detectedAlg = headerJson.alg;
      setDecodedResult({
        header: headerJson,
        payload: payloadJson,
        algorithm: detectedAlg,
        headerEncoded: parts[0],
        payloadEncoded: parts[1],
      });

      // Auto-set the algorithm select to match the detected algorithm
      if (ALGORITHMS.includes(detectedAlg as Algorithm)) {
        setSelectedAlgorithm(detectedAlg as Algorithm);
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (payloadJson.exp !== undefined && payloadJson.exp < currentTime) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }

      setIsGenerating(false); // Hide loading when decode is done
    } catch (e) {
      setDecodeError(`Error decoding JWT: ${(e as Error).message}`);
      setDecodedResult(null);
      setIsGenerating(false); // Hide loading when decode is done
    }
  }, [input]);

  // Auto-decode when token input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      decode();
    }, 150);
    return () => clearTimeout(timer);
  }, [input, decode]);

  const verify = async () => {
    const tokenToVerify = input.trim();

    if (!tokenToVerify) {
      setVerificationError('No token to verify');
      return;
    }

    // Extract algorithm from token directly (not from decodedResult to avoid timing issues)
    const parts = tokenToVerify.split('.');
    if (parts.length !== 3) {
      setVerificationError('Invalid JWT format');
      return;
    }

    let algorithm: string;
    try {
      const headerDecoded = JwtVerify.base64UrlDecode(parts[0]);
      const headerJson = JSON.parse(headerDecoded);
      algorithm = headerJson.alg;
    } catch {
      setVerificationError('Failed to decode token header');
      return;
    }

    // Clear key error before verification
    setKeyError('');

    try {
      let verifyResult: VerificationResult;

      if (algorithm.startsWith('HS')) {
        if (!verifyKey) {
          setKeyError('Secret key is required for HMAC verification');
          setVerificationStatus(null);
          setVerificationError('');
          return;
        }

        // Use key directly - token is created with the key in its current format
        verifyResult = await JwtVerify.verify({
          token: tokenToVerify,
          secret: verifyKey
        });

      } else if (algorithm.startsWith('RS') || algorithm.startsWith('ES')) {
        const keyToUse = publicKey || verifyKey;
        if (!keyToUse) {
          setKeyError('Public key is required for verification');
          setVerificationStatus(null);
          setVerificationError('');
          return;
        }

        if (!keyToUse.includes('-----BEGIN PUBLIC KEY-----') || !keyToUse.includes('-----END PUBLIC KEY-----')) {
          setKeyError('Invalid PEM format. Public key must be in PEM format.');
          setVerificationStatus(null);
          setVerificationError('');
          return;
        }

        console.log('[JWT Decoder] Verifying with algorithm:', algorithm);
        console.log('[JWT Decoder] Public key (first 50 chars):', keyToUse.substring(0, 50));

        verifyResult = await JwtVerify.verify({
          token: tokenToVerify,
          publicKeyPem: keyToUse
        });

        console.log('[JWT Decoder] Verification result:', verifyResult);

      } else {
        setKeyError(`Unsupported algorithm: ${algorithm}`);
        setVerificationStatus(null);
        setVerificationError('');
        return;
      }

      if (verifyResult.status === 'valid') {
        setVerificationStatus('valid');
        setVerificationError('Signature verified successfully');
      } else if (verifyResult.status === 'invalid') {
        setVerificationStatus('invalid');
        setVerificationError('Invalid signature');
      } else {
        setVerificationStatus('error');
        setVerificationError(verifyResult.reason);
      }

      setIsExpired(verifyResult.isExpired);

    } catch (e: any) {
      console.error('[JWT Decoder] Verification error:', e);
      const errorMessage = (e as Error).message || '';
      const errorString = errorMessage.toLowerCase();

      // Check if this is a key-related error (more comprehensive check)
      const isKeyError =
        errorString.includes('invalid public key') ||
        errorString.includes('key') ||
        errorString.includes('pem') ||
        errorString.includes('asn.1') ||
        errorString.includes('dataerror') ||
        errorString.includes('atob') ||
        errorString.includes('base64') ||
        errorString.includes('spki') ||
        errorString.includes('importkey') ||
        errorString.includes('incorrect') ||
        errorString.includes('corrupted');

      console.log('[JWT Decoder] Is key error?', isKeyError, 'Error message:', errorMessage);

      if (isKeyError) {
        setKeyError(errorMessage);
        setVerificationStatus(null);
        setVerificationError('');
      } else {
        setVerificationStatus('error');
        setVerificationError(`Verification error: ${errorMessage}`);
      }
    }
  };

  useEffect(() => {
    // Auto-verify when decoded result exists and key is available
    const alg = decodedResult?.algorithm;
    const hasKey = alg?.startsWith('HS') ? verifyKey : ((alg?.startsWith('RS') || alg?.startsWith('ES')) && (publicKey || verifyKey));

    if (decodedResult && hasKey) {
      const timer = setTimeout(() => verify(), 300);
      return () => clearTimeout(timer);
    }
  }, [decodedResult, verifyKey, publicKey]);

  // Validate key format and show error immediately
  useEffect(() => {
    if (!decodedResult || !decodedResult.algorithm) {
      setKeyError('');
      return;
    }

    const alg = decodedResult.algorithm;
    const keyToUse = publicKey || verifyKey;

    // Clear previous errors
    setKeyError('');

    // Validate key format based on algorithm
    if (alg && alg.startsWith('HS')) {
      // For HMAC, key can be any value, no format validation needed
      // Base64URL encoding is now handled at token creation time
    } else if (alg && (alg.startsWith('RS') || alg.startsWith('ES'))) {
      // For RSA/ECDSA, key is required
      if (!keyToUse || !keyToUse.trim()) {
        setKeyError('Public key is required for verification');
      } else if (!keyToUse.includes('-----BEGIN PUBLIC KEY-----')) {
        setKeyError('Invalid PEM format. Missing "-----BEGIN PUBLIC KEY-----" header');
      } else if (!keyToUse.includes('-----END PUBLIC KEY-----')) {
        setKeyError('Invalid PEM format. Missing "-----END PUBLIC KEY-----" footer');
      }
    }
  }, [decodedResult, verifyKey, publicKey, base64UrlEncoded]);

  // Handle Base64URL encoding toggle for HS256 (legacy - now handled directly in button)
  // Load sample and generate key for a specific algorithm
  const loadSampleForKey = async (alg: Algorithm, base64Url = false) => {
    // Clear error/status states first to avoid showing wrong messages
    setVerificationStatus(null);
    setVerificationError('');
    setKeyError('');
    setSelectedAlgorithm(alg);

    // Mark as system update (not user editing key)
    isUserEditingKeyRef.current = false;

    if (alg === 'HS256') {
      const secretKey = 'your-256-bit-secret';
      const keyToUse = base64Url ? JwtVerify.base64UrlEncode(secretKey) : secretKey;

      // Generate token with the appropriate key
      const token = await encodeJWT(alg, SAMPLE_PAYLOAD, keyToUse);

      // Batch all state updates together
      startTransition(() => {
        setInput(token);
        setVerifyKey(keyToUse);
        setPublicKey('');
        setPrivateKey('');
        setBase64UrlEncoded(base64Url);
        setDecodedResult(null); // Clear decoded result to trigger re-decode
      });
    } else {
      // For RS256 and ES256, generate key pair and create signed token
      // First clear token to show loading state
      setInput('');

      // Clear status to avoid showing errors from previous algorithm
      setKeyError('');
      setVerificationStatus(null);
      setVerificationError('');
      setDecodedResult(null);

      // Small delay to ensure UI is updated
      await new Promise(resolve => setTimeout(resolve, 50));

      // Generate key pair
      const keyPair = await generateKeyForAlgorithm(alg);

      // Encode JWT using the same method as JwtEncoderTab
      const header = { alg: alg, typ: 'JWT' };
      const encodedHeader = JwtVerify.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = JwtVerify.base64UrlEncode(JSON.stringify(SAMPLE_PAYLOAD));
      const message = `${encodedHeader}.${encodedPayload}`;
      const messageData = new TextEncoder().encode(message);

      let signature: ArrayBuffer;

      if (alg === 'RS256') {
        const keyData = pemToArrayBuffer(keyPair.privateKey);
        const cryptoKey = await crypto.subtle.importKey(
          'pkcs8',
          keyData,
          { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
          false,
          ['sign']
        );
        signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, messageData);
      } else {
        const keyData = pemToArrayBuffer(keyPair.privateKey);
        const cryptoKey = await crypto.subtle.importKey(
          'pkcs8',
          keyData,
          { name: 'ECDSA', namedCurve: 'P-256' },
          false,
          ['sign']
        );
        signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, messageData);
      }

      const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const token = `${message}.${signatureBase64}`;

      console.log('[JWT Decoder] Generated token for', alg);
      console.log('[JWT Decoder] Token:', token.substring(0, 80) + '...');
      console.log('[JWT Decoder] Public key:', keyPair.publicKey.substring(0, 60) + '...');

      // Batch all state updates together
      startTransition(() => {
        setPublicKey(keyPair.publicKey);
        setVerifyKey(keyPair.publicKey);
        setInput(token);
        setBase64UrlEncoded(false);
      });
    }
  };

  // Handle algorithm change - generate new key and load sample with valid signature
  const handleAlgorithmChange = async (newAlgorithm: Algorithm) => {
    // Clear status immediately to avoid showing errors
    setVerificationStatus(null);
    setVerificationError('');
    setKeyError('');
    await loadSampleForKey(newAlgorithm);
  };

  // Load HS256 sample on initial mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadSampleForKey('HS256', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track if key is being changed by user (not system)
  const isUserEditingKeyRef = useRef(false);

  // Track pending generation to avoid flickering
  const pendingGenerationRef = useRef(false);

  // Loading state for token generation
  const [isGenerating, setIsGenerating] = useState(false);

  // Regenerate token when key changes (for HS256 only)
  useEffect(() => {
    const alg = decodedResult?.algorithm;

    // Only apply to HS256
    if (!alg || alg !== 'HS256') {
      return;
    }

    // Skip if no key
    if (!verifyKey) {
      return;
    }

    console.log('[JWT Decoder] verifyKey changed for HS256:', verifyKey.substring(0, 50));

    // Clear verification status and show loading immediately
    setVerificationStatus(null);
    setVerificationError('');
    setKeyError('');
    setIsGenerating(true);
    pendingGenerationRef.current = true;

    // Debounce to avoid regenerating while user is typing
    const timer = setTimeout(async () => {
      try {
        console.log('[JWT Decoder] Regenerating HS256 token with key:', verifyKey.substring(0, 50));

        // Generate new token with the current key
        const newToken = await encodeJWT('HS256', SAMPLE_PAYLOAD, verifyKey);

        console.log('[JWT Decoder] New token generated:', newToken.substring(0, 80) + '...');

        // Only update if this is still the pending generation
        if (pendingGenerationRef.current) {
          // Update token and clear decoded result to trigger re-decode
          setInput(newToken);
          setDecodedResult(null); // This will trigger decode() to update header/payload
          // Note: isGenerating will be set to false in decode() callback
          pendingGenerationRef.current = false;
        }
      } catch (error) {
        console.error('[JWT Decoder] Error regenerating token:', error);
        if (pendingGenerationRef.current) {
          setIsGenerating(false); // Hide loading on error
          pendingGenerationRef.current = false;
        }
      }
    }, 800); // 800ms debounce

    return () => {
      clearTimeout(timer);
      // Don't clear loading here - a new effect is about to run
    };
  }, [verifyKey]); // Only depend on verifyKey changes

  const algorithm = decodedResult?.algorithm || selectedAlgorithm;
  const isHmac = algorithm.startsWith('HS');
  const isRsa = algorithm.startsWith('RS');
  const isEcdsa = algorithm.startsWith('ES');

  const getKeyLabel = () => {
    if (isHmac) return 'Signing Key';
    return 'Public Key (PEM)';
  };

  const getKeyPlaceholder = () => {
    if (isHmac) return 'Enter your signing key';
    return '-----BEGIN PUBLIC KEY-----\n...';
  };

  const getStatusDisplay = () => {
    switch (verificationStatus) {
      case 'valid':
        return {
          icon: '🟢',
          text: 'Signature Verified',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
        };
      case 'invalid':
        return {
          icon: '🔴',
          text: 'Invalid Signature',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
        };
      case 'error':
        return {
          icon: '❌',
          text: verificationError || 'Verification Error',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
        };
      case 'pending':
        return {
          icon: '⏳',
          text: 'Verifying...',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
        };
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();

  // Block component for JWT sections
  const JwtBlock = ({
    title,
    content,
    showCopy = false,
    showClear = false,
    onClear,
    children,
  }: {
    title: string;
    content?: string;
    showCopy?: boolean;
    showClear?: boolean;
    onClear?: () => void;
    children?: React.ReactNode;
  }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="flex items-center gap-2">
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

  // Parse JWT token for color display
  const parseJwtToken = (token: string) => {
    if (!token) return { header: '', payload: '', signature: '' };
    const parts = token.split('.');
    return {
      header: parts[0] || '',
      payload: parts[1] || '',
      signature: parts[2] || '',
    };
  };

  const tokenParts = parseJwtToken(input);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - JWT Token Input */}
      <div className="space-y-4">
        <JwtBlock
          title="JWT Token"
          content={input}
          showCopy={!!input}
          showClear={!!input}
          onClear={() => setInput('')}
        >
          {/* JWT Token with 3 colors - textarea has transparent text */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              rows={10}
              className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
              style={{ color: 'transparent', caretColor: 'black' }}
            />
            {input && (
              <div className="absolute top-0 left-0 right-0 px-3 py-2 pointer-events-none">
                <div className="flex flex-wrap text-sm font-mono">
                  <span className="text-blue-600 break-all">{tokenParts.header}</span>
                  <span className="text-purple-600 break-all">.{tokenParts.payload}</span>
                  <span className="text-orange-600 break-all">.{tokenParts.signature}</span>
                </div>
              </div>
            )}
          </div>
        </JwtBlock>

        {decodeError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{decodeError}</p>
          </div>
        )}

        {isGenerating ? (
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-700">Generating token...</span>
            </div>
          </div>
        ) : (
          <>
            {signature && (
              <JwtBlock title="Signature" content={signature} showCopy>
                <code className="text-sm font-mono text-orange-600 break-all">{signature}</code>
              </JwtBlock>
            )}

            {/* Signature Verification Status - Moved to left column */}
            {(statusDisplay || keyError) && (
              <div className={`p-4 border rounded-lg ${keyError ? 'bg-red-50 border-red-200' : (statusDisplay ? `${statusDisplay.bgColor} ${statusDisplay.borderColor}` : '')}`}>
                {keyError ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">❌</span>
                      <span className="text-sm font-medium text-red-700">{keyError}</span>
                    </div>
                  </>
                ) : statusDisplay ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{statusDisplay.icon}</span>
                      <span className={`text-sm font-medium ${statusDisplay.textColor}`}>
                        {statusDisplay.text}
                      </span>
                    </div>
                    {(isExpired || (!isExpired && verificationStatus === 'valid' && decodedResult?.payload?.exp)) && (
                      <p className={`text-sm mt-2 ${statusDisplay.textColor}`}>
                        {isExpired
                          ? `This token has expired (exp: ${decodedResult?.payload?.exp})`
                          : `This token is not expired (exp: ${decodedResult?.payload?.exp})`
                        }
                      </p>
                    )}
                  </>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Column - Header, Payload, Signing Key */}
      <div className="space-y-4">
        {/* Algorithm Selection */}
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <label className="block text-xs font-medium text-gray-600 mb-1">Algorithm</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value as Algorithm)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HS256">HS256 - HMAC-SHA256</option>
            <option value="RS256">RS256 - RSASSA-PKCS1-v1_5-SHA256</option>
            <option value="ES256">ES256 - ECDSA-P256-SHA256</option>
          </select>
        </div>

        {/* Header Section */}
        {header && (
          <JwtBlock title="Header" content={header} showCopy>
            <pre
              className="text-sm font-mono"
              dangerouslySetInnerHTML={{ __html: highlightJson(header) }}
            />
          </JwtBlock>
        )}

        {/* Payload Section */}
        {payload && (
          <div>
            <JwtBlock title="Payload" content={payload} showCopy>
              <pre
                className="text-sm font-mono"
                dangerouslySetInnerHTML={{ __html: highlightJson(payload) }}
              />
            </JwtBlock>
            {isExpired && (
              <p className="text-sm text-yellow-700 mt-2 flex items-center gap-1 px-3">
                ⚠️ This token has expired (exp: {decodedResult?.payload?.exp})
              </p>
            )}
          </div>
        )}

        {/* Signing Key Section */}
        {decodedResult && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-600">{getKeyLabel()}</label>
              {isHmac && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">Base64URL Encoded</span>
                  <button
                    type="button"
                    onClick={async () => {
                      const newValue = !base64UrlEncoded;
                      const currentAlg = decodedResult?.algorithm;
                      console.log('[JWT Decoder] Toggle clicked, new value:', newValue, 'alg:', currentAlg);

                      if (verifyKey && currentAlg === 'HS256') {
                        isUserEditingKeyRef.current = false; // System update, not user editing

                        if (newValue) {
                          // Bật ON: encode current key và tạo lại token với key encoded
                          const encodedKey = JwtVerify.base64UrlEncode(verifyKey);
                          console.log('[JWT Decoder] Encoding key and regenerating token:', verifyKey, '->', encodedKey);

                          // Generate new token with encoded key
                          const newToken = await encodeJWT('HS256', SAMPLE_PAYLOAD, encodedKey);
                          startTransition(() => {
                            setInput(newToken);
                            setVerifyKey(encodedKey);
                            setBase64UrlEncoded(newValue);
                            setDecodedResult(null);
                          });
                        } else {
                          // Tắt OFF: decode current key và tạo lại token với key plain
                          let decodedKey: string;
                          try {
                            decodedKey = JwtVerify.base64UrlDecode(verifyKey);
                          } catch {
                            // If not valid Base64URL, use as-is
                            decodedKey = verifyKey;
                          }
                          console.log('[JWT Decoder] Decoding key and regenerating token:', verifyKey, '->', decodedKey);

                          // Generate new token with plain text key
                          const newToken = await encodeJWT('HS256', SAMPLE_PAYLOAD, decodedKey);
                          startTransition(() => {
                            setInput(newToken);
                            setVerifyKey(decodedKey);
                            setBase64UrlEncoded(newValue);
                            setDecodedResult(null);
                          });
                        }
                      } else {
                        setBase64UrlEncoded(newValue);
                      }
                    }}
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
              {isHmac ? (
                <input
                  type="text"
                  value={verifyKey}
                  onChange={(e) => {
                    isUserEditingKeyRef.current = true; // Mark as user editing
                    setVerifyKey(e.target.value);
                    setPublicKey('');
                    setKeyError(''); // Clear key error when user types
                  }}
                  placeholder={getKeyPlaceholder()}
                  className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <textarea
                  value={publicKey || verifyKey}
                  onChange={(e) => {
                    setPublicKey(e.target.value);
                    setVerifyKey(e.target.value);
                    setKeyError(''); // Clear key error when user types
                  }}
                  placeholder={getKeyPlaceholder()}
                  rows={6}
                  className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {/* Signature Formula */}
              <SignatureFormula algorithm={algorithm as Algorithm} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
