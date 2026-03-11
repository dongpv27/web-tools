'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function Rot13EncoderClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const rot13 = (str: string): string => {
    return str.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  };

  const encode = () => {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Text to Encode</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text to encode with ROT13..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={encode}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Encode ROT13
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
            <label className="text-sm font-medium text-gray-700">Encoded Text</label>
            <CopyButton text={output} />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>ROT13 is a simple letter substitution cipher that replaces each letter with the 13th letter after it in the alphabet.</p>
      </div>
    </div>
  );
}
