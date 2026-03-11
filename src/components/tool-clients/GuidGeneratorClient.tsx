'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function GuidGeneratorClient() {
  const [guids, setGuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'standard' | 'braces' | 'noparen'>('standard');

  const generateGUID = () => {
    const uuid = crypto.randomUUID();
    switch (format) {
      case 'braces':
        return `{${uuid}}`;
      case 'noparen':
        return uuid.replace(/-/g, '');
      default:
        return uuid;
    }
  };

  const generateGUIDs = () => {
    const newGuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newGuids.push(generateGUID());
    }
    setGuids(newGuids);
  };

  const copyAll = async () => {
    const text = guids.join('\n');
    await navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setGuids([]);
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
            {[1, 2, 3, 5, 10, 20, 50, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Format */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Format:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'standard' | 'braces' | 'noparen')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="standard">Standard (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)</option>
            <option value="braces">With Braces ({'{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}'})</option>
            <option value="noparen">No Hyphens (xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={generateGUIDs}
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
      {guids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Generated GUIDs ({guids.length})
            </label>
            <button
              onClick={copyAll}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Copy All
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
            {guids.map((guid, index) => (
              <div key={index} className="flex items-center justify-between group">
                <code className="text-sm font-mono text-green-400">{guid}</code>
                <CopyButton text={guid} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Generates GUIDs (Globally Unique Identifiers) using the Web Crypto API. Compatible with Windows and .NET applications.</p>
      </div>
    </div>
  );
}
