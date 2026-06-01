'use client';

import { useState, useMemo } from 'react';
import CopyButton from '@/components/ui/CopyButton';

type Delimiter = ',' | ';' | '\t' | '|';
const DELIM_LABEL: Record<Delimiter, string> = {
  ',': 'Comma (,)',
  ';': 'Semicolon (;)',
  '\t': 'Tab',
  '|': 'Pipe (|)',
};

export default function JsonToCsvClient() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [quoteAll, setQuoteAll] = useState(true);
  const [flattenNested, setFlattenNested] = useState(true);

  // Flatten one level of nested objects so `{user:{name:"A"}}` becomes
  // `user.name`. Arrays stay JSON-stringified — keeping them as repeated
  // columns would change row width and confuse spreadsheet imports.
  const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        Object.assign(out, flatten(v as Record<string, unknown>, key));
      } else {
        out[key] = v;
      }
    }
    return out;
  };

  const escapeCell = (raw: unknown, delim: string): string => {
    if (raw === null || raw === undefined) return quoteAll ? '""' : '';
    const value = typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
    const needsQuote = quoteAll || value.includes(delim) || value.includes('"') || value.includes('\n') || value.includes('\r');
    const escaped = value.replace(/"/g, '""');
    return needsQuote ? `"${escaped}"` : escaped;
  };

  const { output, errMsg } = useMemo(() => {
    if (!input.trim()) return { output: '', errMsg: '' };
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data)) return { output: '', errMsg: 'JSON must be an array of objects.' };
      if (data.length === 0) return { output: '', errMsg: 'Array is empty.' };

      const rows: Record<string, unknown>[] = flattenNested
        ? data.map((d) =>
            d && typeof d === 'object' && !Array.isArray(d)
              ? flatten(d as Record<string, unknown>)
              : ({ value: d } as Record<string, unknown>),
          )
        : data.map((d) =>
            d && typeof d === 'object'
              ? (d as Record<string, unknown>)
              : ({ value: d } as Record<string, unknown>),
          );

      const headers = [...new Set(rows.flatMap((obj) => Object.keys(obj)))];
      const csvRows: string[] = [];
      csvRows.push(headers.map((h) => escapeCell(h, delimiter)).join(delimiter));
      for (const item of rows) {
        csvRows.push(headers.map((h) => escapeCell(item[h], delimiter)).join(delimiter));
      }
      return { output: csvRows.join('\n'), errMsg: '' };
    } catch (e) {
      return { output: '', errMsg: 'Invalid JSON: ' + (e as Error).message };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, delimiter, quoteAll, flattenNested]);

  // Hoist the live errMsg into state on submit click, but also show it inline
  // when the user actively typed something. Avoids flashing the error on a
  // pristine load.
  if (errMsg && error !== errMsg && input.trim()) setError(errMsg);
  if (!errMsg && error) setError('');

  // Preview = first 6 rows of the output, rendered as a real table so users
  // can verify column splits with their chosen delimiter before downloading.
  const previewTable = useMemo(() => {
    if (!output) return null;
    const lines = output.split('\n').slice(0, 7);
    return lines.map((line) => parseCsvLine(line, delimiter));
  }, [output, delimiter]);

  const clear = () => {
    setInput('');
    setError('');
  };

  const loadSample = () => {
    setInput(JSON.stringify([
      { name: 'John', age: 30, address: { city: 'New York', zip: '10001' } },
      { name: 'Jane', age: 25, address: { city: 'Los Angeles', zip: '90001' } },
      { name: 'Bob', age: 35, address: { city: 'Chicago', zip: '60601' } },
    ], null, 2));
    setError('');
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">JSON Input</label>
          <div className="flex gap-3 text-sm">
            <button onClick={loadSample} className="text-blue-600 hover:text-blue-700">Load Sample</button>
            <button onClick={clear} className="text-gray-600 hover:text-gray-800">Clear</button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          className="w-full h-48 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Delimiter:</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as Delimiter)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {(Object.keys(DELIM_LABEL) as Delimiter[]).map((d) => (
              <option key={d} value={d}>{DELIM_LABEL[d]}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={quoteAll} onChange={(e) => setQuoteAll(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-gray-600">Always quote values</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={flattenNested} onChange={(e) => setFlattenNested(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-gray-600" title='{"a":{"b":1}} becomes column "a.b"'>Flatten nested objects</span>
        </label>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {output && (
        <div className="space-y-3">
          {previewTable && previewTable.length > 1 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preview {output.split('\n').length > 7 && <span className="text-xs text-gray-500">(first 6 rows)</span>}
              </label>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewTable[0].map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewTable.slice(1).map((row, ri) => (
                      <tr key={ri} className="border-b border-gray-100 last:border-0">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-1.5 text-gray-600 font-mono">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">CSV Output</label>
            <div className="flex gap-2">
              <button onClick={download} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Download CSV</button>
              <CopyButton text={output} />
            </div>
          </div>
          <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap max-h-64">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// Minimal CSV-line parser for the preview only (good enough for our own
// output, which uses standard double-quote escaping).
function parseCsvLine(line: string, delim: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) { cells.push(cur); cur = ''; }
    else cur += c;
  }
  cells.push(cur);
  return cells;
}
