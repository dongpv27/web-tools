'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function JwtDecoderClient() {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    setHeader('');
    setPayload('');
    setSignature('');

    if (!input.trim()) {
      setError('Please enter a JWT token');
      return;
    }

    const parts = input.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT format. JWT must have 3 parts separated by dots.');
      return;
    }

    try {
      // Decode header
      const headerDecoded = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const headerJson = JSON.parse(headerDecoded);
      setHeader(JSON.stringify(headerJson, null, 2));

      // Decode payload
      const payloadDecoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payloadJson = JSON.parse(payloadDecoded);
      setPayload(JSON.stringify(payloadJson, null, 2));

      // Signature (just show it, can't verify without secret)
      setSignature(parts[2]);
    } catch (e) {
      setError(`Error decoding JWT: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setHeader('');
    setPayload('');
    setSignature('');
    setError('');
  };

  const loadSample = () => {
    setInput('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
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

      {/* Action Buttons */}
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

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
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

          {/* Signature */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">SIGNATURE</span>
              <span className="text-sm text-gray-500">Verify Signature</span>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <code className="text-sm font-mono text-gray-700 break-all">{signature}</code>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ This tool only decodes JWTs. It cannot verify the signature without the secret key.
              Never trust decoded data from unverified tokens.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
