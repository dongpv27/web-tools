'use client';

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { pdfjsLoadOptions } from '@/lib/pdfjs-options';
import { ocrImage, pageLooksScanned, type OcrLang } from '@/lib/ocr';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

type Mode = 'auto' | 'text' | 'ocr';

export default function ExtractTextPdfClient() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('auto');
  const [ocrLang, setOcrLang] = useState<OcrLang>('eng');
  const [ocrPagesCount, setOcrPagesCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderPageToCanvas = async (page: pdfjsLib.PDFPageProxy, scale = 2): Promise<HTMLCanvasElement> => {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    return canvas;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setExtractedText('');
    setOcrPagesCount(0);
    setLoading(true);
    setProgress(0);
    setProgressLabel('Loading PDF…');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, ...pdfjsLoadOptions }).promise;
      setPageCount(pdf.numPages);

      let fullText = '';
      let ocrCount = 0;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        let pageText = '';
        let usedOcr = false;

        if (mode !== 'ocr') {
          const textContent = await page.getTextContent();
          pageText = textContent.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ')
            .trim();
        }

        const needsOcr =
          mode === 'ocr' || (mode === 'auto' && pageLooksScanned(pageText.length));

        if (needsOcr) {
          setProgressLabel(`OCR page ${i}/${pdf.numPages} (${ocrLang})…`);
          const canvas = await renderPageToCanvas(page, 2);
          pageText = (await ocrImage(canvas, ocrLang)).text.trim();
          usedOcr = true;
          ocrCount++;
          setOcrPagesCount(ocrCount);
        } else {
          setProgressLabel(`Reading page ${i}/${pdf.numPages}…`);
        }

        fullText += `--- Page ${i}${usedOcr ? ' (OCR)' : ''} ---\n${pageText}\n\n`;
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setExtractedText(fullText.trim());
      setProgressLabel('');
    } catch (err) {
      alert(`Error extracting text: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = extractedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadText = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setExtractedText('');
    setFileName('');
    setPageCount(0);
    setProgress(0);
    setOcrPagesCount(0);
  };

  return (
    <div className="space-y-6">
      {!extractedText && !loading ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Mode:</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">Auto (text + OCR fallback)</option>
                <option value="text">Text only (fast)</option>
                <option value="ocr">OCR every page (slow, for scans)</option>
              </select>
            </div>
            {mode !== 'text' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">OCR language:</label>
                <select
                  value={ocrLang}
                  onChange={(e) => setOcrLang(e.target.value as OcrLang)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="eng">English</option>
                  <option value="vie">Vietnamese</option>
                  <option value="eng+vie">English + Vietnamese</option>
                  <option value="chi_sim">Chinese (Simplified)</option>
                  <option value="jpn">Japanese</option>
                  <option value="kor">Korean</option>
                  <option value="fra">French</option>
                  <option value="spa">Spanish</option>
                  <option value="deu">German</option>
                  <option value="rus">Russian</option>
                </select>
              </div>
            )}
          </div>

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
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload PDF File
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Works on text-based and scanned PDFs (OCR for scans)
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">{progressLabel || `Processing… ${progress}%`}</p>
          <p className="text-xs text-gray-400 mt-1">
            {progress}% • Page {Math.max(1, Math.ceil(progress / 100 * pageCount))} of {pageCount}
            {ocrPagesCount > 0 && ` • ${ocrPagesCount} OCR'd`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Extracted <span className="font-medium">{extractedText.length.toLocaleString()}</span> characters from{' '}
            <span className="font-medium">{pageCount}</span> pages in <span className="font-medium">{fileName}</span>
            {ocrPagesCount > 0 && (
              <> · <span className="font-medium text-amber-700">{ocrPagesCount} page(s) via OCR</span></>
            )}
          </p>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Extracted Text</span>
            </div>
            <textarea
              value={extractedText}
              readOnly
              className="w-full h-80 p-4 text-sm resize-none focus:outline-none font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadText}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download as TXT
            </button>
            <button
              onClick={copyText}
              className={`px-4 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors duration-700 ${
                copied ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
