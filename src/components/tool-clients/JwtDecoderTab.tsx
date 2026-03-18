'use client';

import { useState, useEffect, useCallback } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';
import type { Algorithm } from './JwtToolClient';
import { JwtVerify, type VerificationResult } from '@/lib/jwt-verify';

type VerificationStatus = 'valid' | 'invalid' | 'error' | 'pending' | null;

interface DecodedResult {
  header: any;
  payload: any;
  algorithm: string;
}

interface JwtDecoderTabProps {
  sharedState: {
    token: string;
    secretKey: string;
    algorithm: Algorithm;
    base64UrlEncoded: boolean;
    publicKey?: string;
  };
  onDecode: (token: string) => void;
  onKeyUpdate: (secretKey: string, publicKey?: string, base64UrlEncoded?: boolean) => void;
}

export default function JwtDecoderTab({ sharedState, onDecode, onKeyUpdate }: JwtDecoderTabProps) {
  // Local state for manual editing
  const [input, setInput] = useState(sharedState.token);
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [decodedResult, setDecodedResult] = useState<DecodedResult | null>(null);
  const [decodeError, setDecodeError] = useState('');

  // Verification state
  const [verifyKey, setVerifyKey] = useState(sharedState.secretKey || '');
  const [publicKey, setPublicKey] = useState<string>(sharedState.publicKey || '');
  const [base64UrlEncoded, setBase64UrlEncoded] = useState(sharedState.base64UrlEncoded);
  const [keyFromSync, setKeyFromSync] = useState(sharedState.secretKey ? true : false); // Set true if key exists in sharedState (from sync)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);
  const [verificationError, setVerificationError] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Sync input from shared state when it changes (and not manually editing)
  useEffect(() => {
    if (sharedState.token && sharedState.token !== input) {
      setInput(sharedState.token);
    }
  }, [sharedState.token]);

  // Sync verify key from shared state when it changes
  useEffect(() => {
    console.log('[JWT Decoder - Sync Key Effect]', {
      sharedStateSecretKey: sharedState.secretKey,
      sharedStatePublicKey: sharedState.publicKey,
      currentVerifyKey: verifyKey,
      shouldSync: sharedState.secretKey && sharedState.secretKey !== verifyKey
    });
    if (sharedState.secretKey && sharedState.secretKey !== verifyKey) {
      setVerifyKey(sharedState.secretKey);
      setKeyFromSync(true); // Key came from sync (already decoded from Encoder)
    }
  }, [sharedState.secretKey]);

  // Sync public key from shared state when it changes (for RSA/ECDSA)
  useEffect(() => {
    console.log('[JWT Decoder - Sync Public Key Effect]', {
      sharedStatePublicKey: sharedState.publicKey,
      currentPublicKey: publicKey,
      shouldSync: sharedState.publicKey && sharedState.publicKey !== publicKey
    });
    if (sharedState.publicKey && sharedState.publicKey !== publicKey) {
      setPublicKey(sharedState.publicKey);
    }
  }, [sharedState.publicKey]);

  // Sync base64UrlEncoded from shared state
  useEffect(() => {
    if (sharedState.base64UrlEncoded !== base64UrlEncoded) {
      setBase64UrlEncoded(sharedState.base64UrlEncoded);
    }
  }, [sharedState.base64UrlEncoded]);

  // Sync verify key back to shared state when user manually changes it
  useEffect(() => {
    if (onKeyUpdate && !keyFromSync) {
      if (verifyKey && verifyKey !== sharedState.secretKey) {
        onKeyUpdate(verifyKey, publicKey, base64UrlEncoded);
      }
    }
  }, [verifyKey, publicKey, base64UrlEncoded, keyFromSync, onKeyUpdate]);

  // Auto-decode when token changes (from encoder or user input)
  useEffect(() => {
    const tokenToDecode = (input.trim() || sharedState.token.trim());
    console.log('[JWT Decoder - Token Change Effect]', {
      sharedStateToken: sharedState.token,
      input,
      tokenToDecode,
      shouldDecode: !!tokenToDecode
    });
    if (tokenToDecode) {
      decode();
    }
  }, [sharedState.token, input]);

  const decode = useCallback(() => {
    const tokenToDecode = input.trim() || sharedState.token.trim();
    setDecodeError('');
    setHeader('');
    setPayload('');
    setSignature('');
    setVerificationStatus(null);
    setVerificationError('');
    setIsExpired(false);

    if (!tokenToDecode) {
      setDecodeError('Please enter a JWT token');
      return;
    }

    const parts = tokenToDecode.split('.');
    if (parts.length !== 3) {
      setDecodeError('Invalid JWT format. JWT must have 3 parts separated by dots.');
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

      setDecodedResult({
        header: headerJson,
        payload: payloadJson,
        algorithm: headerJson.alg,
      });

      console.log('[JWT Decoder - Decode Success]', {
        algorithm: headerJson.alg,
        payload: payloadJson,
        decodedResult: decodedResult
      });

      const currentTime = Math.floor(Date.now() / 1000);
      if (payloadJson.exp !== undefined && payloadJson.exp < currentTime) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }

      // Sync with parent
      if (tokenToDecode !== sharedState.token) {
        onDecode(tokenToDecode);
      }
    } catch (e) {
      setDecodeError(`Error decoding JWT: ${(e as Error).message}`);
      setDecodedResult(null);
    }
  }, [sharedState.token, input, onDecode]);

  const verify = async () => {
    if (!decodedResult) {
      setVerificationError('Please decode a JWT first');
      return;
    }

    const tokenToVerify = (input.trim() || sharedState.token.trim());
    const algorithm = decodedResult.algorithm;

    try {
      let verifyResult: VerificationResult;

      if (algorithm.startsWith('HS')) {
        if (!verifyKey) {
          setVerificationStatus('error');
          setVerificationError('Secret key is required for HMAC verification');
          return;
        }

        let actualSecret = verifyKey;
        if (base64UrlEncoded) {
          try {
            actualSecret = JwtVerify.base64UrlDecode(verifyKey);
          } catch {
            setVerificationStatus('error');
            setVerificationError('Invalid Base64URL encoded secret');
            return;
          }
        }

        verifyResult = await JwtVerify.verify({
          token: tokenToVerify,
          secret: actualSecret
        });

      } else if (algorithm.startsWith('RS') || algorithm.startsWith('ES')) {
        const keyToUse = publicKey || verifyKey;
        if (!keyToUse) {
          setVerificationStatus('error');
          setVerificationError('Public key is required for verification');
          return;
        }

        if (!keyToUse.includes('-----BEGIN PUBLIC KEY-----') || !keyToUse.includes('-----END PUBLIC KEY-----')) {
          setVerificationStatus('error');
          setVerificationError('Invalid PEM format. Public key must be in PEM format.');
          return;
        }

        verifyResult = await JwtVerify.verify({
          token: tokenToVerify,
          publicKeyPem: keyToUse
        });

      } else {
        setVerificationStatus('error');
        setVerificationError(`Unsupported algorithm: ${algorithm}`);
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

    } catch (e) {
      setVerificationStatus('error');
      setVerificationError(`Verification error: ${(e as Error).message}`);
    }
  };

  useEffect(() => {
    // Auto-verify when decoded result exists and key is available
    const alg = decodedResult?.algorithm;
    const hasKey = alg?.startsWith('HS') ? verifyKey : ((alg?.startsWith('RS') || alg?.startsWith('ES')) && (publicKey || verifyKey));

    console.log('[JWT Decoder - Auto-verify Effect]', {
      decodedResult: !!decodedResult,
      decodedAlgorithm: alg,
      publicKey,
      verifyKey,
      hasKey: !!hasKey,
      shouldRun: decodedResult && hasKey
    });

    // Auto-verify if key is available
    if (decodedResult && hasKey) {
      const timer = setTimeout(() => verify(), 300);
      return () => clearTimeout(timer);
    }
  }, [decodedResult, verifyKey, publicKey]);

  const clearAll = () => {
    setInput('');
    setHeader('');
    setPayload('');
    setSignature('');
    setDecodeError('');
    setDecodedResult(null);
    setVerifyKey('');
    setBase64UrlEncoded(false);
    setKeyFromSync(false);
    setVerificationStatus(null);
    setVerificationError('');
    setIsExpired(false);
  };

  const loadSample = () => {
    setInput('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    setDecodeError('');
  };

  const algorithm = decodedResult?.algorithm || '';
  const isHmac = algorithm.startsWith('HS');
  const isRsa = algorithm.startsWith('RS');
  const isEcdsa = algorithm.startsWith('ES');

  const getKeyLabel = () => {
    if (isHmac) return 'Secret Key';
    return 'Public Key (PEM)';
  };

  const getKeyPlaceholder = () => {
    if (isHmac) return 'Enter your shared secret key';
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

  const effectiveInput = input || sharedState.token;

  return (
    <div className="space-y-6">
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
          value={effectiveInput}
          onChange={setInput}
          placeholder="Paste your JWT token here..."
          rows={4}
        />
      </div>

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

      {decodeError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{decodeError}</p>
        </div>
      )}

      {header && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">HEADER</span>
              <span className="text-sm text-gray-500">Algorithm & Token Type</span>
            </div>
            <ToolResult value={header} label="" language="json" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">PAYLOAD</span>
              <span className="text-sm text-gray-500">Data</span>
            </div>
            <ToolResult value={payload} label="" language="json" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">SIGNATURE</span>
              <span className="text-sm text-gray-500">Original</span>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <code className="text-sm font-mono text-gray-700 break-all">{signature}</code>
            </div>
          </div>

          {sharedState.token && !input && (
            <div className="text-sm text-gray-500">
              Token synced from Encode tab
            </div>
          )}
        </div>
      )}

      {decodedResult && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            JWT Signature Verification (Optional)
          </h3>

          <p className="text-sm text-gray-600">
            To verify this token, enter the secret or public key used during signing.
          </p>

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
            {publicKey && (isRsa || isEcdsa) && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 mb-1">
                  Public key automatically imported from encoder
                </p>
                <textarea
                  value={publicKey}
                  readOnly
                  rows={5}
                  className="w-full px-2 py-1 text-xs font-mono bg-blue-50 border border-blue-200 rounded-lg focus:outline-none"
                />
              </div>
            )}
            {isHmac ? (
              <input
                type="text"
                value={verifyKey}
                onChange={(e) => {
                  setVerifyKey(e.target.value);
                  setKeyFromSync(false); // User manually changed the key
                  // Clear public key if user changes the key manually
                  setPublicKey('');
                }}
                placeholder={getKeyPlaceholder()}
                className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <textarea
                value={verifyKey}
                onChange={(e) => {
                  setVerifyKey(e.target.value);
                  setKeyFromSync(false); // User manually changed the key
                  // Clear public key if user changes the key manually
                  setPublicKey('');
                }}
                placeholder={getKeyPlaceholder()}
                rows={10}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

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
