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

/**
 * Decode base64url to Buffer (for binary data like signatures)
 */
function base64UrlDecodeToBuffer(str: string): Buffer {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64');
}

// ============================================================================
// ECDSA Signature Conversion Helper
// ============================================================================

/**
 * Convert ECDSA signature from DER to raw (r,s) format
 * Web Crypto API expects raw format for ES256 verification
 */
function convertDerToRaw(signature: Uint8Array): Uint8Array {
  // DER format: 0x30 [total length] 0x02 [r length] [r] 0x02 [s length] [s]
  // We need to extract r and s and concatenate them

  if (signature[0] !== 0x30) {
    // Not in DER format, assume it's already raw
    return signature;
  }

  let offset = 1; // Skip 0x30

  // Read total length
  const totalLength = signature[offset];
  offset += (totalLength & 0x80) === 0 ? 1 : 2; // Handle long form length

  // Read r
  if (signature[offset] !== 0x02) {
    throw new Error('Invalid DER signature: expected 0x02 for r');
  }
  offset++; // Skip 0x02

  let rLength = signature[offset];
  offset += (rLength & 0x80) === 0 ? 1 : 2; // Handle long form length
  const r = signature.slice(offset, offset + rLength);
  offset += rLength;

  // Read s
  if (signature[offset] !== 0x02) {
    throw new Error('Invalid DER signature: expected 0x02 for s');
  }
  offset++; // Skip 0x02

  let sLength = signature[offset];
  offset += (sLength & 0x80) === 0 ? 1 : 2; // Handle long form length
  const s = signature.slice(offset, offset + sLength);

  // Remove leading zeros from r and s (to ensure proper length)
  const rTrimmed = r.length > 32 ? r.slice(-32) : r;
  const sTrimmed = s.length > 32 ? s.slice(-32) : s;

  // Concatenate r and s (both 32 bytes for P-256)
  const raw = new Uint8Array(64);
  raw.set(rTrimmed, 32 - rTrimmed.length);
  raw.set(sTrimmed, 64 - sTrimmed.length);

  return raw;
}

/**
 * Convert raw (r,s) format to DER format for ECDSA signatures
 */
function convertRawToDer(signature: Uint8Array | Buffer): Buffer {
  const sig = signature instanceof Buffer ? signature : Buffer.from(signature);

  // Raw format: r (32 bytes) + s (32 bytes) = 64 bytes for P-256
  if (sig.length !== 64) {
    console.error('[JWT Verify] Invalid raw signature length:', sig.length);
    return Buffer.from(sig) as Buffer;
  }

  // Extract r (first 32 bytes, removing leading zeros)
  let r: Buffer = sig.slice(0, 32) as Buffer;
  while (r.length > 0 && r[0] === 0) {
    r = r.slice(1) as Buffer;
  }

  // Extract s (last 32 bytes, removing leading zeros)
  let s: Buffer = sig.slice(32) as Buffer;
  while (s.length > 0 && s[0] === 0) {
    s = s.slice(1) as Buffer;
  }

  // Helper function to encode an integer value with proper sign bit handling
  const encodeInteger = (value: Buffer): number[] => {
    const result: number[] = [];

    // If high bit is set, prepend zero byte to indicate positive number
    let valueToEncode: Buffer;
    if (value.length > 0 && value[0] >= 0x80) {
      valueToEncode = Buffer.concat([Buffer.from([0x00]), value]) as Buffer;
    } else {
      valueToEncode = value;
    }

    result.push(0x02); // INTEGER tag

    // Encode length
    if (valueToEncode.length > 127) {
      result.push(0x81, valueToEncode.length);
    } else {
      result.push(valueToEncode.length);
    }

    // Add value bytes
    for (let i = 0; i < valueToEncode.length; i++) {
      result.push(valueToEncode[i]);
    }

    return result;
  };

  // Encode both integers first
  const rEncoded = encodeInteger(r);
  const sEncoded = encodeInteger(s);

  // Build DER structure
  const der: number[] = [];

  // SEQUENCE tag
  der.push(0x30);

  // Calculate and add total length
  const totalLength = rEncoded.length + sEncoded.length;
  if (totalLength > 127) {
    der.push(0x81, totalLength);
  } else {
    der.push(totalLength);
  }

  // Add encoded integers
  der.push(...rEncoded);
  der.push(...sEncoded);

  return Buffer.from(der);
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
  console.log('[JWT Verify] RS256 verification started');
  console.log('[JWT Verify] Message:', message);
  console.log('[JWT Verify] Signature:', signature.substring(0, 50) + '...');
  console.log('[JWT Verify] Public key (first 80 chars):', publicKeyPem.substring(0, 80) + '...');

  if (isNode) {
    const crypto = await import('crypto');
    try {
      const verify = crypto.createVerify('sha256WithRSAEncryption');
      verify.update(message);
      verify.end();
      const signatureBuffer = base64UrlDecodeToBuffer(signature);
      const result = verify.verify(publicKeyPem, signatureBuffer);
      console.log('[JWT Verify] RS256 Node.js result:', result);
      return result;
    } catch (e: any) {
      // Invalid public key format or verification error
      console.error('[JWT Verify] RS256 Node.js error:', e);
      // Throw error so caller can handle it and show proper message
      throw new Error(`Invalid public key: ${e?.message || 'Key format is incorrect or corrupted'}`);
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

      console.log('[JWT Verify] Imported RSA key, length:', bytes.buffer.byteLength);

      const key = await crypto.subtle.importKey(
        'spki',
        bytes.buffer,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );

      console.log('[JWT Verify] RSA key imported successfully');

      let sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
      while (sigBase64.length % 4) sigBase64 += '=';
      const signatureBuffer = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

      console.log('[JWT Verify] Signature buffer length:', signatureBuffer.length);

      const result = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        key,
        signatureBuffer,
        messageData
      );

      console.log('[JWT Verify] RS256 browser result:', result);
      return result;
    } catch (e: any) {
      console.error('[JWT Verify] RSA verification error:', e);
      throw new Error(`Invalid public key: ${e?.message || 'Key format is incorrect or corrupted'}`);
    }
  }
}

