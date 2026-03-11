'use client';

import { useState } from 'react';
import ToolResult from '@/components/tools/ToolResult';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);

  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const uuid = crypto.randomUUID();
      newUuids.push(uppercase ? uuid.toUpperCase() : uuid);
    }
    setUuids(newUuids);
  };

  const copyAll = async () => {
    const text = uuids.join('\n');
    await navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setUuids([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Count */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Count:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Uppercase */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Uppercase</span>
        </label>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={generateUUIDs}
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
      </div>

      {/* Output */}
      {uuids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Generated UUIDs ({uuids.length})
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Copy All
              </button>
              <DownloadButton content={uuids.join('\n')} filename="uuids.txt" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center justify-between group">
                <code className="text-sm font-mono text-green-400">{uuid}</code>
                <CopyButton text={uuid} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Generates UUID v4 (random) using the Web Crypto API.</p>
      </div>
    </div>
  );
}
