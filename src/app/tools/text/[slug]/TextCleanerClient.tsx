'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function TextCleanerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    trimWhitespace: true,
    removeMultipleSpaces: true,
    removeEmptyLines: true,
    removeSpecialChars: false,
    removeNumbers: false,
    removePunctuation: false,
    toLowerCase: false,
    toUpperCase: false,
  });

  const clean = () => {
    if (!input.trim()) return;

    let result = input;

    if (options.trimWhitespace) {
      result = result.trim();
    }

    if (options.removeMultipleSpaces) {
      result = result.replace(/[^\S\n]+/g, ' ');
      result = result.split('\n').map(line => line.trim()).join('\n');
    }

    if (options.removeEmptyLines) {
      result = result.replace(/\n\s*\n/g, '\n');
    }

    if (options.removeSpecialChars) {
      result = result.replace(/[^\w\s\n.,!?;:'"()-]/g, '');
    }

    if (options.removeNumbers) {
      result = result.replace(/[0-9]/g, '');
    }

    if (options.removePunctuation) {
      result = result.replace(/[.,!?;:'"()-]/g, '');
    }

    if (options.toLowerCase) {
      result = result.toLowerCase();
    }

    if (options.toUpperCase) {
      result = result.toUpperCase();
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
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to clean..."
          rows={6}
          className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Cleaning Options</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'trimWhitespace', label: 'Trim whitespace' },
            { key: 'removeMultipleSpaces', label: 'Remove multiple spaces' },
            { key: 'removeEmptyLines', label: 'Remove empty lines' },
            { key: 'removeSpecialChars', label: 'Remove special characters' },
            { key: 'removeNumbers', label: 'Remove numbers' },
            { key: 'removePunctuation', label: 'Remove punctuation' },
            { key: 'toLowerCase', label: 'Convert to lowercase' },
            { key: 'toUpperCase', label: 'Convert to uppercase' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[key as keyof typeof options]}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={
                  (key === 'toLowerCase' && options.toUpperCase) ||
                  (key === 'toUpperCase' && options.toLowerCase)
                }
              />
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>
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
        <ToolResult value={output} label="Cleaned Text" />
      )}

      {/* Stats */}
      {input && output && (
        <div className="text-sm text-gray-500">
          Original: {input.length} chars → Cleaned: {output.length} chars
        </div>
      )}
    </div>
  );
}
