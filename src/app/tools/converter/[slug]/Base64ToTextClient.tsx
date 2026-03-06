'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function Base64ToTextClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter Base64 to decode');
      return;
    }

    try {
      const binary = atob(input.trim());
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      const text = decoder.decode(bytes);
      setOutput(text);
    } catch (e) {
      setError('Invalid Base64 string: ' + (e as Error).message);
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Base64 Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Base64 to decode..."
          className="w-full h-40 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={decode} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Decode to Text</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Decoded Text</label>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap min-h-[100px]">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
