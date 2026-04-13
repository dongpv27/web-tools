'use client';

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToExcelClient() {
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const processFile = (file: File) => {setFileName(file.name);
    setDownloadUrl(null);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const convert = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) return;

    setConverting(true);
    setProgress(0);

    try {
      const file = fileInput.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      setPageCount(pdf.numPages);

      const workbook = XLSX.utils.book_new();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Group text by lines (approximate by y position)
        const lines: { y: number; texts: string[] }[] = [];

        textContent.items.forEach((item) => {
          if ('str' in item && item.str.trim()) {
            const y = Math.round(('transform' in item ? item.transform[5] : 0) / 10) * 10;
            let line = lines.find((l) => l.y === y);
            if (!line) {
              line = { y, texts: [] };
              lines.push(line);
            }
            line.texts.push(item.str);
          }
        });

        // Sort by y position (descending for top to bottom)
        lines.sort((a, b) => b.y - a.y);

        // Convert to 2D array
        const data = lines.map((line) => [line.texts.join(' ')]);

        const sheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, `Page ${i}`);

        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      alert('Error converting PDF. Note: This works best with text-based PDFs with tabular data.');
    } finally {
      setConverting(false);
    }
  };

  const download = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '.xlsx';
    link.click();
  };

  const clear = () => {
    setDownloadUrl(null);
    setFileName('');
    setPageCount(0);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {!downloadUrl ? (
        <div className="space-y-4">
          <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={converting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Upload PDF File
            </button>
            <p className="text-sm text-gray-500 mt-2">Extract text from PDF to Excel</p>
          </div>

          {fileName && (
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{fileName}</span>
            </p>
          )}

          {converting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Converting...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={convert}
            disabled={!fileName || converting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {converting ? 'Converting...' : 'Convert to Excel'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              Converted {pageCount} pages from <span className="font-medium">{fileName}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={download}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download Excel
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
