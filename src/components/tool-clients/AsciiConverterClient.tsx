'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function AsciiConverterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'textToAscii' | 'asciiToText'>('textToAscii');

  const textToAscii = (text: string): string => {
    return text.split('').map(char => char.charCodeAt(0)).join(' ');
  };

  const asciiToText = (ascii: string): string => {
    return ascii.split(/[\s,]+/).filter(code => code.trim() !== '').map(code => {
      const num = parseInt(code, 10);
      return isNaN(num) ? '' : String.fromCharCode(num);
    }).join('');
  };

  const convert = () => {
    if (mode === 'textToAscii') {
      setOutput(textToAscii(input));
    } else {
      setOutput(asciiToText(input));
    }
  };

  const swap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'textToAscii' ? 'asciiToText' : 'textToAscii');
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('textToAscii')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'textToAscii'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Text to ASCII
        </button>
        <button
          onClick={() => setMode('asciiToText')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'asciiToText'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ASCII to Text
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'textToAscii' ? 'Text to Convert' : 'ASCII Codes (space or comma separated)'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={mode === 'textToAscii' ? 'Enter text to convert to ASCII codes...' : 'Enter ASCII codes (e.g., 72 101 108 108 111)...'}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={convert}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert
        </button>
        <button
          onClick={swap}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Swap
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
            <label className="text-sm font-medium text-gray-700">
              {mode === 'textToAscii' ? 'ASCII Codes' : 'Converted Text'}
            </label>
            <div className="flex gap-2">
              <CopyButton text={output} />
              <DownloadButton content={output} filename={mode === 'textToAscii' ? 'ascii-codes.txt' : 'converted-text.txt'} />
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>ASCII (American Standard Code for Information Interchange) assigns numeric codes 0-127 to characters.</p>
        <p className="mt-1">Common codes: A=65, a=97, 0=48, Space=32</p>
      </div>
    </div>
  );
}
