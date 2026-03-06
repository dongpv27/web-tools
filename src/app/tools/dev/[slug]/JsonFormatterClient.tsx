'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';
import { formatJSON, minifyJSON, validateJSON } from '@/lib/utils';

export default function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const handleFormat = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter some JSON to format');
      return;
    }

    const validation = validateJSON(input);
    if (!validation.valid) {
      setError(`Invalid JSON: ${validation.error}`);
      return;
    }

    try {
      const formatted = formatJSON(input, indent);
      setOutput(formatted);
    } catch (e) {
      setError(`Error formatting JSON: ${(e as Error).message}`);
    }
  };

  const handleMinify = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter some JSON to minify');
      return;
    }

    const validation = validateJSON(input);
    if (!validation.valid) {
      setError(`Invalid JSON: ${validation.error}`);
      return;
    }

    try {
      const minified = minifyJSON(input);
      setOutput(minified);
    } catch (e) {
      setError(`Error minifying JSON: ${(e as Error).message}`);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSampleJson = () => {
    const sampleJson = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      hobbies: ["reading", "gaming", "coding"],
      isActive: true
    };
    setInput(JSON.stringify(sampleJson));
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Input JSON</label>
          <button
            onClick={handleSampleJson}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample JSON
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder='{"key": "value"}'
          rows={10}
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Indent Size */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFormat}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Minify
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Output Section */}
      {output && !error && (
        <ToolResult
          value={output}
          label="Formatted JSON"
          language="json"
        />
      )}

      {/* Stats */}
      {input && !error && (
        <div className="flex gap-6 text-sm text-gray-500">
          <span>Input: {input.length} characters</span>
          {output && <span>Output: {output.length} characters</span>}
        </div>
      )}
    </div>
  );
}
