'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function Base64EncodeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter text to encode');
      return;
    }

    try {
      // Handle Unicode properly
      const utf8Bytes = new TextEncoder().encode(input);
      const binString = Array.from(utf8Bytes, (byte) =>
        String.fromCodePoint(byte)
      ).join('');
      const encoded = btoa(binString);
      setOutput(encoded);
    } catch (e) {
      setError(`Error encoding: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput('Hello, World! This is a test string with Unicode: 你好世界 🌍');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Text to Encode</label>
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
          placeholder="Enter text to encode to Base64..."
          rows={6}
        lineNumbers
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={encode}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Encode to Base64
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
        <ToolResult
          value={output}
          label="Base64 Encoded"
        />
      )}

      {/* Stats */}
      {input && (
        <div className="text-sm text-gray-500">
          Input: {input.length} characters → Output: {output.length} characters
        </div>
      )}
    </div>
  );
}
