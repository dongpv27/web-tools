'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function JsonToYamlClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const jsonToYaml = (obj: unknown, indent = 0): string => {
    const spaces = '  '.repeat(indent);

    if (obj === null) {
      return 'null';
    }

    if (typeof obj === 'boolean' || typeof obj === 'number') {
      return String(obj);
    }

    if (typeof obj === 'string') {
      // Check if string needs quotes
      if (obj.includes(':') || obj.includes('#') || obj.includes('\n') || obj === '') {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map(item => {
        const value = jsonToYaml(item, indent + 1);
        if (typeof item === 'object' && item !== null) {
          return `${spaces}-\n${value.split('\n').map(line => `${spaces}  ${line}`).join('\n')}`;
        }
        return `${spaces}- ${value}`;
      }).join('\n');
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '{}';
      return entries.map(([key, value]) => {
        const yamlValue = jsonToYaml(value, indent + 1);
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0) {
          return `${spaces}${key}:\n${yamlValue}`;
        }
        if (Array.isArray(value) && value.length > 0) {
          return `${spaces}${key}:\n${yamlValue}`;
        }
        return `${spaces}${key}: ${yamlValue}`;
      }).join('\n');
    }

    return String(obj);
  };

  const convert = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter JSON to convert');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const yaml = jsonToYaml(parsed);
      setOutput(yaml);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput(JSON.stringify({
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
    }, null, 2));
    setError('');
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
        lineNumbers
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={convert}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert to YAML
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <ToolResult
          value={output}
          label="YAML Output"
          language="yaml"
        />
      )}
    </div>
  );
}
