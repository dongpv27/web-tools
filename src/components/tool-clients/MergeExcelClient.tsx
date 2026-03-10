'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface ExcelFile {
  name: string;
  data: Record<string, unknown>[];
  headers: string[];
}

export default function MergeExcelClient() {
  const [files, setFiles] = useState<ExcelFile[]>([]);
  const [mergeMode, setMergeMode] = useState<'sheets' | 'rows'>('rows');
  const [merging, setMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setMerging(true);

    try {
      const newFiles: ExcelFile[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const reader = new FileReader();

        const data = await new Promise<Record<string, unknown>[]>((resolve) => {
          reader.onload = (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];
            resolve(jsonData);
          };
          reader.readAsArrayBuffer(file);
        });

        const headers = data.length > 0 ? Object.keys(data[0]) : [];
        newFiles.push({
          name: file.name,
          data,
          headers,
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);
    } catch {
      alert('Error reading files');
    } finally {
      setMerging(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const merge = () => {
    if (files.length < 2) {
      alert('Please add at least 2 files to merge');
      return;
    }

    setMerging(true);

    try {
      const workbook = XLSX.utils.book_new();

      if (mergeMode === 'sheets') {
        // Each file as a separate sheet
        files.forEach((file, index) => {
          const sheet = XLSX.utils.json_to_sheet(file.data);
          const sheetName = file.name.replace(/\.[^/.]+$/, '').substring(0, 31);
          XLSX.utils.book_append_sheet(workbook, sheet, sheetName || `Sheet${index + 1}`);
        });
      } else {
        // Combine all data into one sheet
        const allData: Record<string, unknown>[] = [];
        files.forEach((file) => {
          allData.push(...file.data);
        });
        const sheet = XLSX.utils.json_to_sheet(allData);
        XLSX.utils.book_append_sheet(workbook, sheet, 'Merged');
      }

      // Generate file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      alert('Error merging files');
    } finally {
      setMerging(false);
    }
  };

  const download = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'merged-excel.xlsx';
    link.click();
  };

  const clear = () => {
    setFiles([]);
    setDownloadUrl(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={merging}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Add Excel Files
        </button>
        <p className="text-sm text-gray-500 mt-2">Select multiple Excel files to merge</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Files to merge ({files.length})</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">({file.data.length} rows)</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => moveFile(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveFile(index, 'down')}
                  disabled={index === files.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Merge Mode */}
      {files.length > 0 && (
        <div>
          <label className="block text-sm text-gray-600 mb-2">Merge Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMergeMode('rows')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                mergeMode === 'rows'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Combine Rows
            </button>
            <button
              onClick={() => setMergeMode('sheets')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                mergeMode === 'sheets'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Separate Sheets
            </button>
          </div>
        </div>
      )}

      {/* Download Result */}
      {downloadUrl && (
        <div className="bg-green-50 p-4 rounded-lg space-y-3">
          <p className="text-sm text-green-700">Files merged successfully!</p>
          <button
            onClick={download}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Merged Excel
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={merge}
          disabled={files.length < 2 || merging}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {merging ? 'Merging...' : 'Merge Files'}
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
