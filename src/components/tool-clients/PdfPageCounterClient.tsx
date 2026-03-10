'use client';

import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfPageCounterClient() {
  const [pdfInfo, setPdfInfo] = useState<{
    pages: number;
    fileName: string;
    fileSize: string;
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateStr: string) => {
    try {
      // PDF date format: D:YYYYMMDDHHmmSS
      if (dateStr.startsWith('D:')) {
        const year = dateStr.substring(2, 6);
        const month = dateStr.substring(6, 8);
        const day = dateStr.substring(8, 10);
        const hour = dateStr.substring(10, 12) || '00';
        const minute = dateStr.substring(12, 14) || '00';
        const second = dateStr.substring(14, 16) || '00';
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        );
        return date.toLocaleString();
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setPdfInfo(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const metadata = await pdf.getMetadata();
      const info = metadata.info as Record<string, unknown>;

      setPdfInfo({
        pages: pdf.numPages,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        title: info?.Title ? String(info.Title) : undefined,
        author: info?.Author ? String(info.Author) : undefined,
        subject: info?.Subject ? String(info.Subject) : undefined,
        creator: info?.Creator ? String(info.Creator) : undefined,
        producer: info?.Producer ? String(info.Producer) : undefined,
        creationDate: info?.CreationDate ? formatDate(String(info.CreationDate)) : undefined,
        modificationDate: info?.ModDate ? formatDate(String(info.ModDate)) : undefined,
      });
    } catch {
      alert('Error reading PDF file. Please make sure it\'s a valid PDF.');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPdfInfo(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!pdfInfo ? (
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
            {loading ? 'Reading PDF...' : 'Upload PDF File'}
          </button>
          <p className="text-sm text-gray-500 mt-2">Upload a PDF to count pages</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Stat */}
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-5xl font-bold text-blue-600">{pdfInfo.pages}</p>
            <p className="text-lg text-gray-600 mt-2">Page{pdfInfo.pages !== 1 ? 's' : ''}</p>
          </div>

          {/* File Info */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">File Information</span>
            </div>
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-2 flex justify-between">
                <dt className="text-sm text-gray-500">File Name</dt>
                <dd className="text-sm font-medium text-gray-900">{pdfInfo.fileName}</dd>
              </div>
              <div className="px-4 py-2 flex justify-between">
                <dt className="text-sm text-gray-500">File Size</dt>
                <dd className="text-sm font-medium text-gray-900">{pdfInfo.fileSize}</dd>
              </div>
            </dl>
          </div>

          {/* Metadata */}
          {(pdfInfo.title || pdfInfo.author || pdfInfo.creator || pdfInfo.producer || pdfInfo.creationDate || pdfInfo.modificationDate) && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Document Metadata</span>
              </div>
              <dl className="divide-y divide-gray-100">
                {pdfInfo.title && (
                  <div className="px-4 py-2 flex justify-between">
                    <dt className="text-sm text-gray-500">Title</dt>
                    <dd className="text-sm font-medium text-gray-900">{pdfInfo.title}</dd>
                  </div>
                )}
                {pdfInfo.author && (
                  <div className="px-4 py-2 flex justify-between">
                    <dt className="text-sm text-gray-500">Author</dt>
                    <dd className="text-sm font-medium text-gray-900">{pdfInfo.author}</dd>
                  </div>
                )}
                {pdfInfo.subject && (
                  <div className="px-4 py-2 flex justify-between">
                    <dt className="text-sm text-gray-500">Subject</dt>
                    <dd className="text-sm font-medium text-gray-900">{pdfInfo.subject}</dd>
                  </div>
                )}
                {pdfInfo.creator && (
                  <div className="px-4 py-2 flex justify-between">
                    <dt className="text-sm text-gray-500">Creator</dt>
                    <dd className="text-sm font-medium text-gray-900">{pdfInfo.creator}</dd>
                  </div>
                )}
                {pdfInfo.producer && (
                  <div className="px-4 py-2 flex justify-between">
                    <dt className="text-sm text-gray-500">Producer</dt>
                    <dd className="text-sm font-medium text-gray-900">{pdfInfo.producer}</dd>
                  </div>
                )}
                {pdfInfo.creationDate && (
                  <div className="px-4 py-2 flex justify-between">
                    <dt className="text-sm text-gray-500">Created</dt>
                    <dd className="text-sm font-medium text-gray-900">{pdfInfo.creationDate}</dd>
                  </div>
                )}
                {pdfInfo.modificationDate && (
                  <div className="px-4 py-2 flex justify-between">
                    <dt className="text-sm text-gray-500">Modified</dt>
                    <dd className="text-sm font-medium text-gray-900">{pdfInfo.modificationDate}</dd>
                  </div>
                )}
              </dl>
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
