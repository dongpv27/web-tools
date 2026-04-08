'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function YamlToJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  // Simple YAML parser for basic YAML structures
  const parseYaml = (yaml: string): unknown => {
    const lines = yaml.split('\n');
    const result: unknown = parseLines(lines, 0, 0).value;
    return result;
  };

  const parseLines = (lines: string[], startIndex: number, baseIndent: number): { value: unknown; nextIndex: number } => {
    const obj: Record<string, unknown> = {};
    const arr: unknown[] = [];
    let isArray = false;
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('#')) {
        i++;
        continue;
      }

      const currentIndent = line.search(/\S/);
      if (currentIndent < baseIndent) {
        break;
      }

      // Array item
      if (trimmed.startsWith('- ')) {
        isArray = true;
        const value = trimmed.slice(2).trim();

        // Check if it's a key-value pair in array
        const colonIndex = value.indexOf(':');
        if (colonIndex > 0) {
          const key = value.slice(0, colonIndex).trim();
          const val = value.slice(colonIndex + 1).trim();

          if (val === '' || val === '|' || val === '>') {
            // Nested object or multiline
            const nested = parseLines(lines, i + 1, currentIndent + 2);
            arr.push({ [key]: nested.value });
            i = nested.nextIndex;
          } else {
            arr.push({ [key]: parseValue(val) });
            i++;
          }
        } else {
          arr.push(parseValue(value));
          i++;
        }
        continue;
      }

      // Key-value pair
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();

        if (value === '' || value === '|' || value === '>') {
          // Nested object or multiline string
          const nested = parseLines(lines, i + 1, currentIndent + 2);
          obj[key] = nested.value;
          i = nested.nextIndex;
        } else {
          obj[key] = parseValue(value);
          i++;
        }
      } else {
        i++;
      }
    }

    return {
      value: isArray ? arr : (Object.keys(obj).length > 0 ? obj : null),
      nextIndex: i
    };
  };

  const parseValue = (value: string): unknown => {
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }

    // Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Null
    if (value === 'null' || value === '~') return null;

    // Number
    const num = Number(value);
    if (!isNaN(num)) return num;

    // String
    return value;
  };

  const convert = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter YAML to convert');
      return;
    }

    try {
      const parsed = parseYaml(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`Invalid YAML: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput(`name: John Doe
age: 30
email: john@example.com
address:
  street: 123 Main St
  city: New York
  country: USA
hobbies:
  - reading
  - gaming
  - coding
isActive: true`);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">YAML Input</label>
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
          placeholder="key: value"
          rows={10}
        lineNumbers
        />
      </div>

      {/* Options */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Indent:</label>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.375rem_center] bg-no-repeat"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={convert}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert to JSON
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
          label="JSON Output"
          language="json"
        />
      )}
    </div>
  );
}
