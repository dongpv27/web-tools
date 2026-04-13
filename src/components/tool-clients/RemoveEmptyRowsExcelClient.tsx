'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function RemoveEmptyRowsExcelClient() {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [stats, setStats] = useState<{ total: number; empty: number; remaining: number } | null>(null);
  const [preview, setPreview] = useState<{ before: string[][]; after: string[][] } | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [rawData, setRawData] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const processFile = (file: File) => {setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setStats(null);
    setPreview(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        setWorkbook(wb);
        setSheets(wb.SheetNames);
        if (wb.SheetNames.length > 0) {
          setSelectedSheet(wb.SheetNames[0]);
          loadData(wb, wb.SheetNames[0]);
        }
      } catch {
        alert('Error reading Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const loadData = (wb: XLSX.WorkBook, sheetName: string) => {
    const sheet = wb.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
    setRawData(jsonData);
    setStats(null);
    setPreview(null);
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook) {
      loadData(workbook, sheetName);
    }
  };

  const isEmptyRow = (row: unknown[]): boolean => {
    return row.every((cell) => cell === null || cell === undefined || String(cell).trim() === '');
  };

  const analyzeAndPreview = () => {
    if (rawData.length === 0) return;

    const headerRow = rawData[0];
    const dataRows = rawData.slice(1);

    const emptyRows = dataRows.filter(isEmptyRow);
    const nonEmptyRows = dataRows.filter((row) => !isEmptyRow(row));

    setStats({
      total: dataRows.length,
      empty: emptyRows.length,
      remaining: nonEmptyRows.length,
    });

    setPreview({
      before: [headerRow, ...dataRows.slice(0, 5)],
      after: [headerRow, ...nonEmptyRows.slice(0, 5)],
    });
  };

  const removeAndDownload = () => {
    if (!workbook || rawData.length === 0) return;

    const headerRow = rawData[0];
    const dataRows = rawData.slice(1);
    const nonEmptyRows = dataRows.filter((row) => !isEmptyRow(row));

    const newData = [headerRow, ...nonEmptyRows];

    // Create new workbook
    const newWb = XLSX.utils.book_new();
    const newWs = XLSX.utils.aoa_to_sheet(newData);
    XLSX.utils.book_append_sheet(newWb, newWs, selectedSheet);

    // Download
    XLSX.writeFile(newWb, `${fileName}_cleaned.xlsx`);
  };

  const clear = () => {
    setSheets([]);
    setSelectedSheet('');
    setStats(null);
    setPreview(null);
    setWorkbook(null);
    setFileName('');
    setRawData([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!workbook ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Excel File
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sheet Selection */}
          {sheets.length > 1 && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">Select Sheet</label>
              <div className="flex flex-wrap gap-2">
                {sheets.map((sheet) => (
                  <button
                    key={sheet}
                    onClick={() => handleSheetChange(sheet)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedSheet === sheet
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sheet}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={analyzeAndPreview}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Analyze Empty Rows
          </button>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Rows</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{stats.empty}</p>
                <p className="text-sm text-gray-500">Empty Rows</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{stats.remaining}</p>
                <p className="text-sm text-gray-500">Remaining Rows</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-red-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-red-700">Before (with empty rows)</span>
                </div>
                <div className="overflow-x-auto max-h-48">
                  <table className="min-w-full text-sm">
                    <tbody>
                      {preview.before.map((row, i) => (
                        <tr
                          key={i}
                          className={i === 0 ? 'bg-gray-50 font-medium' : isEmptyRow(row) ? 'bg-red-50' : ''}
                        >
                          {row.slice(0, 3).map((cell, j) => (
                            <td key={j} className="px-4 py-2 border-b border-gray-100">
                              {String(cell || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-green-700">After (empty rows removed)</span>
                </div>
                <div className="overflow-x-auto max-h-48">
                  <table className="min-w-full text-sm">
                    <tbody>
                      {preview.after.map((row, i) => (
                        <tr key={i} className={i === 0 ? 'bg-gray-50 font-medium' : ''}>
                          {row.slice(0, 3).map((cell, j) => (
                            <td key={j} className="px-4 py-2 border-b border-gray-100">
                              {String(cell || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={removeAndDownload}
              disabled={!stats || stats.empty === 0}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove & Download
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
