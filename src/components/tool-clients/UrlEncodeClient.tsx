'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

type Mode = 'component' | 'uri' | 'all';

export default function UrlEncodeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  // 'component' — full RFC 3986 encoding of every reserved char (default)
  // 'uri'       — preserve protocol/slashes (use when encoding a whole URL)
  // 'all'       — percent-encode every byte (paranoid mode)
  const [mode, setMode] = useState<Mode>('component');

  const encodeAllBytes = (s: string): string => {
    const bytes = new TextEncoder().encode(s);
    let out = '';
    for (let i = 0; i < bytes.length; i++) {
      out += '%' + bytes[i].toString(16).toUpperCase().padStart(2, '0');
    }
    return out;
  };

  const encode = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter text or URL to encode');
      return;
    }

    try {
      let result: string;
      if (mode === 'uri') result = encodeURI(input);
      else if (mode === 'all') result = encodeAllBytes(input);
      else result = encodeURIComponent(input);
      setOutput(result);
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
    setInput('https://example.com/search?q=hello world&category=tech&lang=en');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Text/URL to Encode</label>
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
          placeholder="Enter text or URL to encode..."
          rows={4}
        />
      </div>


      {/* Mode */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="component">Component (encodeURIComponent — for query values)</option>
          <option value="uri">Full URI (encodeURI — preserves :/?&#)</option>
          <option value="all">All bytes (percent-encode every character)</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={encode}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Encode URL
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
          label="URL Encoded"
        />
      )}
    </div>
  );
}
