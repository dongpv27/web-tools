'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function RemoveExtraSpacesClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    multipleSpaces: true,
    leadingTrailing: true,
    emptyLines: false,
  });

  const clean = () => {
    if (!input.trim()) return;

    let result = input;

    if (options.multipleSpaces) {
      result = result.replace(/[^\S\n]+/g, ' ');
    }

    if (options.emptyLines) {
      result = result.replace(/\n\s*\n/g, '\n');
    }

    if (options.leadingTrailing) {
      result = result.split('\n').map(line => line.trim()).join('\n');
      result = result.trim();
    }

    setOutput(result);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Input Text</label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Enter text with extra spaces..."
          rows={6}
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Options</label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.multipleSpaces}
            onChange={(e) => setOptions({ ...options, multipleSpaces: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Remove multiple spaces</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.leadingTrailing}
            onChange={(e) => setOptions({ ...options, leadingTrailing: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Trim leading/trailing spaces</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.emptyLines}
            onChange={(e) => setOptions({ ...options, emptyLines: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Remove empty lines</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={clean}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clean Text
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
        <ToolResult value={output} label="Cleaned Text" textClassName="text-gray-100" />
      )}

      {/* Stats */}
      {input && output && (
        <div className="text-sm text-gray-500">
          Removed {input.length - output.length} characters
        </div>
      )}
    </div>
  );
}
