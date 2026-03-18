/**
 * JWT Signature Verification Module
 * Works in both Node.js and browser environments
 */

// Detect environment
const isNode = typeof process !== 'undefined' && process.versions != null;

// ============================================================================
// Base64URL Encode/Decode Helpers
// ============================================================================

function base64UrlEncode(str: string): string {
  if (isNode) {
    return Buffer.from(str, 'utf-8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } else {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

function base64UrlDecode(str: string): string {
  // Add padding
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  if (isNode) {
    return Buffer.from(base64, 'base64').toString('utf-8');
  } else {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }
}

// ============================================================================
// JWT Parsing
// ============================================================================

interface JwtParts {
  header: string;
  payload: string;
  signature: string;
  headerDecoded: any;
  payloadDecoded: any;
}

function parseJwt(token: string): JwtParts | null {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    const headerDecoded = JSON.parse(base64UrlDecode(parts[0]));
    const payloadDecoded = JSON.parse(base64UrlDecode(parts[1]));

    return {
      header: parts[0],
      payload: parts[1],
      signature: parts[2],
      headerDecoded,
      payloadDecoded,
    };
  } catch (e) {
    return null;
  }
}

// ============================================================================
// Verification Result Type
// ============================================================================

export type VerificationStatus = 'valid' | 'invalid' | 'error';

export interface VerificationResult {
  status: VerificationStatus;
  reason: string;
  algorithm: string;
  isExpired: boolean;
}

// ============================================================================
// Algorithm Verification Functions
// ============================================================================

/**
 * Verify HMAC signature (HS256)
 */
async function verifyHmacSha256(
  message: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (isNode) {
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return expectedSignature === signature;
  } else {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    let sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) sigBase64 += '=';
    const signatureBuffer = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

    return await crypto.subtle.verify('HMAC', key, signatureBuffer, messageData);
  }
}

/**
 * Verify RSA signature (RS256)
 */
async function verifyRsaSha256(
  message: string,
  signature: string,
  publicKeyPem: string
): Promise<boolean> {
  if (isNode) {
    const crypto = await import('crypto');
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(message);
      verify.end();
      const signatureBuffer = Buffer.from(base64UrlDecode(signature), 'base64');
      return verify.verify(publicKeyPem, signatureBuffer);
    } catch (e) {
      // Invalid public key format
      return false;
    }
  } else {
    try {
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);

      // Convert PEM to ArrayBuffer
      const pemHeader = '-----BEGIN PUBLIC KEY-----';
      const pemFooter = '-----END PUBLIC KEY-----';
      const pemContent = publicKeyPem
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s/g, '');

      const binaryString = atob(pemContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const key = await crypto.subtle.importKey(
        'spki',
        bytes.buffer,
        { name: 'RSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );

      let sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
      while (sigBase64.length % 4) sigBase64 += '=';
      const signatureBuffer = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

      return await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        key,
        signatureBuffer,
        messageData
      );
    } catch (e) {
      return false;
    }
  }
}

/**
 * Verify ECDSA signature (ES256)
 */
async function verifyEcdsaSha256(
  message: string,
  signature: string,
  publicKeyPem: string
): Promise<boolean> {
  if (isNode) {
    const crypto = await import('crypto');
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(message);
      verify.end();
      const signatureBuffer = Buffer.from(base64UrlDecode(signature), 'base64');
      return verify.verify(publicKeyPem, signatureBuffer);
    } catch (e) {
      return false;
    }
  } else {
    try {
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);

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

      const key = await crypto.subtle.importKey(
        'spki',
        bytes.buffer,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );

      // Convert DER signature to raw r,s format for Web Crypto
      let sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
      while (sigBase64.length % 4) sigBase64 += '=';
      const signatureBuffer = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

      return await crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        key,
        signatureBuffer,
        messageData
      );
    } catch (e) {
      return false;
    }
  }
}

// ============================================================================
// Main Verification Function
// ============================================================================

export interface VerifyJwtOptions {
  token: string;
  secret?: string;
  publicKeyPem?: string;
}

