'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { JSONPath } from 'jsonpath-plus';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';
import { ToolError, ToolEmpty } from '@/components/tools/ToolFeedback';
import { formatJSON, minifyJSON, validateJSON } from '@/lib/utils';

// Recursively sort object keys alphabetically. Arrays keep their order
// (sorting array elements would silently corrupt user data).
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

// ─── Tree view ─────────────────────────────────────────────────────────────
// Collapsible JSON viewer. Keeps recursion shallow by reusing a single component
// and tracking the expanded state per node via useState.
function JsonNode({ value, name, depth = 0 }: { value: unknown; name?: string; depth?: number }) {
  const isObject = value !== null && typeof value === 'object';
  // Collapse deeply nested branches by default so big payloads load fast.
  const [open, setOpen] = useState(depth < 2);

  const keyLabel = name !== undefined ? <span className="text-purple-700 font-medium">&quot;{name}&quot;: </span> : null;

  if (!isObject) {
    let cls = 'text-gray-700';
    let display: string;
    if (typeof value === 'string') {
      cls = 'text-green-700';
      display = `"${value}"`;
    } else if (typeof value === 'number') {
      cls = 'text-blue-700';
      display = String(value);
    } else if (typeof value === 'boolean') {
      cls = 'text-orange-700';
      display = String(value);
    } else if (value === null) {
      cls = 'text-gray-500 italic';
      display = 'null';
    } else {
      display = String(value);
    }
    return (
      <div className="leading-6">
        {keyLabel}
        <span className={cls}>{display}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';
  const itemCount = entries.length;

  return (
    <div className="leading-6">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center align-middle text-gray-500 hover:text-gray-700"
        aria-expanded={open}
        aria-label={open ? 'Collapse' : 'Expand'}
      >
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {keyLabel}
      <span className="text-gray-500">{openBracket}</span>
      {!open && (
        <span className="text-gray-400 text-xs ml-1">
          {itemCount} {isArray ? 'items' : 'keys'}
        </span>
      )}
      {open && (
        <div className="pl-5 border-l border-gray-200 ml-1.5">
          {entries.map(([k, v], i) => (
            <div key={k}>
              <JsonNode value={v} name={isArray ? undefined : k} depth={depth + 1} />
              {i < entries.length - 1 && <span className="text-gray-400">,</span>}
            </div>
          ))}
        </div>
      )}
      <span className="text-gray-500">{closeBracket}</span>
    </div>
  );
}

function JsonTreePane({ raw }: { raw: string }) {
  const parsed = useMemo(() => {
    try {
      return { ok: true, value: JSON.parse(raw) } as const;
    } catch (e) {
      return { ok: false, error: (e as Error).message } as const;
    }
  }, [raw]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Tree View</label>
      <div className="px-4 py-3 text-sm font-mono bg-white border border-gray-200 rounded-lg overflow-x-auto">
        {parsed.ok ? <JsonNode value={parsed.value} /> : <span className="text-red-600">{parsed.error}</span>}
      </div>
    </div>
  );
}

type ViewMode = 'formatted' | 'tree';

export default function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [jsonPath, setJsonPath] = useState('');
  const [jsonPathError, setJsonPathError] = useState('');

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

  // Evaluate JSONPath against the input. Output the matched values as a JSON
  // array so users can keep formatting / minifying the result downstream.
  const handleJsonPath = () => {
    setError('');
    setJsonPathError('');
    if (!input.trim()) {
      setError('Please enter some JSON first');
      return;
    }
    if (!jsonPath.trim()) {
      setJsonPathError('Enter a JSONPath expression (e.g. $..name)');
      return;
    }
    const validation = validateJSON(input);
    if (!validation.valid) {
      setError(`Invalid JSON: ${validation.error}`);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const results = JSONPath({ path: jsonPath, json: parsed });
      setOutput(JSON.stringify(results, null, indent === 1 ? '\t' : indent));
    } catch (e) {
      setJsonPathError(`Invalid JSONPath: ${(e as Error).message}`);
    }
  };

  const handleSortKeys = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter some JSON to sort');
      return;
    }
    const validation = validateJSON(input);
    if (!validation.valid) {
      setError(`Invalid JSON: ${validation.error}`);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const sorted = sortKeysDeep(parsed);
      setOutput(JSON.stringify(sorted, null, indent === 1 ? '\t' : indent));
    } catch (e) {
      setError(`Error sorting keys: ${(e as Error).message}`);
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
          lineNumbers
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
            className="appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.375rem_center] bg-no-repeat"
          >
            <option value={2}>2 spaces</option>
            <option value={3}>3 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleFormat}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Format
          </button>
          <button
            onClick={handleSortKeys}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            title="Sort object keys alphabetically (recursive). Array order is preserved."
          >
            Sort Keys
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

      {/* JSONPath Query — filter/extract values from the input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">JSONPath Query (optional)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={jsonPath}
            onChange={(e) => { setJsonPath(e.target.value); setJsonPathError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleJsonPath(); }}
            placeholder="e.g. $..name  •  $.address.city  •  $.hobbies[0]"
            className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJsonPath}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Query
          </button>
        </div>
        {jsonPathError && <p className="text-xs text-red-600">{jsonPathError}</p>}
      </div>

      {/* Error Message */}
      {error && (
        <ToolError
          message={error}
          hint="Check for trailing commas, single quotes, or unquoted keys — those are the most common causes."
        />
      )}

      {/* Output Section */}
      {output && !error ? (
        <div className="space-y-2">
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('formatted')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'formatted' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'tree' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tree
              </button>
            </div>
          </div>
          {viewMode === 'formatted' ? (
            <ToolResult
              value={output}
              label="Formatted JSON"
              language="json"
              theme="light"
            />
          ) : (
            <JsonTreePane raw={output} />
          )}
        </div>
      ) : (
        !error && !input && (
          <ToolEmpty
            message="Formatted JSON will appear here."
            hint='Paste JSON above or click "Load Sample JSON" to try it out.'
          />
        )
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
