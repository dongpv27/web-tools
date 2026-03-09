'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function WordWordCounterClient() {
  const [stats, setStats] = useState<{
    words: number;
    characters: number;
    charactersNoSpaces: number;
    paragraphs: number;
    sentences: number;
    readingTime: string;
  } | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [textPreview, setTextPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStats(null);
    setTextPreview('');

    try {
      const zip = await JSZip.loadAsync(file);

      // Find document.xml in the zip
      const documentXml = zip.file('word/document.xml');
      if (!documentXml) {
        alert('Invalid Word document. Could not find document.xml');
        return;
      }

      const content = await documentXml.async('text');

      // Extract text from XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');

      // Get all text nodes
      const textNodes = xmlDoc.getElementsByTagName('w:t');
      let fullText = '';
      for (let i = 0; i < textNodes.length; i++) {
        fullText += textNodes[i].textContent || '';
      }

      // Also get paragraph breaks
      const paragraphs = xmlDoc.getElementsByTagName('w:p');
      let paragraphCount = 0;
      for (let i = 0; i < paragraphs.length; i++) {
        const textInPara = paragraphs[i].textContent?.trim();
        if (textInPara && textInPara.length > 0) {
          paragraphCount++;
        }
      }

      // Calculate stats
      const words = fullText.trim().split(/\s+/).filter(w => w.length > 0).length;
      const characters = fullText.length;
      const charactersNoSpaces = fullText.replace(/\s/g, '').length;
      const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

      // Reading time (average 200 words per minute)
      const readingMinutes = Math.ceil(words / 200);
      const readingTime = readingMinutes < 1 ? 'Less than 1 minute' : `${readingMinutes} minute${readingMinutes > 1 ? 's' : ''}`;

      setStats({
        words,
        characters,
        charactersNoSpaces,
        paragraphs: paragraphCount,
        sentences,
        readingTime,
      });

      // Preview first 500 characters
      setTextPreview(fullText.substring(0, 500) + (fullText.length > 500 ? '...' : ''));

    } catch {
      alert('Error reading Word document. Please make sure it\'s a valid .docx file.');
    }
  };

  const clear = () => {
    setStats(null);
    setFileName('');
    setTextPreview('');
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!stats ? (
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
          <p className="text-sm text-gray-500 mt-2">Supports .docx files (Word 2007+)</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Name */}
          <p className="text-sm text-gray-600">
            File: <span className="font-medium">{fileName}</span>
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats.words.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Words</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats.characters.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Characters</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{stats.charactersNoSpaces.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Characters (no spaces)</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{stats.paragraphs.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Paragraphs</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-pink-600">{stats.sentences.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Sentences</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xl font-bold text-gray-700">{stats.readingTime}</p>
              <p className="text-sm text-gray-600">Reading Time</p>
            </div>
          </div>

          {/* Text Preview */}
          {textPreview && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Text Preview</span>
              </div>
              <div className="p-4 text-sm text-gray-600 max-h-32 overflow-y-auto">
                {textPreview}
              </div>
            </div>
          )}

          {/* Clear Button */}
          <button
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
