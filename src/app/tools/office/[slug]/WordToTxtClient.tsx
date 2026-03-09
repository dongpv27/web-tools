'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function WordToTxtClient() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setExtractedText('');
    setLoading(true);

    try {
      const zip = await JSZip.loadAsync(file);
      const documentXml = zip.file('word/document.xml');

      if (!documentXml) {
        alert('Invalid Word document. Could not find document.xml');
        setLoading(false);
        return;
      }

      const content = await documentXml.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');

      // Extract text with paragraph breaks
      const paragraphs = xmlDoc.getElementsByTagName('w:p');
      let fullText = '';

      for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        const textNodes = para.getElementsByTagName('w:t');
        let paraText = '';
        for (let j = 0; j < textNodes.length; j++) {
          paraText += textNodes[j].textContent || '';
        }
        if (paraText.trim()) {
          fullText += paraText + '\n\n';
        }
      }

      setExtractedText(fullText.trim());
    } catch {
      alert('Error reading Word document. Please make sure it\'s a valid .docx file.');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
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

  const clear = () => {
    setExtractedText('');
    setFileName('');
  };

  return (
    <div className="space-y-6">
      {!extractedText && !loading ? (
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
          <p className="text-sm text-gray-500 mt-2">Extract text from .docx files</p>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Extracting text...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Extracted <span className="font-medium">{extractedText.length.toLocaleString()}</span> characters from <span className="font-medium">{fileName}</span>
          </p>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Extracted Text</span>
            </div>
            <textarea
              value={extractedText}
              readOnly
              className="w-full h-80 p-4 text-sm resize-none focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={download}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download as TXT
            </button>
            <button
              onClick={copy}
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
