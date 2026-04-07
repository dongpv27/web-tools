'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { X, Copy } from 'lucide-react';
import type { Algorithm } from './JwtToolClient';
import { JwtVerify, type VerificationResult } from '@/lib/jwt-verify';
import SignatureFormula from './SignatureFormula';
import JwtTokenInput from './JwtTokenInput';
import JsonInput from './JsonInput';

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

async function generateKeyForAlgorithm(
  algorithm: Algorithm,
  base64UrlEncoded: boolean
): Promise<{ privateKey: string; publicKey: string }> {
  if (algorithm === 'HS256') {
    if (base64UrlEncoded) {
      return { privateKey: '', publicKey: '' };
    }
    return { privateKey: 'your-256-bit-secret', publicKey: '' };
  } else if (algorithm === 'RS256') {
    return await generateRsaKeyPair();
  } else if (algorithm === 'ES256') {
    return await generateEcdsaKeyPair();
  }
  return { privateKey: '', publicKey: '' };
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

  // Track when user recently pasted a JWT token (for verification, not regeneration)
  const lastInputChangeTimeRef = useRef(0);

  // Track when verification was last completed (to avoid clearing decodedResult)
  const lastVerificationTimeRef = useRef(0);

  // Track if key is being changed by user (not system)
  const isUserEditingKeyRef = useRef(false);

  // Track pending generation to avoid flickering
  const pendingGenerationRef = useRef(false);

  // Loading state for token generation
  const [isGenerating, setIsGenerating] = useState(false);

  // Decoding state
  const [decodeError, setDecodeError] = useState('');
  const [decodedResult, setDecodedResult] = useState<DecodedResult | null>(null);
  const [signature, setSignature] = useState('');
  const [headerError, setHeaderError] = useState('');
  const [payloadError, setPayloadError] = useState('');

  // Algorithm and key state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('HS256');
  const [verifyKey, setVerifyKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  // Verification state
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [verificationError, setVerificationError] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [base64UrlEncoded, setBase64UrlEncoded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Track initialization
  const hasInitialized = useRef(false);
  const [_, startTransition] = useTransition();

  // Validate JSON function
  const isValidJson = (str: string): { isValid: boolean; error?: string } => {
    if (!str || str.trim() === '') {
      return { isValid: true };
    }
    try {
      JSON.parse(str);
      return { isValid: true };
    } catch (e) {
      return { isValid: false, error: (e as Error).message };
    }
  };

  // Detect if a key is Base64URL encoded (for HS256)
  // Uses round-trip check: decode then re-encode, if result matches → it's Base64URL
  const isBase64UrlEncoded = (key: string): boolean => {
    if (!key) return false;
    if (key.includes('-----')) return false; // PEM format
    const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
    if (!base64UrlPattern.test(key)) return false;
    try {
      const decoded = JwtVerify.base64UrlDecode(key);
      const reEncoded = JwtVerify.base64UrlEncode(decoded);
      return reEncoded === key;
    } catch {
      return false;
    }
  };

  // Handle clear JWT token - clear all related state
  const handleClear = useCallback(() => {
    setInput('');
    setHeader('');
    setPayload('');
    setSignature('');
    setDecodedResult(null);
    setDecodeError('');
    setHeaderError('');
    setPayloadError('');
    setVerificationStatus(null);
    setVerificationError('');
    setKeyError('');
    setIsExpired(false);
    setBase64UrlEncoded(false);
    setIsVerifying(false);
    setIsGenerating(false);
    // Keep verifyKey, publicKey, privateKey, selectedAlgorithm
  }, []);

  // Decode JWT token
  const decode = useCallback(() => {
    const tokenToDecode = input.trim();
    setDecodeError('');
    setHeaderError('');
    setPayloadError('');

    if (!tokenToDecode) {
      setDecodedResult(null);
      setIsGenerating(false);
      return;
    }

    const parts = tokenToDecode.split('.');
    if (parts.length !== 3) {
      setDecodeError('Invalid JWT format. JWT must have 3 parts separated by dots.');
      setDecodedResult(null);
      setIsGenerating(false);
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

      // Reset Base64URL toggle when decoding new token (will be set by verify if needed)
      setBase64UrlEncoded(false);

      const currentTime = Math.floor(Date.now() / 1000);
      setIsExpired(payloadJson.exp !== undefined && payloadJson.exp < currentTime);

    } catch (e) {
      setDecodeError(`Error decoding JWT: ${(e as Error).message}`);
      setDecodedResult(null);
      setIsGenerating(false);
    }
  }, [input]);

  // Auto-decode when token input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      decode();
    }, 150);
    return () => clearTimeout(timer);
  }, [input, decode]);

  // Verification function
  const verify = async () => {
    // Set loading states
    setIsGenerating(true);
    setIsVerifying(true);
    setVerificationStatus('pending');
    setVerificationError('');
    setKeyError('');

    const tokenToVerify = input.trim();

    if (!tokenToVerify) {
      setVerificationError('No token to verify');
      setIsVerifying(false);
      return;
    }

    const parts = tokenToVerify.split('.');
    if (parts.length !== 3) {
      setVerificationError('Invalid JWT format');
      setIsVerifying(false);
      return;
    }

    let algorithm: string;
    try {
      const headerDecoded = JwtVerify.base64UrlDecode(parts[0]);
      const headerJson = JSON.parse(headerDecoded);
      algorithm = headerJson.alg;
    } catch {
      setVerificationError('Failed to decode token header');
      setIsVerifying(false);
      return;
    }

    // Use the Base64URL toggle value set by user
    // Do NOT auto-detect - raw printable keys can be mistaken for Base64URL
    let shouldDecodeKey = base64UrlEncoded;

    try {
      let verifyResult: VerificationResult;

      if (algorithm.startsWith('HS')) {
        if (!verifyKey) {
          setKeyError('Secret key is required for HMAC verification');
          setVerificationStatus(null);
          setVerificationError('');
          setIsVerifying(false);
          return;
        }

        // If Base64URL Encoded is toggled ON, decode the key first
        const secretToUse = shouldDecodeKey
          ? JwtVerify.base64UrlDecode(verifyKey)
          : verifyKey;

        verifyResult = await JwtVerify.verify({
          token: tokenToVerify,
          secret: secretToUse
        });

      } else if (algorithm.startsWith('RS') || algorithm.startsWith('ES')) {
        const keyToUse = verifyKey;
        if (!keyToUse) {
          setKeyError('Public key is required for verification');
          setVerificationStatus(null);
          setVerificationError('');
          setIsVerifying(false);
          return;
        }

        if (!keyToUse.includes('-----BEGIN PUBLIC KEY-----') || !keyToUse.includes('-----END PUBLIC KEY-----')) {
          setKeyError('Invalid PEM format. Public key must be in PEM format.');
          setVerificationStatus(null);
          setVerificationError('');
          setIsVerifying(false);
          return;
        }

        verifyResult = await JwtVerify.verify({
          token: tokenToVerify,
          publicKeyPem: keyToUse
        });

      } else {
        setKeyError(`Unsupported algorithm: ${algorithm}`);
        setVerificationStatus(null);
        setVerificationError('');
        setIsVerifying(false);
        return;
      }

      if (verifyResult.status === 'valid') {
        setVerificationStatus('valid');
        setVerificationError('Signature verified successfully');
        // Track when verification was completed
        lastVerificationTimeRef.current = Date.now();
      } else if (verifyResult.status === 'invalid') {
        setVerificationStatus('invalid');
        setVerificationError('Invalid signature');
        lastVerificationTimeRef.current = Date.now();
      } else {
        setVerificationStatus('error');
        setVerificationError(verifyResult.reason);
        lastVerificationTimeRef.current = Date.now();
      }

      setIsExpired(verifyResult.isExpired);

    } catch (e: any) {
      setVerificationStatus('error');
      setVerificationError(`Verification error: ${e?.message || 'Unknown error'}`);
      lastVerificationTimeRef.current = Date.now();
    } finally {
      // Always clear loading states at the end
      setIsVerifying(false);
      setIsGenerating(false);
    }
  };

  // Auto-verify when decoded result exists and key is available
  useEffect(() => {
    const alg = decodedResult?.algorithm;
    const hasKey = alg?.startsWith('HS') ? verifyKey : ((alg?.startsWith('RS') || alg?.startsWith('ES')) && (publicKey || verifyKey));

    if (!decodedResult || !hasKey) {
      return;
    }

    const timer = setTimeout(() => {
      verify();
    }, 300);
    return () => clearTimeout(timer);
  }, [decodedResult, verifyKey, publicKey]);

  // Validate key format and show error immediately
  useEffect(() => {
    if (!decodedResult || !decodedResult.algorithm) {
      setKeyError('');
      setHeaderError('');
      setPayloadError('');
      return;
    }

    const alg = decodedResult?.algorithm;

    // Validate Header JSON
    if (alg && alg.startsWith('HS')) {
      const headerValidation = isValidJson(header);
      if (!headerValidation.isValid) {
        setHeaderError(headerValidation.error || 'Invalid Header JSON format');
      }
    } else if (alg && (alg.startsWith('RS') || alg.startsWith('ES'))) {
      const headerValidation = isValidJson(header);
      if (!headerValidation.isValid) {
        setHeaderError(headerValidation.error || 'Invalid Header JSON format');
      }
    }

    // Validate Payload JSON
    if (alg && alg.startsWith('HS')) {
      const payloadValidation = isValidJson(payload);
      if (!payloadValidation.isValid) {
        setPayloadError(payloadValidation.error || 'Invalid Payload JSON format');
      }
    } else if (alg && (alg.startsWith('RS') || alg.startsWith('ES'))) {
      const payloadValidation = isValidJson(payload);
      if (!payloadValidation.isValid) {
        setPayloadError(payloadValidation.error || 'Invalid Payload JSON format');
      }
    }
  }, [header, payload, decodedResult?.algorithm]);

  // Handle Base64URL encoding toggle for HS256 (legacy - now handled directly in button)
  // Load sample and generate key for a specific algorithm
  const loadSampleForKey = async (alg: Algorithm, base64Url = false) => {
    // Clear error/status states first to avoid showing wrong messages
    setVerificationStatus(null);
    setVerificationError('');
    setKeyError('');
    setHeaderError('');
    setPayloadError('');

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
        setDecodedResult(null);
      });
    } else {
      // For RS256 and ES256, generate key pair and create signed token
      // First clear token to show loading state
      setInput('');

      // Clear status to avoid showing errors from previous algorithm
      setKeyError('');
      setVerificationStatus(null);
      setVerificationError('');
      setHeaderError('');
      setPayloadError('');

      // Small delay to ensure UI is updated
      await new Promise(resolve => setTimeout(resolve, 50));

      // Generate key pair
      const keyPair = await generateKeyForAlgorithm(alg, base64Url);

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
        signature = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, cryptoKey, messageData);
      } else if (alg === 'ES256') {
        const keyData = pemToArrayBuffer(keyPair.privateKey);
        const cryptoKey = await crypto.subtle.importKey(
          'pkcs8',
          keyData,
          { name: 'ECDSA', namedCurve: 'P-256' },
          false,
          ['sign']
        );
        signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, messageData);
      } else {
        return;
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
        setDecodedResult(null);
      });
    }
  };

  // Handle algorithm change - generate new key and load sample with valid signature
  const handleAlgorithmChange = async (newAlgorithm: Algorithm) => {
    // Clear status immediately to avoid showing errors
    setVerificationStatus(null);
    setVerificationError('');
    setKeyError('');
    setHeaderError('');
    setPayloadError('');

    await loadSampleForKey(newAlgorithm);
  };

  // Load HS256 sample on initial mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadSampleForKey('HS256', false);
    }
  }, []);

  // Regenerate token when key changes (for HS256 only)
  // DISABLED: This interferes with user input when entering verification key
  // Users should paste JWT token with key for verification, not have token regenerated
  /*
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

    // Skip regeneration if key change happened shortly after input change
    // This indicates that user is pasting a JWT token with its key for verification
    const timeSinceInputChanged = Date.now() - lastInputChangeTimeRef.current;
    if (timeSinceInputChanged < 2000) {
      console.log('[JWT Decoder] Skipping token regeneration - user is pasting JWT with key for verification');
      return;
    }

    // Skip regeneration if verification was recently completed
    // This prevents clearing decodedResult after verification
    const timeSinceVerification = Date.now() - lastVerificationTimeRef.current;
    if (timeSinceVerification < 5000) {
      console.log('[JWT Decoder] Skipping token regeneration - verification was recently completed');
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
          setDecodedResult(null);
          // Note: isGenerating will be set to false in decode() callback
          pendingGenerationRef.current = false;
        }
      } catch (error) {
        console.error('[JWT Decoder] Error regenerating token:', error);
        if (pendingGenerationRef.current) {
          setIsGenerating(false);
          pendingGenerationRef.current = false;
        }
      }
    }, 800); // 800ms debounce

    return () => {
      clearTimeout(timer);
    };
  }, [verifyKey]);
  */

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
    // Priority: loading > verification status
    if (isVerifying) {
      return {
        icon: '⏳',
        text: 'Verifying...',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-700',
      };
    }

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
      {/* Left Column - JWT Token Input */}
      <div className="space-y-4">
        <JwtBlock
          title="JWT Token"
          content={input}
          showCopy={!!input}
          showClear={!!input}
          onClear={handleClear}
        >
          {/* JWT Token with 3 colors - textarea has transparent text */}
          <JwtTokenInput
            input={input}
            onChange={setInput}
          />
        </JwtBlock>

        {/* JSON Validation Errors */}
        {(headerError || payloadError) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">❌</span>
              <span className="text-sm font-medium text-red-700">{headerError || payloadError}</span>
            </div>
          </div>
        )}

        {decodeError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{decodeError}</p>
          </div>
        )}

        {isGenerating && (
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-700">Generating token...</span>
            </div>
          </div>
        )}

        {/* Signature - only show when decoded */}
        {decodedResult && signature && (
          <JwtBlock title="Signature" content={signature} showCopy>
            <code className="text-sm font-mono text-orange-600 break-all">{signature}</code>
          </JwtBlock>
        )}

        {/* Signing Key Section */}
        {(decodedResult || input || selectedAlgorithm) && (
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
                <>
                  <input
                    type="text"
                    value={verifyKey}
                    onChange={(e) => {
                      isUserEditingKeyRef.current = true; // Mark as user editing
                      const newKey = e.target.value;
                      setVerifyKey(newKey);
                      setPublicKey('');
                      setKeyError('');
                      // Auto-detect Base64URL encoding when key changes
                      const alg = decodedResult?.algorithm;
                      if (alg?.startsWith('HS')) {
                        setBase64UrlEncoded(isBase64UrlEncoded(newKey));
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 ${
                      keyError ? 'focus:ring-red-500 bg-red-50' : 'focus:ring-blue-500 bg-white'
                    }`}
                    placeholder={getKeyPlaceholder()}
                  />
                  <div className="flex justify-between mt-1 text-xs">
                    <span className="text-gray-500">
                      {base64UrlEncoded
                        ? `Decoded length: ${new TextEncoder().encode(verifyKey).length} bytes`
                        : `Current length: ${new TextEncoder().encode(verifyKey).length} bytes`
                    }
                    </span>
                    <span className={new TextEncoder().encode(verifyKey).length >= 32 ? 'text-green-600' : 'text-red-600'}>
                      Required: 32 bytes
                    </span>
                  </div>
                </>
              ) : (
                <textarea
                  value={verifyKey}
                  onChange={(e) => {
                    setVerifyKey(e.target.value);
                    setPublicKey(e.target.value);
                    setKeyError('');
                  }}
                  rows={8}
                  className="w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={getKeyPlaceholder()}
                />
              )}

              {/* Signature Formula */}
              <SignatureFormula algorithm={algorithm as Algorithm} />
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Algorithm, Header, Payload, Verification Status */}
      <div className="space-y-4">
        {/* Algorithm Selection */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <label className="block text-xs font-medium text-gray-600 mb-1">Algorithm</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value as Algorithm)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option value="HS256">HS256 - HMAC-SHA256</option>
            <option value="RS256">RS256 - RSASSA-PKCS1-v1_5-SHA256</option>
            <option value="ES256">ES256 - ECDSA-P256-SHA256</option>
          </select>
        </div>

        {/* Header Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Header</h3>
            <div className="flex items-center gap-2">
              {headerError && (
                <span className="text-xl">⚠️</span>
              )}
              {header && (
                <button
                  onClick={() => navigator.clipboard.writeText(header)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Copy Header"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="p-4 bg-white">
            <JsonInput
              value={header}
              rows={4}
              autoHeight
              placeholder=""
              error={headerError}
              readOnly
            />
          </div>
        </div>

        {/* Payload Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Payload</h3>
            <div className="flex items-center gap-2">
              {payloadError && (
                <span className="text-xl">⚠️</span>
              )}
              {payload && (
                <button
                  onClick={() => navigator.clipboard.writeText(payload)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Copy Payload"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {/* Content */}
          <div className="p-4 bg-white">
            <JsonInput
              value={payload}
              rows={6}
              autoHeight
              placeholder=""
              error={payloadError}
              readOnly
            />
          </div>
        </div>

        {/* Signature Verification Status */}
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
      </div>
    </div>
  );
}