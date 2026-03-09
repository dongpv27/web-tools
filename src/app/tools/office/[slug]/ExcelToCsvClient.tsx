'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelToCsvClient() {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [preview, setPreview] = useState<string[][]>([]);
  const [csvOutput, setCsvOutput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setCsvOutput('');
    setPreview([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        setWorkbook(wb);
        setSheets(wb.SheetNames);
        if (wb.SheetNames.length > 0) {
          setSelectedSheet(wb.SheetNames[0]);
          showPreview(wb, wb.SheetNames[0]);
        }
      } catch {
        alert('Error reading Excel file. Please make sure it\'s a valid .xlsx or .xls file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const showPreview = (wb: XLSX.WorkBook, sheetName: string) => {
    const sheet = wb.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
    setPreview(jsonData.slice(0, 10)); // Show first 10 rows
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook) {
      showPreview(workbook, sheetName);
    }
    setCsvOutput('');
  };

  const convertToCsv = () => {
    if (!workbook || !selectedSheet) return;

    const sheet = workbook.Sheets[selectedSheet];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    setCsvOutput(csv);
  };

  const download = () => {
    if (!csvOutput) return;

    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'converted'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!csvOutput) return;
    try {
      await navigator.clipboard.writeText(csvOutput);
      alert('Copied to clipboard!');
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = csvOutput;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
  };

  const clear = () => {
    setSheets([]);
    setSelectedSheet('');
    setPreview([]);
    setCsvOutput('');
    setFileName('');
    setWorkbook(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!workbook ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
          <p className="text-sm text-gray-500 mt-2">Supports .xlsx and .xls files</p>
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

          {/* Preview */}
          {preview.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Preview (first 10 rows)</span>
              </div>
              <div className="overflow-x-auto max-h-64">
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

          {/* Convert Button */}
          <button
            onClick={convertToCsv}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Convert to CSV
          </button>

          {/* Output */}
          {csvOutput && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">CSV Output</span>
                  <span className="text-xs text-gray-500">{csvOutput.split('\n').length} rows</span>
                </div>
                <textarea
                  value={csvOutput}
                  readOnly
                  className="w-full h-48 p-4 font-mono text-sm resize-none focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={download}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download CSV
                </button>
                <button
                  onClick={copy}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}

          {/* Clear Button */}
          <button
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
