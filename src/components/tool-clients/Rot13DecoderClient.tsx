'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function Rot13DecoderClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // ROT13 is its own inverse, so encoding and decoding are the same
  const rot13 = (str: string): string => {
    return str.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  };

  const decode = () => {
    setOutput(rot13(input));
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ROT13 Encoded Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter ROT13 encoded text to decode..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={decode}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Decode ROT13
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Decoded Text</label>
            <CopyButton text={output} />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>ROT13 is its own inverse - applying it twice returns the original text. The same operation decodes what was encoded.</p>
      </div>
    </div>
  );
}
