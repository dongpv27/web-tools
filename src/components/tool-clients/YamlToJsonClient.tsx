'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

// Hoisted out of the component so its identity is stable across renders —
// keeps `instanceof YamlParseError` reliable.
type SourceLine = { raw: string; trimmed: string; indent: number; lineNo: number };

class YamlParseError extends Error {
  lineNo: number;
  constructor(message: string, lineNo: number) {
    super(message);
    this.lineNo = lineNo;
  }
}

export default function YamlToJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const prepLines = (yaml: string): SourceLine[] => {
    return yaml.split('\n').map((raw, idx) => {
      const indent = raw.search(/\S/);
      return {
        raw,
        trimmed: raw.trim(),
        indent: indent === -1 ? 0 : indent,
        lineNo: idx + 1,
      };
    });
  };

  // Simple YAML parser for basic YAML structures
  const parseYaml = (yaml: string): unknown => {
    const lines = prepLines(yaml);
    return parseLines(lines, 0, 0).value;
  };

  const parseLines = (
    lines: SourceLine[],
    startIndex: number,
    baseIndent: number,
  ): { value: unknown; nextIndex: number } => {
    const obj: Record<string, unknown> = {};
    const arr: unknown[] = [];
    let isArray = false;
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trimmed;

      // Skip empty lines, comments, and document markers
      if (trimmed === '' || trimmed.startsWith('#') || trimmed === '---' || trimmed === '...') {
        i++;
        continue;
      }

      if (line.indent < baseIndent) {
        break;
      }

      // Array item
      if (trimmed.startsWith('- ') || trimmed === '-') {
        isArray = true;
        const value = trimmed === '-' ? '' : trimmed.slice(2).trim();

        if (value === '') {
          // "- " alone: nested object/array on next line
          const nested = parseLines(lines, i + 1, line.indent + 2);
          arr.push(nested.value);
          i = nested.nextIndex;
          continue;
        }

        // Check if it's a key-value pair inside the array item
        const colonIndex = findKeyColon(value);
        if (colonIndex > 0) {
          const key = value.slice(0, colonIndex).trim();
          const val = value.slice(colonIndex + 1).trim();

          if (val === '' || val === '|' || val === '>') {
            const nested = parseLines(lines, i + 1, line.indent + 2);
            arr.push({ [unquoteKey(key)]: nested.value });
            i = nested.nextIndex;
          } else {
            arr.push({ [unquoteKey(key)]: parseValue(val, line.lineNo) });
            i++;
          }
        } else {
          arr.push(parseValue(value, line.lineNo));
          i++;
        }
        continue;
      }

      // Key-value pair
      const colonIndex = findKeyColon(trimmed);
      if (colonIndex > 0) {
        const key = unquoteKey(trimmed.slice(0, colonIndex).trim());
        const value = trimmed.slice(colonIndex + 1).trim();

        if (value === '' || value === '|' || value === '>') {
          const nested = parseLines(lines, i + 1, line.indent + 2);
          obj[key] = nested.value;
          i = nested.nextIndex;
        } else {
          obj[key] = parseValue(value, line.lineNo);
          i++;
        }
        continue;
      }

      throw new YamlParseError(
        `Unexpected line "${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}"`,
        line.lineNo,
      );
    }

    return {
      value: isArray ? arr : obj,
      nextIndex: i,
    };
  };

  // Find the `:` that acts as YAML key separator. Skip colons inside quoted
  // strings so things like `url: "http://x"` parse correctly.
  const findKeyColon = (s: string): number => {
    let quote: string | null = null;
    for (let j = 0; j < s.length; j++) {
      const ch = s[j];
      if (quote) {
        if (ch === '\\') { j++; continue; }
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === ':') return j;
    }
    return -1;
  };

  const unquoteKey = (key: string): string => {
    if (
      (key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))
    ) {
      return key.slice(1, -1);
    }
    return key;
  };

  // Parse a single inline flow value, e.g. `[1, 2]`, `{a: 1, b: 2}`, `"text"`.
  const parseFlow = (value: string, lineNo: number): unknown => {
    // Translate YAML flow syntax to JSON by mapping unquoted bare scalars onto
    // JSON-compatible literals — good enough for the common case.
    let normalized = value
      .replace(/'([^']*)'/g, (_, s) => JSON.stringify(s))
      .replace(/(?<=[{,]\s*)([A-Za-z_][\w-]*)(?=\s*:)/g, '"$1"');
    try {
      return JSON.parse(normalized);
    } catch {
      throw new YamlParseError(`Invalid inline value "${value}"`, lineNo);
    }
  };

  const parseValue = (value: string, lineNo: number): unknown => {
    // Inline flow forms
    if (value.startsWith('[') && value.endsWith(']')) return parseFlow(value, lineNo);
    if (value.startsWith('{') && value.endsWith('}')) return parseFlow(value, lineNo);

    // Quoted strings
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        return JSON.parse(value);
      } catch {
        return value.slice(1, -1);
      }
    }
    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1).replace(/''/g, "'");
    }

    // Strip trailing comment (only when preceded by whitespace, to keep `#` inside scalars)
    const commentMatch = value.match(/^([^#]*?)\s+#.*$/);
    if (commentMatch) value = commentMatch[1].trim();

    // Boolean / null (YAML 1.1 spelling variants)
    if (/^(true|yes|on)$/i.test(value)) return true;
    if (/^(false|no|off)$/i.test(value)) return false;
    if (value === 'null' || value === '~' || value === '') return null;

    // Number — only when entire string parses cleanly as JS number
    if (/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(value)) {
      const num = Number(value);
      if (!isNaN(num)) return num;
    }

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
      if (e instanceof YamlParseError) {
        setError(`Line ${e.lineNo}: ${e.message}`);
      } else {
        setError(`Invalid YAML: ${(e as Error).message}`);
      }
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
