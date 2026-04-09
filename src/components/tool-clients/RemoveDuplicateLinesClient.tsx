'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function RemoveDuplicateLinesClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });
  const [caseSensitive, setCaseSensitive] = useState(true);

  const removeDuplicates = () => {
    if (!input.trim()) return;

    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }

    setOutput(unique.join('\n'));
    setStats({
      original: lines.length,
      unique: unique.length,
      removed: lines.length - unique.length,
    });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStats({ original: 0, unique: 0, removed: 0 });
  };

  const loadSample = () => {
    setInput(`apple
banana
apple
cherry
banana
date
apple
elderberry
cherry`);
    setOutput('');
    setStats({ original: 0, unique: 0, removed: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Input Text (one item per line)</label>
          <button
            onClick={loadSample}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Enter text with duplicate lines..."
          rows={8}
        lineNumbers
        />
      </div>

      {/* Options */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">Case sensitive</span>
      </label>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={removeDuplicates}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Remove Duplicates
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Stats */}
      {stats.original > 0 && (
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">Original: <strong>{stats.original}</strong> lines</span>
          <span className="text-gray-600">Unique: <strong className="text-green-600">{stats.unique}</strong> lines</span>
          <span className="text-gray-600">Removed: <strong className="text-red-600">{stats.removed}</strong> duplicates</span>
        </div>
      )}

      {/* Output */}
      {output && (
        <ToolResult value={output} label="Unique Lines" textClassName="text-gray-100" />
      )}
    </div>
  );
}
