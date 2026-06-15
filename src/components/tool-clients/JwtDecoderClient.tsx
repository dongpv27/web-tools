'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';
import { trackToolRun } from '@/lib/analytics';

type VerificationStatus = 'valid' | 'invalid' | 'error' | 'pending' | null;

interface DecodedResult {
  header: any;
  payload: any;
  algorithm: string;
}

// ============================================================================
// Base64URL Helpers
// ============================================================================

const base64UrlEncode = (str: string): string => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

// ============================================================================
// JWT Verification Functions
// ============================================================================

/**
 * Verify HMAC signature
 */
const verifyHmac = async (
  message: string,
  sig: string,
  secret: string,
  algorithm: 'SHA-256' | 'SHA-384' | 'SHA-512'
): Promise<boolean> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['verify']
  );

  // Convert signature from Base64URL to buffer
  let sigBase64 = sig.replace(/-/g, '+').replace(/_/g, '/');
  while (sigBase64.length % 4) sigBase64 += '=';
  const signatureData = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

  return await crypto.subtle.verify('HMAC', key, messageData, signatureData);
};

/**
 * Verify RSA signature
 */
const verifyRsa = async (
  message: string,
  sig: string,
  publicKeyPem: string,
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512'
): Promise<boolean> => {
  try {
    // Convert PEM to ArrayBuffer
    const pemContent = publicKeyPem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s/g, '');

    const binaryString = atob(pemContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
      'spki',
      bytes.buffer,
      { name: 'RSA-PKCS1-v1_5', hash },
      false,
      ['verify']
    );

    // Convert signature
    let sigBase64 = sig.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) sigBase64 += '=';
    const signatureData = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      messageData,
      signatureData
    );
  } catch {
    return false;
  }
};

/**
 * Verify ECDSA signature
 */
const verifyEcdsa = async (
  message: string,
  sig: string,
  publicKeyPem: string,
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512',
  namedCurve: 'P-256' | 'P-384' | 'P-521'
): Promise<boolean> => {
  try {
    // Convert PEM to ArrayBuffer
    const pemContent = publicKeyPem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s/g, '');

    const binaryString = atob(pemContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
      'spki',
      bytes.buffer,
      { name: 'ECDSA', namedCurve },
      false,
      ['verify']
    );

    // Convert signature
    let sigBase64 = sig.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) sigBase64 += '=';
    const signatureData = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

    return await crypto.subtle.verify(
      { name: 'ECDSA', hash },
      key,
      messageData,
      signatureData
    );
  } catch {
    return false;
  }
};

// ============================================================================
// Main Component
// ============================================================================

