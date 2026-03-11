'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function Sha256HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const sha256 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const generate = async () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter text to hash');
      return;
    }

    try {
      const hash = await sha256(input);
      setOutput(hash);
    } catch (e) {
      setError(`Error generating hash: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text to Hash
        </label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Enter text to generate SHA-256 hash..."
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate SHA-256
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

      {/* Output */}
      {output && !error && (
        <ToolResult value={output} label="SHA-256 Hash" showDownload downloadFilename="sha256-hash.txt" />
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>SHA-256 produces a 256-bit (32-byte) hash value, typically rendered as a 64-character hexadecimal number.</p>
      </div>
    </div>
  );
}
