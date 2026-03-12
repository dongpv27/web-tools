'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function NanoIdGeneratorClient() {
  const [ids, setIds] = useState<string[]>([]);
  const [length, setLength] = useState(21);
  const [count, setCount] = useState(10);
  const [alphabet, setAlphabet] = useState('url-safe');
  const [copied, setCopied] = useState(false);

  const alphabets: Record<string, string> = {
      'url-safe': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-',
      'alphanumeric': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      'lowercase': '0123456789abcdefghijklmnopqrstuvwxyz',
      'numbers': '0123456789',
      'no-lookalikes': '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxy',
    };

  const generateNanoId = (size: number, chars: string): string => {
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);

    let id = '';
    const mask = (2 << Math.floor(Math.log(chars.length - 1) / Math.LN2)) - 1;
    const step = Math.ceil((1.6 * mask * size) / chars.length);

    for (let i = 0; i < size; ) {
      const randomBytes = new Uint8Array(step);
      crypto.getRandomValues(randomBytes);

      for (let j = 0; j < step && i < size; j++) {
        const byte = randomBytes[j] & mask;
        if (byte < chars.length) {
          id += chars[byte];
          i++;
        }
      }
    }

    return id;
  };

  const generateIds = () => {
    const chars = alphabets[alphabet];
    const newIds: string[] = [];
    for (let i = 0; i < count; i++) {
      newIds.push(generateNanoId(length, chars));
    }
    setIds(newIds);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(ids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Length */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-20">Length:</label>
          <input
            type="number"
            min={4}
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

        {/* Alphabet */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-20">Alphabet:</label>
          <select
            value={alphabet}
            onChange={(e) => setAlphabet(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="url-safe">URL-safe</option>
            <option value="alphanumeric">Alphanumeric</option>
            <option value="lowercase">Lowercase + Numbers</option>
            <option value="numbers">Numbers only</option>
            <option value="no-lookalikes">No lookalikes</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generateIds}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Nano IDs
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {ids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Generated Nano IDs ({ids.length})
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  copied
                    ? 'border-green-300 bg-green-100 text-green-700 hover:bg-green-100'
                    : 'text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {copied ? 'Copied!' : 'Copy All'}
              </button>
              <DownloadButton content={ids.join('\n')} filename="nanoids.txt" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
            {ids.map((id, index) => (
              <div key={index} className="flex items-center justify-between group">
                <code className="text-sm font-mono text-green-400">{id}</code>
                <CopyButton text={id} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Nano ID is a small, secure, URL-friendly unique string ID generator.</p>
        <ul className="list-disc list-inside mt-1">
          <li>Default length of 21 characters provides 126 bits of entropy</li>
          <li>60% smaller than UUID while maintaining similar uniqueness</li>
          <li>URL-safe by default (no special characters that need encoding)</li>
        </ul>
      </div>
    </div>
  );
}