export default function JwtDecoderClient() {
  // Decode state
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [decodedResult, setDecodedResult] = useState<DecodedResult | null>(null);
  const [decodeError, setDecodeError] = useState('');

  // Verification state
  const [verifyKey, setVerifyKey] = useState('');
  const [base64UrlEncoded, setBase64UrlEncoded] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);
  const [verificationError, setVerificationError] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Sync state
  const [isAutoLoaded, setIsAutoLoaded] = useState(false);
  const [shouldAutoDecode, setShouldAutoDecode] = useState(false);

  // Auto-decode when token is auto-loaded
  useEffect(() => {
    if (shouldAutoDecode && input.trim()) {
      decodeRef.current();
      setShouldAutoDecode(false);
    }
  }, [shouldAutoDecode, input]);

  // Auto-load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("jwt_token");
    if (savedToken) {
      setInput(savedToken);
      setIsAutoLoaded(true);

      // Also load secret key and settings for auto-verify
      const savedSecret = localStorage.getItem("jwt_secret");
      const savedBase64Encoded = localStorage.getItem("jwt_base64_encoded");
      if (savedSecret) {
        setVerifyKey(savedSecret);
      }
      if (savedBase64Encoded) {
        setBase64UrlEncoded(savedBase64Encoded === 'true');
      }

      // Trigger auto-decode after state updates
      setShouldAutoDecode(true);
    }
  }, []);

  // Listen for JWT update events from Encoder
  useEffect(() => {
    const handler = () => {
      const savedToken = localStorage.getItem("jwt_token");
      if (savedToken) {
        setInput(savedToken);
        setIsAutoLoaded(true);

        // Also load secret key and settings for auto-verify
        const savedSecret = localStorage.getItem("jwt_secret");
        const savedBase64Encoded = localStorage.getItem("jwt_base64_encoded");
        if (savedSecret) {
          setVerifyKey(savedSecret);
        }
        if (savedBase64Encoded) {
          setBase64UrlEncoded(savedBase64Encoded === 'true');
        }

        // Trigger auto-decode after state updates
        setShouldAutoDecode(true);
      }
    };
    window.addEventListener("jwt:update", handler as EventListener);
    return () => window.removeEventListener("jwt:update", handler as EventListener);
  }, []);

  // Decode function
  const decode = useCallback(() => {
    setDecodeError('');
    setHeader('');
    setPayload('');
    setSignature('');
    setDecodedResult(null);
    setVerificationStatus(null);
    setVerificationError('');
    setIsExpired(false);

    if (!input.trim()) {
      setDecodeError('Please enter a JWT token');
      return;
    }

    const parts = input.trim().split('.');
    if (parts.length !== 3) {
      setDecodeError('Invalid JWT format. JWT must have 3 parts separated by dots.');
      return;
    }

    try {
      // Decode header
      const headerDecoded = base64UrlDecode(parts[0]);
      const headerJson = JSON.parse(headerDecoded);
      setHeader(JSON.stringify(headerJson, null, 2));

      // Decode payload
      const payloadDecoded = base64UrlDecode(parts[1]);
      const payloadJson = JSON.parse(payloadDecoded);
      setPayload(JSON.stringify(payloadJson, null, 2));

      // Show signature
      setSignature(parts[2]);

      // Set decoded result for algorithm detection
      setDecodedResult({
        header: headerJson,
        payload: payloadJson,
        algorithm: headerJson.alg,
      });
      trackToolRun('jwt-decoder', 'decode');

      // Check expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (payloadJson.exp !== undefined && payloadJson.exp < currentTime) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }
    } catch (e) {
      setDecodeError(`Error decoding JWT: ${(e as Error).message}`);
      setDecodedResult(null);
    }
  }, [input]);

  // Ref to keep decode function stable for useEffect
  const decodeRef = useRef(decode);
  decodeRef.current = decode;

  // Verification function
  const verify = async () => {
    if (!decodedResult) {
      setVerificationError('Please decode a JWT first');
      return;
    }

    const parts = input.trim().split('.');
    if (parts.length !== 3) {
      setVerificationStatus('error');
      setVerificationError('Invalid JWT format');
      return;
    }

    const algorithm = decodedResult.algorithm;
    const signingInput = `${parts[0]}.${parts[1]}`;

    try {
      let isValid = false;

      if (algorithm.startsWith('HS')) {
        // HMAC verification
        if (!verifyKey) {
          setVerificationStatus('error');
          setVerificationError('Secret key is required for HMAC verification');
          return;
        }

        let actualKey = verifyKey;
        if (base64UrlEncoded) {
          try {
            actualKey = base64UrlDecode(verifyKey);
          } catch {
            setVerificationStatus('error');
            setVerificationError('Invalid Base64URL encoded secret');
            return;
          }
        }

        // Determine hash algorithm
        let hash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256';
        if (algorithm === 'HS384') hash = 'SHA-384';
        else if (algorithm === 'HS512') hash = 'SHA-512';

        isValid = await verifyHmac(signingInput, parts[2], actualKey, hash);

      } else if (algorithm.startsWith('RS')) {
        // RSA verification
        if (!verifyKey) {
          setVerificationStatus('error');
          setVerificationError('Public key is required for RSA verification');
          return;
        }

        // Validate PEM format
        if (!verifyKey.includes('-----BEGIN PUBLIC KEY-----') || !verifyKey.includes('-----END PUBLIC KEY-----')) {
          setVerificationStatus('error');
          setVerificationError('Invalid PEM format. Public key must be in PEM format.');
          return;
        }

        let rsaHash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256';
        if (algorithm === 'RS384') rsaHash = 'SHA-384';
        else if (algorithm === 'RS512') rsaHash = 'SHA-512';

        isValid = await verifyRsa(signingInput, parts[2], verifyKey, rsaHash);

      } else if (algorithm.startsWith('ES')) {
        // ECDSA verification
        if (!verifyKey) {
          setVerificationStatus('error');
          setVerificationError('Public key is required for ECDSA verification');
          return;
        }

        // Validate PEM format
        if (!verifyKey.includes('-----BEGIN PUBLIC KEY-----') || !verifyKey.includes('-----END PUBLIC KEY-----')) {
          setVerificationStatus('error');
          setVerificationError('Invalid PEM format. Public key must be in PEM format.');
          return;
        }

        let ecHash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256';
        let ecCurve: 'P-256' | 'P-384' | 'P-521' = 'P-256';
        if (algorithm === 'ES384') { ecHash = 'SHA-384'; ecCurve = 'P-384'; }
        else if (algorithm === 'ES512') { ecHash = 'SHA-512'; ecCurve = 'P-521'; }

        isValid = await verifyEcdsa(signingInput, parts[2], verifyKey, ecHash, ecCurve);

      } else {
        setVerificationStatus('error');
        setVerificationError(`Unsupported algorithm: ${algorithm}`);
        return;
      }

      if (isValid) {
        setVerificationStatus('valid');
        setVerificationError('Signature verified successfully');
      } else {
        setVerificationStatus('invalid');
        setVerificationError('Invalid signature');
      }
    } catch (e) {
      setVerificationStatus('error');
      setVerificationError(`Verification error: ${(e as Error).message}`);
    }
  };

  // Auto-verify when input or key changes
  useEffect(() => {
    if (decodedResult && verifyKey) {
      // Debounce verification
      const timer = setTimeout(() => {
        verify();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [input, verifyKey, base64UrlEncoded]);

  // Clear all
  const clearAll = () => {
    // Clear localStorage
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("jwt_secret");
    localStorage.removeItem("jwt_algorithm");
    localStorage.removeItem("jwt_base64_encoded");

    setInput('');
    setHeader('');
    setPayload('');
    setSignature('');
    setDecodeError('');
    setDecodedResult(null);
    setVerifyKey('');
    setBase64UrlEncoded(false);
    setVerificationStatus(null);
    setVerificationError('');
    setIsExpired(false);
    setIsAutoLoaded(false);
  };

  // Load sample
  const loadSample = () => {
    setInput('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    setDecodeError('');
  };

  const algorithm = decodedResult?.algorithm || '';
  const isHmac = algorithm.startsWith('HS');
  const isRsa = algorithm.startsWith('RS');
  const isEcdsa = algorithm.startsWith('ES');

  // Get key label
  const getKeyLabel = () => {
    if (isHmac) return 'Secret Key';
    return 'Public Key (PEM)';
  };

  const getKeyPlaceholder = () => {
    if (isHmac) return 'Enter your shared secret key';
    return '-----BEGIN PUBLIC KEY-----\n...';
  };

  // Get status UI
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

  return (
    <div className="space-y-6">
      {/* JWT Token Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">JWT Token</label>
          <button
            onClick={loadSample}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Paste your JWT token here..."
          rows={4}
        />
      </div>

      {/* Decode Action Button */}
      <div className="flex gap-2">
        <button
          onClick={decode}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Decode JWT
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Decode Error */}
      {decodeError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{decodeError}</p>
        </div>
      )}

      {/* Decoded Results */}
      {header && (
        <div className="space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">HEADER</span>
              <span className="text-sm text-gray-500">Algorithm & Token Type</span>
            </div>
            <ToolResult value={header} label="" language="json" />
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">PAYLOAD</span>
              <span className="text-sm text-gray-500">Data</span>
            </div>
            <ToolResult value={payload} label="" language="json" />
          </div>

          {/* Signature (original) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">SIGNATURE</span>
              <span className="text-sm text-gray-500">Original</span>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <code className="text-sm font-mono text-gray-700 break-all">{signature}</code>
            </div>
          </div>

          {/* Hint when auto-loaded */}
          {isAutoLoaded && (
            <div className="text-sm text-gray-500">
              Last generated token loaded automatically
            </div>
          )}

          {/* Clear token button */}
          {localStorage.getItem("jwt_token") && (
            <button
              onClick={() => {
                localStorage.removeItem("jwt_token");
                localStorage.removeItem("jwt_secret");
                localStorage.removeItem("jwt_algorithm");
                localStorage.removeItem("jwt_base64_encoded");
                setInput('');
                setVerifyKey('');
                setBase64UrlEncoded(false);
                setIsAutoLoaded(false);
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear saved token
            </button>
          )}
        </div>
      )}

      {/* JWT Signature Verification Section */}
      {decodedResult && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            JWT Signature Verification (Optional)
          </h3>

          {/* Hint */}
          <p className="text-sm text-gray-600">
            To verify this token, enter the secret or public key used during signing.
          </p>

          {/* Key Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{getKeyLabel()}</label>
              {isHmac && (
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
            {isHmac ? (
              <input
                type="text"
                value={verifyKey}
                onChange={(e) => setVerifyKey(e.target.value)}
                placeholder={getKeyPlaceholder()}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <textarea
                value={verifyKey}
                onChange={(e) => setVerifyKey(e.target.value)}
                placeholder={getKeyPlaceholder()}
                rows={10}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Verification Status */}
          {statusDisplay && (
            <div className={`p-4 border rounded-lg ${statusDisplay.bgColor} ${statusDisplay.borderColor}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{statusDisplay.icon}</span>
                <span className={`text-sm font-medium ${statusDisplay.textColor}`}>
                  {statusDisplay.text}
                </span>
              </div>
              {verificationError && (
                <p className={`text-sm mt-2 ${statusDisplay.textColor}`}>
                  {verificationError}
                </p>
              )}
              {isExpired && (
                <p className="text-sm text-yellow-700 mt-2">
                  ⚠️ This token has expired (exp: {decodedResult.payload?.exp})
                </p>
              )}
              {!isExpired && verificationStatus === 'valid' && decodedResult.payload?.exp && (
                <p className="text-sm text-green-700 mt-2">
                  ✓ This token is not expired (exp: {decodedResult.payload?.exp})
                </p>
              )}
            </div>
          )}

          {/* Algorithm Info */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Detected Algorithm:</strong> {decodedResult.algorithm}
              {isHmac && ' (HMAC - uses Secret Key)'}
              {isRsa && ' (RSA - uses Public Key)'}
              {isEcdsa && ' (ECDSA - uses Public Key)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
