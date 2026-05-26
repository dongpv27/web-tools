'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

type QuoteStrategy = 'auto' | 'double' | 'single';

export default function JsonToYamlClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [quoteStrategy, setQuoteStrategy] = useState<QuoteStrategy>('auto');
  const [useBlockScalars, setUseBlockScalars] = useState(true);

  // YAML reserved words that, when used as a bare string, would parse as a
  // boolean/null. Must always be quoted to round-trip safely.
  const YAML_RESERVED = /^(true|false|null|yes|no|on|off|~)$/i;

  // Strings that look numeric / hex / octal must be quoted so they parse as
  // strings, not numbers.
  const looksNumeric = (s: string) => /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s)
    || /^0[xX][0-9a-fA-F]+$/.test(s)
    || /^0o[0-7]+$/.test(s);

  // Special YAML start characters that, at the start of a value, require quoting.
  const startsWithSpecial = (s: string) => /^[\-?:,\[\]{}#&*!|>'"%@`\s]/.test(s);

  const needsQuoting = (s: string): boolean => {
    if (s === '') return true;
    if (YAML_RESERVED.test(s)) return true;
    if (looksNumeric(s)) return true;
    if (startsWithSpecial(s)) return true;
    if (/[\s]$/.test(s)) return true; // trailing whitespace
    // ": " (key-value separator) or " #" (comment start) anywhere ambiguates parse.
    if (s.includes(': ') || s.includes(' #')) return true;
    return false;
  };

  const quote = (s: string): string => {
    if (quoteStrategy === 'single') {
      // YAML single-quoted: escape ' as ''
      return `'${s.replace(/'/g, "''")}'`;
    }
    // Default: double quotes with JSON-style escapes.
    return JSON.stringify(s);
  };

  const renderString = (s: string, indent: number): string => {
    const spaces = '  '.repeat(indent);
    // Multi-line strings → block scalar `|` (preserves newlines) when enabled.
    if (useBlockScalars && s.includes('\n') && !s.includes('\0')) {
      const lines = s.split('\n');
      // Trailing newline → use `|` (keep), no trailing → `|-` (strip).
      const trailingNewline = lines[lines.length - 1] === '';
      const header = trailingNewline ? '|' : '|-';
      const bodyLines = trailingNewline ? lines.slice(0, -1) : lines;
      const body = bodyLines.map(l => `${spaces}  ${l}`).join('\n');
      return `${header}\n${body}`;
    }
    if (quoteStrategy === 'double') return quote(s);
    if (quoteStrategy === 'single') return quote(s);
    // auto: only quote when needed
    return needsQuoting(s) ? quote(s) : s;
  };

  const jsonToYaml = (obj: unknown, indent = 0): string => {
    const spaces = '  '.repeat(indent);

    if (obj === null) return 'null';
    if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
    if (typeof obj === 'string') return renderString(obj, indent);

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj
        .map(item => {
          if (item !== null && typeof item === 'object') {
            // Nested object/array under list item — emit "- " on same line as
            // first child key so the structure stays compact and idiomatic.
            const childYaml = jsonToYaml(item, indent + 1);
            const childLines = childYaml.split('\n');
            if (childLines.length === 0) return `${spaces}- ${childYaml}`;
            const first = childLines[0];
            const rest = childLines.slice(1);
            return [
              `${spaces}- ${first.trimStart()}`,
              ...rest.map(l => l), // already indented inside recursive call
            ].join('\n');
          }
          return `${spaces}- ${jsonToYaml(item, indent + 1)}`;
        })
        .join('\n');
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '{}';
      return entries
        .map(([key, value]) => {
          const safeKey = needsQuoting(key) ? quote(key) : key;
          if (value !== null && typeof value === 'object') {
            const isEmpty = Array.isArray(value)
              ? value.length === 0
              : Object.keys(value).length === 0;
            if (isEmpty) {
              return `${spaces}${safeKey}: ${Array.isArray(value) ? '[]' : '{}'}`;
            }
            return `${spaces}${safeKey}:\n${jsonToYaml(value, indent + 1)}`;
          }
          return `${spaces}${safeKey}: ${jsonToYaml(value, indent + 1)}`;
        })
        .join('\n');
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

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">String quoting:</label>
          <select
            value={quoteStrategy}
            onChange={(e) => setQuoteStrategy(e.target.value as QuoteStrategy)}
            className="appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="auto">Auto (quote only when needed)</option>
            <option value="double">Always double quotes</option>
            <option value="single">Always single quotes</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useBlockScalars}
            onChange={(e) => setUseBlockScalars(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600" title="Use | block style for strings containing newlines">
            Block scalars for multi-line strings (<code className="font-mono">|</code>)
          </span>
        </label>
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
