'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function Base64DecodeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter Base64 text to decode');
      return;
    }

    try {
      // Handle Unicode properly
      const binString = atob(input.trim());
      const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0) ?? 0);
      const decoded = new TextDecoder().decode(bytes);
      setOutput(decoded);
    } catch (e) {
      setError(`Error decoding: Invalid Base64 string`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgdGVzdCBzdHJpbmcgd2l0aCBVbmljb2RlOiDkvaDmmJPkuJbnlYwg8J+MjQ==');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Base64 to Decode</label>
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
          placeholder="Enter Base64 encoded text..."
          rows={6}
        lineNumbers
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={decode}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Decode to Text
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
          label="Decoded Text"
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
