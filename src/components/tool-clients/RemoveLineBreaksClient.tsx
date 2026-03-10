'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function RemoveLineBreaksClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [replaceWith, setReplaceWith] = useState(' ');
  const [removeMultiple, setRemoveMultiple] = useState(true);

  const removeLineBreaks = () => {
    if (!input.trim()) return;

    let result = input;

    // Replace line breaks
    result = result.replace(/\r\n|\r|\n/g, replaceWith);

    // Remove multiple consecutive replacements if option is set
    if (removeMultiple && replaceWith) {
      const escaped = replaceWith.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`${escaped}{2,}`, 'g');
      result = result.replace(regex, replaceWith);
    }

    setOutput(result);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const loadSample = () => {
    setInput(`This is line one.
This is line two.
This is line three.

And this is line five after an empty line.`);
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Input Text</label>
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
          placeholder="Enter text with line breaks..."
          rows={6}
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Replace line breaks with:</span>
          <select
            value={replaceWith}
            onChange={(e) => setReplaceWith(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value=" ">Space</option>
            <option value="">Nothing (remove)</option>
            <option value=", ">Comma + Space</option>
            <option value="; ">Semicolon + Space</option>
            <option value=". ">Dot + Space</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeMultiple}
            onChange={(e) => setRemoveMultiple(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Collapse consecutive replacements</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={removeLineBreaks}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Remove Line Breaks
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
        <ToolResult value={output} label="Result (Single Line)" />
      )}

      {/* Stats */}
      {input && output && (
        <div className="text-sm text-gray-500">
          Original: {input.split('\n').length} lines → Result: 1 line
        </div>
      )}
    </div>
  );
}
