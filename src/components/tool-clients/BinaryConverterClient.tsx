'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function BinaryConverterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-binary' | 'binary-to-text'>('text-to-binary');
  const [error, setError] = useState('');

  const textToBinary = (text: string): string => {
    return text
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  };

  const binaryToText = (binary: string): string => {
    const binaryArray = binary.replace(/[^01]/g, ' ').trim().split(/\s+/);
    return binaryArray
      .map(bin => {
        const charCode = parseInt(bin, 2);
        if (isNaN(charCode)) throw new Error(`Invalid binary: ${bin}`);
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
      const result = mode === 'text-to-binary' ? textToBinary(input) : binaryToText(input);
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
    setMode(mode === 'text-to-binary' ? 'binary-to-text' : 'text-to-binary');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('text-to-binary')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'text-to-binary'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Text → Binary
        </button>
        <button
          onClick={() => setMode('binary-to-text')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'binary-to-text'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Binary → Text
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'text-to-binary' ? 'Text Input' : 'Binary Input (space-separated)'}
        </label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder={mode === 'text-to-binary' ? 'Enter text...' : '01001000 01100101 01101100 01101100 01101111'}
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
          label={mode === 'text-to-binary' ? 'Binary Output' : 'Text Output'}
        />
      )}

      {input && !error && (
        <div className="text-sm text-gray-500">
          {mode === 'text-to-binary' ? (
            <span>{input.length} characters → {output.split(' ').length} bytes</span>
          ) : (
            <span>{input.replace(/[^01]/g, ' ').trim().split(/\s+/).length} bytes</span>
          )}
        </div>
      )}
    </div>
  );
}
