'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelToJsonClient() {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [inputFileName, setInputFileName] = useState<string>('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const processFile = (file: File) => {
    setInputFileName(file.name);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setJsonOutput('');
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

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const showPreview = (wb: XLSX.WorkBook, sheetName: string) => {
    const sheet = wb.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];
    setPreview(jsonData.slice(0, 5)); // Show first 5 rows
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook) {
      showPreview(workbook, sheetName);
    }
    setJsonOutput('');
  };

  const convertToJson = () => {
    if (!workbook || !selectedSheet) return;

    const sheet = workbook.Sheets[selectedSheet];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    const jsonString = JSON.stringify(jsonData, null, 2);
    setJsonOutput(jsonString);
  };

  const download = () => {
    if (!jsonOutput) return;

    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'converted'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!jsonOutput) return;
    try {
      await navigator.clipboard.writeText(jsonOutput);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = jsonOutput;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => {
    setSheets([]);
    setSelectedSheet('');
    setPreview([]);
    setJsonOutput('');
    setFileName('');
    setInputFileName('');
    setWorkbook(null);
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
          <p className="text-sm text-gray-500 mt-2">Supports .xlsx and .xls files</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Imported File */}
          {inputFileName && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md">
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700 truncate" title={inputFileName}>
                <span className="text-gray-500">Imported:</span>{' '}
                <span className="font-medium">{inputFileName}</span>
              </span>
            </div>
          )}

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
                <span className="text-sm font-medium text-gray-700">Preview (first 5 rows)</span>
              </div>
              <div className="overflow-x-auto max-h-64 p-4">
                <pre className="text-xs font-mono">{JSON.stringify(preview, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={convertToJson}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Convert to JSON
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Output */}
          {jsonOutput && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">JSON Output</span>
                  <span className="text-xs text-gray-500">
                    {(JSON.parse(jsonOutput) as unknown[]).length} records
                  </span>
                </div>
                <textarea
                  value={jsonOutput}
                  readOnly
                  className="w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={download}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download JSON
                </button>
                <button
                  onClick={copy}
                  className={`px-4 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors duration-700 ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    'Copy to Clipboard'
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
