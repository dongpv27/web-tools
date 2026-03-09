'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function SplitPdfClient() {
  const [fileName, setFileName] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [splitMode, setSplitMode] = useState<'all' | 'range' | 'select'>('all');
  const [pageRanges, setPageRanges] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitResult, setSplitResult] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSplitResult([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const pdf = await PDFDocument.load(bytes);

      setPdfBytes(bytes);
      setPageCount(pdf.getPageCount());
      setSelectedPages([]);
    } catch {
      alert('Error reading PDF file');
    }
  };

  const togglePage = (page: number) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page].sort((a, b) => a - b)
    );
  };

  const split = async () => {
    if (!pdfBytes) return;

    setLoading(true);

    try {
      const results: { name: string; url: string }[] = [];

      if (splitMode === 'all') {
        // Split each page into separate file
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const sourcePdf = await PDFDocument.load(pdfBytes);
          const [page] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(page);

          const bytes = await newPdf.save();
          const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          results.push({
            name: `${fileName.replace(/\.[^/.]+$/, '')}_page${i + 1}.pdf`,
            url,
          });
        }
      } else if (splitMode === 'range' && pageRanges) {
        // Parse ranges like "1-3,5,7-9"
        const ranges = pageRanges.split(',').map((r) => r.trim());
        const pagesToExtract: number[] = [];

        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map((n) => parseInt(n.trim()));
            for (let i = start; i <= end; i++) {
              if (i > 0 && i <= pageCount) {
                pagesToExtract.push(i - 1);
              }
            }
          } else {
            const page = parseInt(range);
            if (page > 0 && page <= pageCount) {
              pagesToExtract.push(page - 1);
            }
          }
        }

        const newPdf = await PDFDocument.create();
        const sourcePdf = await PDFDocument.load(pdfBytes);
        const pages = await newPdf.copyPages(sourcePdf, pagesToExtract);
        pages.forEach((page) => newPdf.addPage(page));

        const bytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        results.push({
          name: `${fileName.replace(/\.[^/.]+$/, '')}_extracted.pdf`,
          url,
        });
      } else if (splitMode === 'select' && selectedPages.length > 0) {
        const newPdf = await PDFDocument.create();
        const sourcePdf = await PDFDocument.load(pdfBytes);
        const pages = await newPdf.copyPages(sourcePdf, selectedPages.map((p) => p - 1));
        pages.forEach((page) => newPdf.addPage(page));

        const bytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        results.push({
          name: `${fileName.replace(/\.[^/.]+$/, '')}_selected.pdf`,
          url,
        });
      }

      setSplitResult(results);
    } catch {
      alert('Error splitting PDF');
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = async () => {
    for (const result of splitResult) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.name;
      link.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const clear = () => {
    setFileName('');
    setPageCount(0);
    setPdfBytes(null);
    setSplitResult([]);
    setSelectedPages([]);
    setPageRanges('');
  };

  return (
    <div className="space-y-6">
      {!splitResult.length ? (
        <div className="space-y-4">
          {/* Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Upload PDF File
            </button>
          </div>

          {/* Document Info */}
          {pageCount > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{fileName}</span> - {pageCount} pages
              </p>

              {/* Split Mode */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Split Mode</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSplitMode('all')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      splitMode === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Pages
                  </button>
                  <button
                    onClick={() => setSplitMode('range')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      splitMode === 'range'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    By Range
                  </button>
                  <button
                    onClick={() => setSplitMode('select')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      splitMode === 'select'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Select Pages
                  </button>
                </div>
              </div>

              {/* Range Input */}
              {splitMode === 'range' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Page Ranges</label>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="e.g., 1-3, 5, 7-9"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter page numbers or ranges separated by commas
                  </p>
                </div>
              )}

              {/* Page Selection */}
              {splitMode === 'select' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Select Pages ({selectedPages.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => togglePage(page)}
                        className={`w-10 h-10 text-sm rounded-md transition-colors ${
                          selectedPages.includes(page)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={split}
                disabled={loading || (splitMode === 'range' && !pageRanges) || (splitMode === 'select' && selectedPages.length === 0)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Splitting...' : 'Split PDF'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Split into <span className="font-medium">{splitResult.length}</span> file(s)
          </p>

          <div className="space-y-2">
            {splitResult.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{result.name}</span>
                <a
                  href={result.url}
                  download={result.name}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {splitResult.length > 1 && (
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Download All
              </button>
            )}
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
