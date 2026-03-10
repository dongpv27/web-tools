'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function WordToPdfClient() {
  const [converting, setConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setPdfUrl(null);
    setError('');
  };

  const convert = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) return;

    setConverting(true);
    setError('');

    try {
      // Note: True Word to PDF conversion requires complex rendering
      // This is a simplified version that creates a PDF with extracted text
      const file = fileInput.files[0];
      const zip = await JSZip.loadAsync(file);

      const documentXml = zip.file('word/document.xml');
      if (!documentXml) {
        throw new Error('Invalid Word document');
      }

      const content = await documentXml.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');

      // Extract text
      const textNodes = xmlDoc.getElementsByTagName('w:t');
      let text = '';
      for (let i = 0; i < textNodes.length; i++) {
        text += textNodes[i].textContent || '';
      }

      // Create a simple HTML-based PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            p { margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1>Converted from Word</h1>
          <p>${text.split('\n').map(p => p.trim()).filter(p => p).join('</p><p>')}</p>
        </body>
        </html>
      `;

      // Create a blob with the content
      // Note: This is a simplified version. For true PDF, use a library like pdf-lib or jspdf
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setError('Note: This creates an HTML preview. For full PDF conversion, consider using a desktop application like LibreOffice.');
    } catch (err) {
      setError('Error converting file. Please try again.');
      console.error(err);
    } finally {
      setConverting(false);
    }
  };

  const download = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '.html';
    link.click();
  };

  const clear = () => {
    setPdfUrl(null);
    setFileName('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {!pdfUrl ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Word Document
            </button>
            <p className="text-sm text-gray-500 mt-2">Supports .docx files</p>
          </div>

          {fileName && (
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{fileName}</span>
            </p>
          )}

          {error && (
            <p className="text-sm text-amber-600">{error}</p>
          )}

          <button
            onClick={convert}
            disabled={!fileName || converting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {converting ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              Document converted successfully. Click below to download.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={download}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download
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
