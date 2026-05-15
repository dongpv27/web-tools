'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

type EncodingOption = 'auto' | 'utf-8' | 'shift_jis' | 'gb18030' | 'euc-kr' | 'big5' | 'windows-1258' | 'windows-1252';

const ENCODING_LABELS: Record<EncodingOption, string> = {
  'auto': 'Auto-detect',
  'utf-8': 'UTF-8',
  'shift_jis': 'Shift_JIS (Japanese)',
  'gb18030': 'GB18030 (Chinese Simplified)',
  'euc-kr': 'EUC-KR (Korean)',
  'big5': 'Big5 (Chinese Traditional)',
  'windows-1258': 'Windows-1258 (Vietnamese)',
  'windows-1252': 'Windows-1252 (Western)',
};

// Score a decoded string: lower = better. Counts Unicode replacement chars
// and unusual control bytes that signal wrong encoding.
function scoreDecoded(s: string): number {
  let score = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 0xfffd) score += 100; // replacement char — definitive mojibake
    else if (c < 0x20 && c !== 0x09 && c !== 0x0a && c !== 0x0d) score += 10; // weird control
    else if (c >= 0x80 && c <= 0x9f) score += 5; // C1 controls — usually mojibake from Win-1252
  }
  return score;
}

function autoDecode(bytes: Uint8Array): string {
  // Try strict decoders first; if all fail, pick the lossy decode with the lowest score.
  const strictCandidates: string[] = ['utf-8', 'shift_jis', 'gb18030', 'euc-kr', 'big5'];
  for (const enc of strictCandidates) {
    try {
      return new TextDecoder(enc, { fatal: true }).decode(bytes);
    } catch {
      // try next
    }
  }
  // Lossy fallbacks ranked by score
  const lossy: string[] = ['windows-1258', 'windows-1252'];
  let best = new TextDecoder('windows-1252').decode(bytes);
  let bestScore = scoreDecoded(best);
  for (const enc of lossy) {
    const candidate = new TextDecoder(enc).decode(bytes);
    const s = scoreDecoded(candidate);
    if (s < bestScore) {
      best = candidate;
      bestScore = s;
    }
  }
  return best;
}

export default function CsvToExcelClient() {
  const [csvData, setCsvData] = useState<string>('');
  const [preview, setPreview] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>('converted');
  const [encoding, setEncoding] = useState<EncodingOption>('auto');
  const [lastBuffer, setLastBuffer] = useState<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const decodeCsvBuffer = (buf: ArrayBuffer, enc: EncodingOption): string => {
    const bytes = new Uint8Array(buf);
    // BOM detection (always takes precedence)
    if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      return new TextDecoder('utf-8').decode(bytes.subarray(3));
    }
    if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
      return new TextDecoder('utf-16le').decode(bytes.subarray(2));
    }
    if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
      return new TextDecoder('utf-16be').decode(bytes.subarray(2));
    }
    if (enc === 'auto') return autoDecode(bytes);
    return new TextDecoder(enc).decode(bytes);
  };

  const processFile = (file: File) => {
    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const buf = event.target?.result as ArrayBuffer;
      setLastBuffer(buf);
      const text = decodeCsvBuffer(buf, encoding);
      setCsvData(text);
      parsePreview(text);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEncodingChange = (enc: EncodingOption) => {
    setEncoding(enc);
    if (lastBuffer) {
      const text = decodeCsvBuffer(lastBuffer, enc);
      setCsvData(text);
      parsePreview(text);
    }
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
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
    setLastBuffer(null);
    setEncoding('auto');
  };

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

        {/* Encoding */}
        {lastBuffer && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              File Encoding{' '}
              <span className="text-xs text-gray-400">
                (change if characters look garbled)
              </span>
            </label>
            <select
              value={encoding}
              onChange={(e) => handleEncodingChange(e.target.value as EncodingOption)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {(Object.keys(ENCODING_LABELS) as EncodingOption[]).map((enc) => (
                <option key={enc} value={enc}>
                  {ENCODING_LABELS[enc]}
                </option>
              ))}
            </select>
          </div>
        )}

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
