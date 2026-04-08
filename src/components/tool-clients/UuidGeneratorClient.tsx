'use client';

import { useState } from 'react';
import ToolResult from '@/components/tools/ToolResult';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

type FormatOptions = {
  hyphens: boolean;
  braces: boolean;
  uppercase: boolean;
  quotes: boolean;
  commas: boolean;
};

const FORMAT_ITEMS: { key: keyof FormatOptions; label: string }[] = [
  { key: 'hyphens', label: 'Hyphens' },
  { key: 'braces', label: '{} Braces' },
  { key: 'uppercase', label: 'Uppercase' },
  { key: 'quotes', label: '\u201C \u201D Quotes' },
  { key: 'commas', label: ', Commas' },
];

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [options, setOptions] = useState<FormatOptions>({
    hyphens: true,
    braces: false,
    uppercase: false,
    quotes: false,
    commas: false,
  });
  const [copied, setCopied] = useState(false);

  const toggleOption = (key: keyof FormatOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatUUID = (uuid: string): string => {
    let result = uuid;
    if (!options.hyphens) {
      result = result.replace(/-/g, '');
    }
    if (options.uppercase) {
      result = result.toUpperCase();
    }
    if (options.braces) {
      result = `{${result}}`;
    }
    if (options.quotes) {
      result = `"${result}"`;
    }
    return result;
  };

  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(formatUUID(crypto.randomUUID()));
    }
    setUuids(newUuids);
  };

  const getJoinedText = () => {
    if (options.commas) {
      return uuids.map((g, i) => i < uuids.length - 1 ? g + ',' : g).join('\n');
    }
    return uuids.join('\n');
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(getJoinedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            className="appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.375rem_center] bg-no-repeat"
          >
            {[1, 2, 3, 5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Format toggles */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Format:</label>
          <div className="flex flex-wrap gap-1.5">
            {FORMAT_ITEMS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleOption(key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                  options[key]
                    ? 'bg-blue-100 border-blue-400 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

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
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  copied
                    ? 'border-green-300 bg-green-100 text-green-700 hover:bg-green-100'
                    : 'text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {copied ? 'Copied!' : 'Copy All'}
              </button>
              <DownloadButton content={getJoinedText()} filename="uuids.txt" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-1 max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center justify-between group">
                <code className="text-sm font-mono text-green-400">
                  {uuid}{options.commas && index < uuids.length - 1 ? ',' : ''}
                </code>
                <CopyButton text={uuid + (options.commas && index < uuids.length - 1 ? ',' : '')} className="opacity-0 group-hover:opacity-100" />
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
