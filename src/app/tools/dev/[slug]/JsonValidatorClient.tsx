'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';

export default function JsonValidatorClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    message: string;
    parsed?: unknown;
    stats?: {
      keys: number;
      depth: number;
      size: string;
    };
  } | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setResult({
        valid: false,
        message: 'Please enter JSON to validate',
      });
      return;
    }

    try {
      const parsed = JSON.parse(input);

      // Calculate stats
      const countKeys = (obj: unknown, depth = 0): { keys: number; depth: number } => {
        if (typeof obj !== 'object' || obj === null) {
          return { keys: 0, depth };
        }

        let keys = 0;
        let maxDepth = depth;

        if (Array.isArray(obj)) {
          for (const item of obj) {
            const result = countKeys(item, depth + 1);
            keys += result.keys;
            maxDepth = Math.max(maxDepth, result.depth);
          }
        } else {
          keys = Object.keys(obj).length;
          for (const value of Object.values(obj)) {
            const result = countKeys(value, depth + 1);
            keys += result.keys;
            maxDepth = Math.max(maxDepth, result.depth);
          }
        }

        return { keys, depth: maxDepth };
      };

      const stats = countKeys(parsed);
      const size = new Blob([input]).size;
      const sizeStr = size < 1024 ? `${size} B` : `${(size / 1024).toFixed(2)} KB`;

      setResult({
        valid: true,
        message: 'Valid JSON',
        parsed,
        stats: {
          keys: stats.keys,
          depth: stats.depth + 1,
          size: sizeStr,
        },
      });
    } catch (e) {
      const error = e as SyntaxError;
      // Try to extract position from error message
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1], 10) : null;
      let message = error.message;

      if (position !== null) {
        const lines = input.substring(0, position).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        message = `${error.message} at line ${line}, column ${col}`;
      }

      setResult({
        valid: false,
        message,
      });
    }
  };

  const formatJson = () => {
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Ignore if invalid
    }
  };

  const clearAll = () => {
    setInput('');
    setResult(null);
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York"
      },
      hobbies: ["reading", "gaming"]
    }, null, 2));
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">JSON Input</label>
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
          placeholder='{"key": "value"}'
          rows={10}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={validate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Validate JSON
        </button>
        <button
          onClick={formatJson}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Format
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-lg border ${
            result.valid
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.valid ? (
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
              {result.message}
            </span>
          </div>

          {/* Stats */}
          {result.valid && result.stats && (
            <div className="mt-3 flex gap-4 text-sm text-green-700">
              <span>📦 {result.stats.keys} keys</span>
              <span>📏 {result.stats.depth} levels deep</span>
              <span>💾 {result.stats.size}</span>
            </div>
          )}
        </div>
      )}

      {/* Parsed Preview */}
      {result?.valid && result.parsed !== undefined && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parsed Structure
          </label>
          <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm overflow-auto max-h-64">
            <code>{JSON.stringify(result.parsed, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
