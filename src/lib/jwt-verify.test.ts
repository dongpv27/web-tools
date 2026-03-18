/**
 * Test file for JWT Verification Module
 * Run with: npx tsx src/lib/jwt-verify.test.ts
 */

import { JwtVerify } from './jwt-verify';

// ============================================================================
// Helper: Create test JWT (simple HS256 for testing)
// ============================================================================

async function createTestHs256Token(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = JwtVerify.base64UrlEncode(JSON.stringify(header));
  const encodedPayload = JwtVerify.base64UrlEncode(JSON.stringify(payload));

  // Detect environment and use appropriate crypto
  const isNode = typeof process !== 'undefined' && process.versions != null;

  if (isNode) {
    // Use Node.js crypto
    const crypto = await import('crypto');
    const message = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto.createHmac('sha256', secret)
      .update(message)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return `${message}.${signature}`;
  } else {
    // Use Browser Web Crypto API
    const message = `${encodedHeader}.${encodedPayload}`;
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    const keyData = encoder.encode(secret);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const signatureBase64 = JwtVerify.base64UrlEncode(
      btoa(String.fromCharCode(...new Uint8Array(signature)))
    );

    return `${message}.${signatureBase64}`;
  }
}

// ============================================================================
// Test Cases
// ============================================================================

async function runTests() {
  console.log('=== JWT Verification Module Tests ===\n');

  // Test 1: Valid HS256 Token
  console.log('Test 1: Valid HS256 Token');
  const validPayload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
  const validSecret = 'test-secret-key-at-least-32-bytes-long!';
  const validToken = await createTestHs256Token(validPayload, validSecret);
  console.log('Token:', validToken.substring(0, 50) + '...');

  const result1 = await JwtVerify.verify({ token: validToken, secret: validSecret });
  console.log('Result:', result1);
  console.log('Passed:', result1.status === 'valid' && result1.reason === 'Signature verified successfully');
  console.log();

  // Test 2: Invalid HS256 Signature (wrong secret)
  console.log('Test 2: Invalid HS256 Signature (wrong secret)');
  const result2 = await JwtVerify.verify({
    token: validToken,
    secret: 'wrong-secret-key-different!'
  });
  console.log('Result:', result2);
  console.log('Passed:', result2.status === 'invalid');
  console.log();

  // Test 3: Decode only (no verification)
  console.log('Test 3: Decode Only');
  const decoded3 = JwtVerify.decode(validToken);
  console.log('Decoded Header:', decoded3?.header);
  console.log('Decoded Payload:', decoded3?.payload);
  console.log('Passed:', decoded3?.algorithm === 'HS256');
  console.log();

  // Test 4: Invalid Token Format (not 3 parts)
  console.log('Test 4: Invalid Token Format (not 3 parts)');
  const result4 = await JwtVerify.verify({ token: 'invalid.token.format' });
  console.log('Result:', result4);
  console.log('Passed:', result4.status === 'error' && result4.reason.includes('3 parts'));
  console.log();

  // Test 5: Invalid Token Format (bad base64)
  console.log('Test 5: Invalid Token Format (bad base64)');
  const result5 = await JwtVerify.verify({ token: 'aaa.bbb.ccc' });
  console.log('Result:', result5);
  console.log('Passed:', result5.status === 'error');
  console.log();

  // Test 6: Expired Token
  console.log('Test 6: Expired Token');
  const expiredPayload = { sub: '1234567890', name: 'John Doe', exp: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
  const expiredToken = await createTestHs256Token(expiredPayload, validSecret);
  const result6 = await JwtVerify.verify({ token: expiredToken, secret: validSecret });
  console.log('Result:', result6);
  console.log('Passed:', result6.status === 'valid' && result6.isExpired === true);
  console.log();

  // Test 7: Missing Secret for HS256
  console.log('Test 7: Missing Secret for HS256');
  const result7 = await JwtVerify.verify({ token: validToken });
  console.log('Result:', result7);
  console.log('Passed:', result7.status === 'error' && result7.reason.includes('Missing secret key'));
  console.log();

  // Test 8: Base64URL Helpers
  console.log('Test 8: Base64URL Encode/Decode');
  const testString = 'Hello, World! 你好 🎉';
  const encoded = JwtVerify.base64UrlEncode(testString);
  const decoded8 = JwtVerify.base64UrlDecode(encoded);
  console.log('Original:', testString);
  console.log('Encoded:', encoded);
  console.log('Decoded:', decoded8);
  console.log('Passed:', testString === decoded8);
  console.log();

  // Test 9: Decode Sample JWT
  console.log('Test 9: Decode Sample JWT (HS256)');
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const decoded9 = JwtVerify.decode(sampleToken);
  console.log('Algorithm:', decoded9?.algorithm);
  console.log('Subject:', decoded9?.payload?.sub);
  console.log('Name:', decoded9?.payload?.name);
  console.log('Passed:', decoded9?.algorithm === 'HS256' && decoded9?.payload?.name === 'John Doe');
  console.log();

  // Test 10: Verify Sample JWT with correct secret
  console.log('Test 10: Verify Sample JWT with correct secret');
  const sampleSecret = 'your-256-bit-secret';
  const result10 = await JwtVerify.verify({ token: sampleToken, secret: sampleSecret });
  console.log('Result:', result10);
  console.log('Passed:', result10.status === 'valid');
  console.log();

  console.log('=== All Tests Complete ===');
}

// Run tests
runTests().catch(console.error);
