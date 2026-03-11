'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function RandomStringGeneratorClient() {
  const [result, setResult] = useState('');
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  const generateString = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      charset = 'abcdefghijklmnopqrstuvwxyz';
    }

    const results: string[] = [];
    for (let c = 0; c < count; c++) {
      let str = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        str += charset[array[i] % charset.length];
      }
      results.push(str);
    }
    setResult(results.join('\n'));
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(result);
  };

  const clearAll = () => {
    setResult('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Length */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-20">Length:</label>
          <input
            type="number"
            min={1}
            max={256}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Count */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-20">Count:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Character Sets */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Lowercase (a-z)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Uppercase (A-Z)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Numbers (0-9)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Symbols (!@#$...)</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generateString}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {result && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Generated Strings</label>
            <button
              onClick={copyAll}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Copy All
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
            {result.split('\n').map((str, index) => (
              <div key={index} className="flex items-center justify-between group">
                <code className="text-sm font-mono text-green-400 break-all">{str}</code>
                <CopyButton text={str} className="opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Generates cryptographically secure random strings using the Web Crypto API.</p>
      </div>
    </div>
  );
}