export async function verifyJwt(options: VerifyJwtOptions): Promise<VerificationResult> {
  const { token, secret, publicKeyPem } = options;

  // Validate token format
  if (!token || typeof token !== 'string') {
    return {
      status: 'error',
      reason: 'Invalid token: token must be a non-empty string',
      algorithm: 'unknown',
      isExpired: false,
    };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return {
      status: 'error',
      reason: 'Invalid JWT format. JWT must have 3 parts separated by dots.',
      algorithm: 'unknown',
      isExpired: false,
    };
  }

  // Parse JWT
  const jwtParts = parseJwt(token);
  if (!jwtParts) {
    return {
      status: 'error',
      reason: 'Invalid JWT: failed to decode header or payload',
      algorithm: 'unknown',
      isExpired: false,
    };
  }

  const { headerDecoded, payloadDecoded, header, payload } = jwtParts;
  const algorithm = headerDecoded.alg;

  // Check if payload is expired
  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = payloadDecoded.exp !== undefined && payloadDecoded.exp < currentTime;

  // Verify based on algorithm type
  try {
    const signingInput = `${header}.${payload}`;

    switch (algorithm) {
      case 'HS256':
        if (!secret) {
          return {
            status: 'error',
            reason: 'Missing secret key for HS256 verification',
            algorithm,
            isExpired,
          };
        }
        const hmacValid = await verifyHmacSha256(signingInput, parts[2], secret);
        return {
          status: hmacValid ? 'valid' : 'invalid',
          reason: hmacValid ? 'Signature verified successfully' : 'Invalid signature',
          algorithm,
          isExpired,
        };

      case 'HS384':
        if (!secret) {
          return {
            status: 'error',
            reason: 'Missing secret key for HS384 verification',
            algorithm,
            isExpired,
          };
        }
        // HS384 not commonly needed, but can be added if required
        return {
          status: 'error',
          reason: 'HS384 verification not implemented',
          algorithm,
          isExpired,
        };

      case 'HS512':
        if (!secret) {
          return {
            status: 'error',
            reason: 'Missing secret key for HS512 verification',
            algorithm,
            isExpired,
          };
        }
        // HS512 not commonly needed, but can be added if required
        return {
          status: 'error',
          reason: 'HS512 verification not implemented',
          algorithm,
          isExpired,
        };

      case 'RS256':
        if (!publicKeyPem) {
          return {
            status: 'error',
            reason: 'Missing public key for RS256 verification',
            algorithm,
            isExpired,
          };
        }
        const rsaValid = await verifyRsaSha256(signingInput, parts[2], publicKeyPem);
        return {
          status: rsaValid ? 'valid' : 'invalid',
          reason: rsaValid ? 'Signature verified successfully' : 'Invalid signature',
          algorithm,
          isExpired,
        };

      case 'ES256':
        if (!publicKeyPem) {
          return {
            status: 'error',
            reason: 'Missing public key for ES256 verification',
            algorithm,
            isExpired,
          };
        }
        const ecdsaValid = await verifyEcdsaSha256(signingInput, parts[2], publicKeyPem);
        return {
          status: ecdsaValid ? 'valid' : 'invalid',
          reason: ecdsaValid ? 'Signature verified successfully' : 'Invalid signature',
          algorithm,
          isExpired,
        };

      default:
        return {
          status: 'error',
          reason: `Unsupported algorithm: ${algorithm}. Only HS256, RS256, ES256 are supported.`,
          algorithm,
          isExpired,
        };
    }
  } catch (e) {
    return {
      status: 'error',
      reason: `Verification error: ${e instanceof Error ? e.message : String(e)}`,
      algorithm,
      isExpired,
    };
  }
}

// ============================================================================
// Helper: Extract Payload (without verification)
// ============================================================================

export interface DecodeJwtResult {
  header: any;
  payload: any;
  algorithm: string;
  isExpired: boolean;
}

export function decodeJwt(token: string): DecodeJwtResult | null {
  const jwtParts = parseJwt(token);
  if (!jwtParts) {
    return null;
  }

  const { headerDecoded, payloadDecoded } = jwtParts;
  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = payloadDecoded.exp !== undefined && payloadDecoded.exp < currentTime;

  return {
    header: headerDecoded,
    payload: payloadDecoded,
    algorithm: headerDecoded.alg,
    isExpired,
  };
}

// ============================================================================
// Export utilities
// ============================================================================

export const JwtVerify = {
  verify: verifyJwt,
  decode: decodeJwt,
  base64UrlEncode,
  base64UrlDecode,
};
