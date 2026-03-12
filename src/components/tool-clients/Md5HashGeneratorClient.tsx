'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';
import md5 from 'crypto-js/md5';

export default function Md5HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter text to hash');
      return;
    }

    try {
      const hash = md5(input).toString();
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
          placeholder="Enter text to generate MD5 hash..."
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate MD5
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
        <ToolResult value={output} label="MD5 Hash" showDownload downloadFilename="md5-hash.txt" />
      )}

      {/* Warning */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ MD5 is not cryptographically secure. Use SHA-256 for security purposes.
        </p>
      </div>
    </div>
  );
}
