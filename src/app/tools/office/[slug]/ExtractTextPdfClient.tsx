'use client';

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ExtractTextPdfClient() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setExtractedText('');
    setLoading(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ');

        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setExtractedText(fullText.trim());
    } catch {
      alert('Error extracting text from PDF. Note: This tool works with text-based PDFs, not scanned images.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      alert('Copied to clipboard!');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = extractedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
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
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!extractedText && !loading ? (
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
          <p className="text-sm text-gray-500 mt-2">Extract text from text-based PDFs</p>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Extracting text... {progress}%</p>
          <p className="text-xs text-gray-400">Processing page {Math.ceil(progress / 100 * pageCount)} of {pageCount}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats */}
          <p className="text-sm text-gray-600">
            Extracted <span className="font-medium">{extractedText.length.toLocaleString()}</span> characters from <span className="font-medium">{pageCount}</span> pages in <span className="font-medium">{fileName}</span>
          </p>

          {/* Text Output */}
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

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={downloadText}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download as TXT
            </button>
            <button
              onClick={copyText}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Copy to Clipboard
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
