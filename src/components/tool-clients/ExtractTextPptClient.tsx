'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function ExtractTextPptClient() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [slideCount, setSlideCount] = useState<number>(0);
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
      const zip = await JSZip.loadAsync(file);

      // Get all slide files
      const slidesFolder = zip.folder('ppt/slides');
      if (!slidesFolder) {
        alert('Invalid PowerPoint file. Could not find slides folder.');
        setLoading(false);
        return;
      }

      const slideFiles = Object.keys(slidesFolder.files)
        .filter(f => f.endsWith('.xml') && !f.includes('_rels'))
        .sort((a, b) => {
          const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
          const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
          return numA - numB;
        });

      setSlideCount(slideFiles.length);

      let fullText = '';

      for (let i = 0; i < slideFiles.length; i++) {
        const slideFile = slidesFolder.files[slideFiles[i]];
        const content = await slideFile.async('text');

        // Parse XML and extract text
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');

        // Get all text nodes
        const textNodes = xmlDoc.getElementsByTagName('a:t');
        let slideText = '';
        for (let j = 0; j < textNodes.length; j++) {
          const text = textNodes[j].textContent || '';
          if (text.trim()) {
            slideText += text + ' ';
          }
        }

        fullText += `--- Slide ${i + 1} ---\n${slideText.trim()}\n\n`;
        setProgress(Math.round(((i + 1) / slideFiles.length) * 100));
      }

      setExtractedText(fullText.trim());
    } catch {
      alert('Error extracting text from PowerPoint. Please make sure it\'s a valid .pptx file.');
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
    setSlideCount(0);
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
            accept=".pptx"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload PowerPoint File
          </button>
          <p className="text-sm text-gray-500 mt-2">Extract text from .pptx files</p>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Extracting text... {progress}%</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats */}
          <p className="text-sm text-gray-600">
            Extracted <span className="font-medium">{extractedText.length.toLocaleString()}</span> characters from <span className="font-medium">{slideCount}</span> slides in <span className="font-medium">{fileName}</span>
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
