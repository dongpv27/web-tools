'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function UuidBulkGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(50);
  const [uppercase, setUppercase] = useState(false);
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');

  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      // Use v4 (random) as it's the most common
      const uuid = crypto.randomUUID();
      newUuids.push(uppercase ? uuid.toUpperCase() : uuid);
    }
    setUuids(newUuids);
  };

  const copyAll = async () => {
    const text = uuids.join('\n');
    await navigator.clipboard.writeText(text);
  };

  const copyAsJson = async () => {
    const json = JSON.stringify(uuids, null, 2);
    await navigator.clipboard.writeText(json);
  };

  const copyAsArray = async () => {
    const arr = uuids.map(u => `'${u}'`).join(', ');
    await navigator.clipboard.writeText(`[${arr}]`);
  };

  const clearAll = () => {
    setUuids([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Count */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Count:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 25, 50, 100, 200, 500, 1000].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Version */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Version:</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value as 'v4' | 'v1')}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="v4">UUID v4 (Random)</option>
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generateUUIDs}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate {count} UUIDs
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
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
              <button
                onClick={copyAsJson}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Copy as JSON
              </button>
              <DownloadButton content={uuids.join('\n')} filename="uuids.txt" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-1 max-h-80 overflow-y-auto font-mono text-xs">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center justify-between group">
                <span className="text-gray-500 mr-2">{(index + 1).toString().padStart(4, '0')}.</span>
                <code className="flex-1 text-green-400">{uuid}</code>
                <CopyButton text={uuid} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Generate multiple UUIDs at once for database seeding, testing, or batch processing. Uses UUID v4 (random) via Web Crypto API.</p>
      </div>
    </div>
  );
}
