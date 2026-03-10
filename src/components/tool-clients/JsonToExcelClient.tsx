'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function JsonToExcelClient() {
  const [jsonData, setJsonData] = useState<string>('');
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('converted');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonData(text);
      validateAndPreview(text);
    };
    reader.readAsText(file);
  };

  const validateAndPreview = (text: string) => {
    setError('');
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setPreview(parsed.slice(0, 5));
      } else if (typeof parsed === 'object') {
        setPreview([parsed]);
      } else {
        setError('JSON must be an array of objects or a single object');
        setPreview([]);
      }
    } catch {
      setError('Invalid JSON format');
      setPreview([]);
    }
  };

  const handleTextChange = (text: string) => {
    setJsonData(text);
    validateAndPreview(text);
  };

  const convertToExcel = () => {
    if (!jsonData.trim() || error) return;

    try {
      const parsed = JSON.parse(jsonData);
      const data = Array.isArray(parsed) ? parsed : [parsed];

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Download
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

  // Get headers from preview data
  const headers = preview.length > 0 ? Object.keys(preview[0]) : [];

  return (
    <div className="space-y-6">
      {/* Upload or Paste */}
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
