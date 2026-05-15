'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

// Flatten nested objects/arrays into dot-notation keys so each leaf becomes
// its own Excel column. Arrays of primitives are joined; arrays of objects
// are flattened with bracket-index notation (items[0].name).
function flattenObject(
  obj: unknown,
  prefix = '',
  out: Record<string, unknown> = {},
): Record<string, unknown> {
  if (obj === null || obj === undefined) {
    if (prefix) out[prefix] = obj ?? '';
    return out;
  }
  if (typeof obj !== 'object') {
    out[prefix] = obj;
    return out;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      out[prefix] = '';
      return out;
    }
    const allPrimitive = obj.every((v) => v === null || typeof v !== 'object');
    if (allPrimitive) {
      out[prefix] = obj.join(', ');
      return out;
    }
    obj.forEach((item, i) => {
      flattenObject(item, prefix ? `${prefix}[${i}]` : `[${i}]`, out);
    });
    return out;
  }
  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0 && prefix) {
    out[prefix] = '';
    return out;
  }
  for (const [k, v] of entries) {
    const next = prefix ? `${prefix}.${k}` : k;
    flattenObject(v, next, out);
  }
  return out;
}

type NestedMode = 'flatten' | 'stringify';

export default function JsonToExcelClient() {
  const [jsonData, setJsonData] = useState<string>('');
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('converted');
  const [nestedMode, setNestedMode] = useState<NestedMode>('flatten');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transformRow = (row: unknown, mode: NestedMode): Record<string, unknown> => {
    if (row === null || typeof row !== 'object') return { value: row };
    if (mode === 'flatten') return flattenObject(row);
    // stringify mode: keep top-level keys, but JSON-encode nested values
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
      if (v !== null && typeof v === 'object') out[k] = JSON.stringify(v);
      else out[k] = v;
    }
    return out;
  };

  
  const processFile = (file: File) => {setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonData(text);
      validateAndPreview(text);
    };
    reader.readAsText(file);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const validateAndPreview = (text: string, mode: NestedMode = nestedMode) => {
    setError('');
    try {
      const parsed = JSON.parse(text);
      const rows = Array.isArray(parsed) ? parsed : typeof parsed === 'object' ? [parsed] : null;
      if (!rows) {
        setError('JSON must be an array of objects or a single object');
        setPreview([]);
        return;
      }
      setPreview(rows.slice(0, 5).map((r) => transformRow(r, mode)));
    } catch {
      setError('Invalid JSON format');
      setPreview([]);
    }
  };

  const handleTextChange = (text: string) => {
    setJsonData(text);
    validateAndPreview(text);
  };

  const handleNestedModeChange = (mode: NestedMode) => {
    setNestedMode(mode);
    if (jsonData.trim()) validateAndPreview(jsonData, mode);
  };

  const convertToExcel = () => {
    if (!jsonData.trim() || error) return;

    try {
      const parsed = JSON.parse(jsonData);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      const data = rows.map((r) => transformRow(r, nestedMode));

      // Collect a stable, union header order: keys from the first row, then
      // any new keys discovered in later rows (preserves user-intuitive order).
      const headerSet = new Set<string>();
      for (const row of data) for (const k of Object.keys(row)) headerSet.add(k);
      const header = Array.from(headerSet);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data, { header });
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch {
      alert('Error converting JSON to Excel');
    }
  };

  const clear = () => {
    setJsonData('');
    setPreview([]);
    setError('');
    setFileName('converted');
  };

  // Union of headers across all preview rows
  const headers = Array.from(
    preview.reduce<Set<string>>((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );

  return (
    <div className="space-y-6">
      {/* Upload or Paste */}
      <div className="space-y-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload JSON File
          </button>
          <span className="mx-4 text-gray-400">or</span>
          <span className="text-sm text-gray-500">paste JSON data below</span>
        </div>

        {/* File Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Output File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* JSON Input */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">JSON Data</label>
          <textarea
            value={jsonData}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
            className="w-full h-40 p-4 font-mono text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Nested handling */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Nested Objects{' '}
            <span className="text-xs text-gray-400">
              (how to handle objects/arrays inside JSON)
            </span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleNestedModeChange('flatten')}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                nestedMode === 'flatten'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Flatten (dot notation)
            </button>
            <button
              type="button"
              onClick={() => handleNestedModeChange('stringify')}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                nestedMode === 'stringify'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Stringify as JSON
            </button>
          </div>
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Preview (first 5 rows)</span>
            </div>
            <div className="overflow-x-auto max-h-48">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {headers.map((header) => (
                      <th key={header} className="px-4 py-2 text-left font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      {headers.map((header) => (
                        <td key={header} className="px-4 py-2">
                          {String(row[header] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={convertToExcel}
            disabled={!jsonData.trim() || !!error}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Convert to Excel
          </button>
          <button
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
