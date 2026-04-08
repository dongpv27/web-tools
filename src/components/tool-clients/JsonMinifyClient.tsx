'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';
import { validateJSON, minifyJSON } from '@/lib/utils';

export default function JsonMinifyClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ original: number; minified: number; saved: number } | null>(null);

  const handleMinify = () => {
    setError('');
    setStats(null);

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
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([minified]).size;
      setStats({
        original: originalSize,
        minified: minifiedSize,
        saved: originalSize - minifiedSize,
      });
    } catch (e) {
      setError(`Error minifying JSON: ${(e as Error).message}`);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setStats(null);
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
    setInput(JSON.stringify(sampleJson, null, 2));
    setError('');
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="space-y-6">
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
        lineNumbers
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Minify JSON
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {output && !error && (
        <ToolResult
          value={output}
          label="Minified JSON"
          language="json"
        />
      )}

      {stats && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Compression Stats</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Original</p>
              <p className="text-lg font-semibold text-gray-700">{formatBytes(stats.original)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Minified</p>
              <p className="text-lg font-semibold text-green-600">{formatBytes(stats.minified)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Saved</p>
              <p className="text-lg font-semibold text-blue-600">{formatBytes(stats.saved)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
