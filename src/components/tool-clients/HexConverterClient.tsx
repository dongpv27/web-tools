'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function HexConverterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-hex' | 'hex-to-text'>('text-to-hex');
  const [error, setError] = useState('');

  const textToHex = (text: string): string => {
    return text
      .split('')
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  };

  const hexToText = (hex: string): string => {
    const hexArray = hex.replace(/[^0-9a-fA-F]/g, ' ').trim().split(/\s+/);
    return hexArray
      .map(h => {
        const charCode = parseInt(h, 16);
        if (isNaN(charCode)) throw new Error(`Invalid hex: ${h}`);
        return String.fromCharCode(charCode);
      })
      .join('');
  };

  const handleConvert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter some input');
      return;
    }

    try {
      const result = mode === 'text-to-hex' ? textToHex(input) : hexToText(input);
      setOutput(result);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'text-to-hex' ? 'hex-to-text' : 'text-to-hex');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('text-to-hex')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'text-to-hex'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Text → Hex
        </button>
        <button
          onClick={() => setMode('hex-to-text')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'hex-to-text'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Hex → Text
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'text-to-hex' ? 'Text Input' : 'Hex Input (space-separated)'}
        </label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder={mode === 'text-to-hex' ? 'Enter text...' : '48 65 6c 6c 6f'}
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          Convert
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {output && !error && (
        <ToolResult
          value={output}
          label={mode === 'text-to-hex' ? 'Hex Output' : 'Text Output'}
          showDownload={true}
          downloadFilename={mode === 'text-to-hex' ? 'hex.txt' : 'text.txt'}
        />
      )}

      {input && !error && (
        <div className="text-sm text-gray-500">
          {mode === 'text-to-hex' ? (
            <span>{input.length} characters → {output.split(' ').length} bytes</span>
          ) : (
            <span>{input.replace(/[^0-9a-fA-F]/g, ' ').trim().split(/\s+/).length} bytes</span>
          )}
        </div>
      )}
    </div>
  );
}
