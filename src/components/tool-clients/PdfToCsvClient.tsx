'use client';

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { callConvert, downloadBlob } from '@/lib/convert-api';
import { pdfjsLoadOptions } from '@/lib/pdfjs-options';
import { ocrImage, pageLooksScanned, type OcrLang } from '@/lib/ocr';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

export default function PdfToCsvClient() {
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [csvPreview, setCsvPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [ocrLang, setOcrLang] = useState<OcrLang>('eng');
  const [ocrPages, setOcrPages] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setFileName(file.name);
    setDownloadUrl(null);
    setCsvPreview('');
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

      const csvLines: string[] = ['Page,Line,Text'];
      let ocrCount = 0;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Group text by lines
        const lines: { y: number; texts: string[] }[] = [];

        textContent.items.forEach((item) => {
          if ('str' in item && item.str.trim()) {
            const y = Math.round(('transform' in item ? item.transform[5] : 0) / 5) * 5;
            let line = lines.find((l) => l.y === y);
            if (!line) {
              line = { y, texts: [] };
              lines.push(line);
            }
            line.texts.push(item.str);
          }
        });

        // Sort by y position
        lines.sort((a, b) => b.y - a.y);

        // Total chars across the page → decide if OCR is needed.
        const totalChars = lines.reduce((n, l) => n + l.texts.join('').length, 0);

        if (ocrEnabled && pageLooksScanned(totalChars)) {
          // Render the page and OCR it. Each OCR'd line becomes a CSV row.
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({ canvas, canvasContext: ctx, viewport }).promise;
            const ocrText = (await ocrImage(canvas, ocrLang)).text;
            ocrText.split('\n').forEach((rawLine, idx) => {
              const text = rawLine.trim();
              if (!text) return;
              csvLines.push(`${i},${idx + 1},"${text.replace(/"/g, '""')}"`);
            });
            ocrCount++;
            setOcrPages(ocrCount);
          }
        } else {
          lines.forEach((line, lineIndex) => {
            const text = line.texts.join(' ').replace(/"/g, '""');
            csvLines.push(`${i},${lineIndex + 1},"${text}"`);
          });
        }

        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const csvContent = csvLines.join('\n');
      setCsvPreview(csvContent.split('\n').slice(0, 20).join('\n'));

      // Prepend UTF-8 BOM so Excel opens non-ASCII characters (Vietnamese,
      // Japanese, Chinese, etc.) correctly instead of treating bytes as ANSI.
      const blob = new Blob(['﻿', csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(
        `Browser conversion failed: ${(err as Error).message}. Try the server option — it detects table columns.`,
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
      const result = await callConvert('pdf-to-csv', file, file.name, {
        fields: { includeBom: 'true' },
      });
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
    link.download = fileName.replace(/\.[^/.]+$/, '') + '.csv';
    link.click();
  };

  const clear = () => {
    setDownloadUrl(null);
    setFileName('');
    setPageCount(0);
    setProgress(0);
    setCsvPreview('');
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
            <p className="text-sm text-gray-500 mt-2">Extract text from PDF to CSV</p>
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
              title="Server-side: clusters columns by x-position for table-shaped PDFs"
            >
              {converting ? 'Converting...' : 'Convert on server'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Server version produces multi-column CSV from table layouts. Browser version emits one column per line.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              Converted {pageCount} pages from <span className="font-medium">{fileName}</span>
            </p>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">CSV Preview</span>
            </div>
            <textarea
              value={csvPreview}
              readOnly
              className="w-full h-48 p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={download}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download CSV
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
