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
            className="appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.375rem_center] bg-no-repeat"
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
        <ToolResult value={output} label="Result (Single Line)" textClassName="text-gray-100" />
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
