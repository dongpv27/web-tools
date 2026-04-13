'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelToSqlClient() {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [preview, setPreview] = useState<string[][]>([]);
  const [sqlOutput, setSqlOutput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [tableName, setTableName] = useState<string>('my_table');
  const [sqlType, setSqlType] = useState<'insert' | 'create' | 'both'>('insert');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const processFile = (file: File) => {setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setTableName(file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_'));
    setSqlOutput('');

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
        alert('Error reading Excel file');
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
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
    setPreview(jsonData.slice(0, 5));
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook) {
      showPreview(workbook, sheetName);
    }
    setSqlOutput('');
  };

  const escapeSql = (value: unknown): string => {
    if (value === null || value === undefined) return 'NULL';
    const str = String(value);
    return `'${str.replace(/'/g, "''")}'`;
  };

  const convertToSql = () => {
    if (!workbook || !selectedSheet) return;

    const sheet = workbook.Sheets[selectedSheet];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

    if (jsonData.length < 2) {
      alert('Not enough data to generate SQL');
      return;
    }

    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1);
    let sql = '';

    // Generate CREATE TABLE statement
    if (sqlType === 'create' || sqlType === 'both') {
      sql += `-- Create table\n`;
      sql += `CREATE TABLE ${tableName} (\n`;
      sql += `  id INT AUTO_INCREMENT PRIMARY KEY,\n`;

      headers.forEach((header, i) => {
        const columnName = String(header || `column_${i}`).replace(/[^a-zA-Z0-9_]/g, '_');
        sql += `  ${columnName} TEXT`;
        if (i < headers.length - 1) sql += ',';
        sql += '\n';
      });

      sql += `);\n\n`;
    }

    // Generate INSERT statements
    if (sqlType === 'insert' || sqlType === 'both') {
      sql += `-- Insert data\n`;

      rows.forEach((row) => {
        const values = headers.map((_, i) => escapeSql((row as unknown[])[i]));
        const columnNames = headers.map((h, i) =>
          String(h || `column_${i}`).replace(/[^a-zA-Z0-9_]/g, '_')
        );

        sql += `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${values.join(', ')});\n`;
      });
    }

    setSqlOutput(sql);
  };

  const download = () => {
    if (!sqlOutput) return;

    const blob = new Blob([sqlOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableName}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!sqlOutput) return;
    try {
      await navigator.clipboard.writeText(sqlOutput);
      alert('Copied to clipboard!');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = sqlOutput;
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
    setSqlOutput('');
    setFileName('');
    setWorkbook(null);
  };

  return (
    <div className="space-y-6">
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

          {/* SQL Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Table Name</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value.replace(/[^a-zA-Z0-9_]/g, '_'))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">SQL Type</label>
              <select
                value={sqlType}
                onChange={(e) => setSqlType(e.target.value as 'insert' | 'create' | 'both')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="insert">INSERT only</option>
                <option value="create">CREATE TABLE only</option>
                <option value="both">Both CREATE and INSERT</option>
              </select>
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
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className={i === 0 ? 'bg-gray-50 font-medium' : ''}>
                        {row.slice(0, 5).map((cell, j) => (
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
          )}

          {/* Convert Button */}
          <button
            onClick={convertToSql}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate SQL
          </button>

          {/* Output */}
          {sqlOutput && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">SQL Output</span>
                </div>
                <textarea
                  value={sqlOutput}
                  readOnly
                  className="w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={download}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download SQL
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
