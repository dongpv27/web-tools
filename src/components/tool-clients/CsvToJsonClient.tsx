'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function CsvToJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [inferTypes, setInferTypes] = useState(true);

  // Parse the whole CSV as a stream so that newlines inside quoted fields are
  // preserved (splitting on \n first would silently corrupt multi-line cells).
  const parseCsv = (text: string, delim: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cell += ch;
        }
        continue;
      }

      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delim) {
        row.push(cell);
        cell = '';
      } else if (ch === '\n') {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else if (ch === '\r') {
        // Swallow CR — handled by the following LF, or end of input.
        if (text[i + 1] !== '\n') {
          row.push(cell);
          rows.push(row);
          row = [];
          cell = '';
        }
      } else {
        cell += ch;
      }
    }
    // Final cell / row
    if (cell.length > 0 || row.length > 0) {
      row.push(cell);
      rows.push(row);
    }
    return rows;
  };

  const coerce = (raw: string): string | number | boolean | null => {
    const trimmed = raw.trim();
    if (trimmed === '') return '';
    if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === 'true';
    if (/^null$/i.test(trimmed)) return null;
    // Only treat as number if the entire trimmed string is a valid JS number
    // (excludes leading zeros like "007" which are commonly IDs).
    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(trimmed)) {
      return Number(trimmed);
    }
    return raw;
  };

  const convert = () => {
    setError('');
    // Strip UTF-8 BOM if Excel-exported file is pasted in.
    const text = input.replace(/^﻿/, '');
    if (!text.trim()) {
      setError('Please enter CSV data');
      return;
    }

    try {
      const rows = parseCsv(text, delimiter).filter(r => r.length > 0 && !(r.length === 1 && r[0] === ''));
      if (rows.length === 0) {
        setError('No data found');
        return;
      }

      let headers: string[];
      let dataRows: string[][];

      if (hasHeader) {
        headers = rows[0].map(h => h.trim());
        dataRows = rows.slice(1);
      } else {
        headers = Array.from({ length: rows[0].length }, (_, i) => `column${i + 1}`);
        dataRows = rows;
      }

      const result = dataRows.map(values => {
        const obj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          const raw = values[index] ?? '';
          obj[header] = inferTypes ? coerce(raw) : raw;
        });
        return obj;
      });

      setOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setError(`Error parsing CSV: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput(`name,age,email,city
John Doe,30,john@example.com,New York
Jane Smith,25,jane@example.com,Los Angeles
Bob Johnson,35,bob@example.com,Chicago`);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">CSV Input</label>
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
          placeholder="name,age,email&#10;John,30,john@example.com"
          rows={6}
        lineNumbers
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">First row is header</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inferTypes}
            onChange={(e) => setInferTypes(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600" title="Convert &quot;123&quot; → 123, &quot;true&quot; → true, &quot;null&quot; → null">
            Infer types (number, boolean, null)
          </span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Delimiter:</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.375rem_center] bg-no-repeat"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value={'\t'}>Tab</option>
          </select>
        </div>
      </div>

      {/* Actions */}
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
        <ToolResult value={output} label="JSON Output" language="json" />
      )}
    </div>
  );
}
