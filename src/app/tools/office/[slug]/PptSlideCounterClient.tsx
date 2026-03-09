'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function PptSlideCounterClient() {
  const [stats, setStats] = useState<{
    slides: number;
    fileName: string;
    fileSize: string;
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    modificationDate?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStats(null);

    try {
      const zip = await JSZip.loadAsync(file);

      // Count slides by looking at ppt/slides folder
      const slidesFolder = zip.folder('ppt/slides');
      let slideCount = 0;

      if (slidesFolder) {
        const files = Object.keys(slidesFolder.files);
        slideCount = files.filter(f => f.endsWith('.xml') && !f.includes('_rels')).length;
      }

      // Try to get metadata
      const coreXml = zip.file('docProps/core.xml');
      let metaData: Record<string, string> = {};

      if (coreXml) {
        const content = await coreXml.async('text');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');

        const extractValue = (tagName: string) => {
          const elements = xmlDoc.getElementsByTagName(tagName);
          const elementsWithNs = xmlDoc.getElementsByTagNameNS('*', tagName);
          if (elements.length > 0 && elements[0].textContent) {
            return elements[0].textContent;
          }
          if (elementsWithNs.length > 0 && elementsWithNs[0].textContent) {
            return elementsWithNs[0].textContent;
          }
          return null;
        };

        const title = extractValue('dc:title') || extractValue('title');
        const author = extractValue('dc:creator') || extractValue('creator') || extractValue('cp:lastModifiedBy');
        const subject = extractValue('dc:subject') || extractValue('subject');
        const creator = extractValue('cp:lastModifiedBy');
        const modified = extractValue('dcterms:modified') || extractValue('modified');

        if (title) metaData.title = title;
        if (author) metaData.author = author;
        if (subject) metaData.subject = subject;
        if (creator) metaData.creator = creator;
        if (modified) metaData.modificationDate = modified;
      }

      setStats({
        slides: slideCount,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        ...metaData
      });
    } catch {
      alert('Error reading PowerPoint file. Please make sure it\'s a valid .pptx file.');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setStats(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!stats ? (
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
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Reading File...' : 'Upload PowerPoint File'}
          </button>
          <p className="text-sm text-gray-500 mt-2">Supports .pptx files (PowerPoint 2007+)</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Stat */}
          <div className="bg-orange-50 p-6 rounded-lg text-center">
            <p className="text-5xl font-bold text-orange-600">{stats.slides}</p>
            <p className="text-lg text-gray-600 mt-2">Slide{stats.slides !== 1 ? 's' : ''}</p>
          </div>

          {/* File Info */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">File Information</span>
            </div>
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-2 flex justify-between">
                <dt className="text-sm text-gray-500">File Name</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.fileName}</dd>
              </div>
              <div className="px-4 py-2 flex justify-between">
                <dt className="text-sm text-gray-500">File Size</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.fileSize}</dd>
              </div>
              {stats.title && (
                <div className="px-4 py-2 flex justify-between">
                  <dt className="text-sm text-gray-500">Title</dt>
                  <dd className="text-sm font-medium text-gray-900">{stats.title}</dd>
                </div>
              )}
              {stats.author && (
                <div className="px-4 py-2 flex justify-between">
                  <dt className="text-sm text-gray-500">Author</dt>
                  <dd className="text-sm font-medium text-gray-900">{stats.author}</dd>
                </div>
              )}
              {stats.subject && (
                <div className="px-4 py-2 flex justify-between">
                  <dt className="text-sm text-gray-500">Subject</dt>
                  <dd className="text-sm font-medium text-gray-900">{stats.subject}</dd>
                </div>
              )}
              {stats.creator && (
                <div className="px-4 py-2 flex justify-between">
                  <dt className="text-sm text-gray-500">Last Modified By</dt>
                  <dd className="text-sm font-medium text-gray-900">{stats.creator}</dd>
                </div>
              )}
              {stats.modificationDate && (
                <div className="px-4 py-2 flex justify-between">
                  <dt className="text-sm text-gray-500">Modified</dt>
                  <dd className="text-sm font-medium text-gray-900">{stats.modificationDate}</dd>
                </div>
              )}
            </dl>
          </div>

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
