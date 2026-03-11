'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function HtmlEncodeDecodeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const htmlEncode = (text: string): string => {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
  };

  const htmlDecode = (text: string): string => {
    const htmlEntities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&nbsp;': ' ',
    };
    return text.replace(/&(?:amp|lt|gt|quot|#39|#x27|nbsp);/g, (entity) => htmlEntities[entity] || entity);
  };

  const handleProcess = () => {
    if (!input.trim()) return;
    const result = mode === 'encode' ? htmlEncode(input) : htmlDecode(input);
    setOutput(result);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Decode
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'encode' ? 'Plain Text' : 'HTML Encoded Text'}
        </label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter HTML entities to decode...'}
          rows={6}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleProcess}
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
        >
          Swap
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {output && (
        <ToolResult
          value={output}
          label={mode === 'encode' ? 'HTML Encoded' : 'Decoded Text'}
        />
      )}
    </div>
  );
}
