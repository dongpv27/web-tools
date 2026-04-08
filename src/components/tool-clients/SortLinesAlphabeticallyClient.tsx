'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function SortLinesAlphabeticallyClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(true);

  const sortLines = () => {
    if (!input.trim()) return;

    let lines = input.split('\n');

    // Remove empty lines if option is set
    if (removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }

    // Sort lines
    lines.sort((a, b) => {
      const compareA = caseSensitive ? a : a.toLowerCase();
      const compareB = caseSensitive ? b : b.toLowerCase();

      if (sortOrder === 'asc') {
        return compareA.localeCompare(compareB);
      } else {
        return compareB.localeCompare(compareA);
      }
    });

    setOutput(lines.join('\n'));
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const loadSample = () => {
    setInput(`zebra
Apple
banana
cherry
Date
elderberry
Fig
grape
Honeydew`);
    setOutput('');
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
          placeholder="Enter lines to sort..."
          rows={8}
        lineNumbers
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Sort order:</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sortOrder"
              checked={sortOrder === 'asc'}
              onChange={() => setSortOrder('asc')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">A-Z</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sortOrder"
              checked={sortOrder === 'desc'}
              onChange={() => setSortOrder('desc')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Z-A</span>
          </label>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Case sensitive</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={(e) => setRemoveEmpty(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Remove empty lines</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={sortLines}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sort Lines
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {output && (
        <ToolResult value={output} label="Sorted Lines" />
      )}
    </div>
  );
}
