'use client';

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { callConvert, downloadBlob } from '@/lib/convert-api';
import { pdfjsLoadOptions } from '@/lib/pdfjs-options';
import { ocrImage, pageLooksScanned, type OcrLang } from '@/lib/ocr';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

export default function PdfToExcelClient() {
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [ocrLang, setOcrLang] = useState<OcrLang>('eng');
  const [ocrPages, setOcrPages] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setFileName(file.name);
    setDownloadUrl(null);
    setError('');
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
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, ...pdfjsLoadOptions }).promise;

      setPageCount(pdf.numPages);

      const workbook = XLSX.utils.book_new();
      let ocrCount = 0;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

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
        lines.sort((a, b) => b.y - a.y);

        const totalChars = lines.reduce((n, l) => n + l.texts.join('').length, 0);
        let data: string[][];

        if (ocrEnabled && pageLooksScanned(totalChars)) {
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({ canvas, canvasContext: ctx, viewport }).promise;
            const ocrText = await ocrImage(canvas, ocrLang);
            data = ocrText
              .split('\n')
              .map((row) => row.trim())
              .filter(Boolean)
              .map((row) => [row]);
            ocrCount++;
            setOcrPages(ocrCount);
          } else {
            data = lines.map((line) => [line.texts.join(' ')]);
          }
        } else {
          data = lines.map((line) => [line.texts.join(' ')]);
        }

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
    } catch (err) {
      setError(
        `Browser conversion failed: ${(err as Error).message}. Try the server option below — it uses column-aware extraction.`,
      );
    } finally {
      setConverting(false);
    }
  };

  const convertServer = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setConverting(true);
    setError('');
    try {
      const result = await callConvert('pdf-to-excel', file, file.name);
      downloadBlob(result.blob, result.filename);
    } catch (err) {
      setError(`Server conversion failed: ${(err as Error).message}`);
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

          <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={ocrEnabled}
                onChange={(e) => setOcrEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              OCR scanned pages (slow)
            </label>
            {ocrEnabled && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Language:</label>
                <select
                  value={ocrLang}
                  onChange={(e) => setOcrLang(e.target.value as OcrLang)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                >
                  <option value="eng">English</option>
                  <option value="vie">Vietnamese</option>
                  <option value="eng+vie">English + Vietnamese</option>
                  <option value="chi_sim">Chinese</option>
                  <option value="jpn">Japanese</option>
                  <option value="kor">Korean</option>
                  <option value="fra">French</option>
                  <option value="spa">Spanish</option>
                  <option value="deu">German</option>
                  <option value="rus">Russian</option>
                </select>
              </div>
            )}
            {ocrPages > 0 && (
              <span className="text-xs text-amber-700">{ocrPages} page(s) OCR&apos;d</span>
            )}
          </div>

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

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={convert}
              disabled={!fileName || converting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {converting ? 'Converting...' : 'Convert in browser'}
            </button>
            <button
              onClick={convertServer}
              disabled={!fileName || converting}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Server-side: clusters x-positions into columns for table-shaped PDFs"
            >
              {converting ? 'Converting...' : 'Convert on server'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Server version detects table columns from text positions. Browser version puts each line in one cell.
          </p>
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
