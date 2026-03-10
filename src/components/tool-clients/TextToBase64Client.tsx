'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function TextToBase64Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    setError('');
    setOutput('');

    if (!input) {
      setError('Please enter text to encode');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const base64 = btoa(String.fromCharCode(...data));
      setOutput(base64);
    } catch (e) {
      setError('Error encoding text: ' + (e as Error).message);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode..."
          className="w-full h-40 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={encode} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Encode to Base64</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Base64 Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap break-all min-h-[100px]">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