/**
 * Verify ECDSA signature (ES256)
 * Handles both DER and raw signature formats
 */
async function verifyEcdsaSha256(
  message: string,
  signature: string,
  publicKeyPem: string
): Promise<boolean> {
  console.log('[JWT Verify] ES256 verification started');
  console.log('[JWT Verify] Message:', message);
  console.log('[JWT Verify] Signature:', signature.substring(0, 50) + '...');
  console.log('[JWT Verify] Public key (first 80 chars):', publicKeyPem.substring(0, 80) + '...');

  if (isNode) {
    const crypto = await import('crypto');
    try {
      const verify = crypto.createVerify('sha256');
      verify.update(message);
      verify.end();

      // Convert signature from base64url to buffer (use raw bytes, not UTF-8 string)
      const signatureBuffer = base64UrlDecodeToBuffer(signature);
      console.log('[JWT Verify] Signature buffer length:', signatureBuffer.length);

      // For ES256, Web Crypto produces raw (r,s) format, but Node.js expects DER format
      // We need to convert raw to DER if needed
      let derSignature: Buffer = signatureBuffer;

      // Check if signature is in raw format (64 bytes for P-256) or DER format (70-72 bytes typically)
      if (signatureBuffer.length === 64) {
        // Raw (r,s) format - need to convert to DER
        console.log('[JWT Verify] Converting raw signature to DER format');
        console.log('[JWT Verify] Raw signature (hex):', signatureBuffer.toString('hex'));
        derSignature = convertRawToDer(signatureBuffer);
        console.log('[JWT Verify] DER signature (hex):', derSignature.toString('hex'));
        console.log('[JWT Verify] DER signature length:', derSignature.length);
      } else if (signatureBuffer[0] !== 0x30) {
        // Not starting with 0x30 (DER sequence tag), might need DER wrapping
        console.log('[JWT Verify] Converting raw signature to DER format');
        console.log('[JWT Verify] Raw signature (hex):', signatureBuffer.toString('hex'));
        derSignature = convertRawToDer(signatureBuffer);
        console.log('[JWT Verify] DER signature (hex):', derSignature.toString('hex'));
      } else {
        console.log('[JWT Verify] Using signature as-is (DER format)');
        console.log('[JWT Verify] DER signature (hex):', signatureBuffer.toString('hex'));
      }

      console.log('[JWT Verify] Public key PEM:', publicKeyPem.substring(0, 100) + '...');
      const result = verify.verify(publicKeyPem, derSignature);
      console.log('[JWT Verify] ES256 Node.js result:', result);
      return result;
    } catch (e: any) {
      console.error('[JWT Verify] ES256 Node.js error:', e);
      throw new Error(`Invalid public key: ${e?.message || 'Key format is incorrect or corrupted'}`);
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

      let binaryString: string;
      let bytes: Uint8Array;

      try {
        binaryString = atob(pemContent);
        bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      } catch (e) {
        throw new Error('Invalid PEM format: Cannot decode base64 content');
      }

      console.log('[JWT Verify] Imported ECDSA key, length:', bytes.buffer.byteLength);

      const key = await crypto.subtle.importKey(
        'spki',
        bytes.buffer as ArrayBuffer,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );

      console.log('[JWT Verify] ECDSA key imported successfully');

      // Convert signature from base64url to buffer
      let sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
      while (sigBase64.length % 4) sigBase64 += '=';
      let signatureBuffer = Uint8Array.from(atob(sigBase64), (c) => c.charCodeAt(0));

      console.log('[JWT Verify] Signature buffer length:', signatureBuffer.length);
      console.log('[JWT Verify] Signature first byte:', signatureBuffer[0].toString(16));

      // Try raw format first (Web Crypto default)
      console.log('[JWT Verify] Trying raw format...');
      let verified = await crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        key,
        signatureBuffer,
        messageData
      );

      console.log('[JWT Verify] Raw format result:', verified);

      // If raw format fails, try DER format
      if (!verified) {
        console.log('[JWT Verify] Raw format failed, trying DER format...');
        const rawSignature = convertDerToRaw(signatureBuffer);
        console.log('[JWT Verify] Converted to raw format, length:', rawSignature.length);
        // Create a new Uint8Array with a proper ArrayBuffer
        const signatureCopy = new Uint8Array(rawSignature);
        verified = await crypto.subtle.verify(
          { name: 'ECDSA', hash: 'SHA-256' },
          key,
          signatureCopy,
          messageData
        );
        console.log('[JWT Verify] DER format result:', verified);
      }

      console.log('[JWT Verify] ES256 final result:', verified);
      return verified;
    } catch (e: any) {
      console.error('[JWT Verify] ES256 verification error:', e);
      throw new Error(`Invalid public key: ${e?.message || 'Key format is incorrect or corrupted'}`);
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
