'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function CsvToExcelClient() {
  const [csvData, setCsvData] = useState<string>('');
  const [preview, setPreview] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>('converted');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvData(text);
      parsePreview(text);
    };
    reader.readAsText(file);
  };

  const parsePreview = (text: string) => {
    const lines = text.split('\n').slice(0, 10);
    const parsed = lines.map((line) => {
      // Simple CSV parsing (handles basic cases)
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
    setPreview(parsed);
  };

  const handleTextChange = (text: string) => {
    setCsvData(text);
    parsePreview(text);
  };

  const convertToExcel = () => {
    if (!csvData.trim()) return;

    // Parse CSV to array
    const lines = csvData.split('\n').filter((line) => line.trim());
    const data = lines.map((line) => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const clear = () => {
    setCsvData('');
    setPreview([]);
    setFileName('converted');
  };

  return (
    <div className="space-y-6">
      {/* Upload or Paste */}
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload CSV File
          </button>
          <span className="mx-4 text-gray-400">or</span>
          <span className="text-sm text-gray-500">paste CSV data below</span>
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

        {/* CSV Input */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">CSV Data</label>
          <textarea
            value={csvData}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste your CSV data here..."
            className="w-full h-40 p-4 font-mono text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Preview (first 10 rows)</span>
            </div>
            <div className="overflow-x-auto max-h-48">
              <table className="min-w-full text-sm">
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className={i === 0 ? 'bg-gray-50 font-medium' : ''}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
                          {cell}
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
            disabled={!csvData.trim()}
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
