'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function JwtEncoderClient() {
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [token, setToken] = useState('');

  const base64UrlEncode = (str: string): string => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const encodeJWT = async () => {
    try {
      // Validate JSON
      JSON.parse(header);
      JSON.parse(payload);

      // Encode header and payload
      const encodedHeader = base64UrlEncode(header);
      const encodedPayload = base64UrlEncode(payload);

      // Create signature using HMAC-SHA256
      const message = `${encodedHeader}.${encodedPayload}`;
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', key, messageData);
      const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      setToken(`${message}.${signatureBase64}`);
    } catch (error) {
      alert('Invalid JSON in header or payload');
    }
  };

  const copyToken = async () => {
    await navigator.clipboard.writeText(token);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header (JSON)</label>
        <textarea
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='{"alg": "HS256", "typ": "JWT"}'
        />
      </div>

      {/* Payload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payload (JSON)</label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='{"sub": "1234567890", "name": "John Doe"}'
        />
      </div>

      {/* Secret */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your secret key"
        />
      </div>

      {/* Action Button */}
      <button
        onClick={encodeJWT}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Encode JWT
      </button>

      {/* Output */}
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

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Creates a JWT token with HMAC-SHA256 signature. All processing happens in your browser.</p>
      </div>
    </div>
  );
}
