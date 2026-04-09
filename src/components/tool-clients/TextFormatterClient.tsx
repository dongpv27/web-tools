'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function TextFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [lineWidth, setLineWidth] = useState(80);

  const format = () => {
    if (!input.trim()) return;

    // Word wrap at specified width
    const words = input.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= lineWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    setOutput(lines.join('\n'));
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
          placeholder="Enter text to format..."
          rows={6}
        />
      </div>

      {/* Options */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Line width:</label>
        <input
          type="number"
          min="20"
          max="200"
          value={lineWidth}
          onChange={(e) => setLineWidth(Math.max(20, Math.min(200, Number(e.target.value))))}
          className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500">characters</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={format}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Format Text
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
        <ToolResult value={output} label="Formatted Text" textClassName="text-gray-100" />
      )}

      {/* Stats */}
      {output && (
        <div className="text-sm text-gray-500">
          {output.split('\n').length} lines at {lineWidth} characters max
        </div>
      )}
    </div>
  );
}
