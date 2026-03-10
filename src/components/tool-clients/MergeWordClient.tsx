'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

interface WordFile {
  name: string;
  content: string;
}

export default function MergeWordClient() {
  const [files, setFiles] = useState<WordFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setMerging(true);

    try {
      const newFiles: WordFile[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const zip = await JSZip.loadAsync(file);
        const documentXml = zip.file('word/document.xml');

        if (documentXml) {
          const content = await documentXml.async('text');
          newFiles.push({
            name: file.name,
            content: content,
          });
        }
      }

      setFiles(prev => [...prev, ...newFiles]);
    } catch {
      alert('Error reading files. Please make sure they are valid .docx files.');
    } finally {
      setMerging(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const merge = async () => {
    if (files.length < 2) {
      alert('Please add at least 2 files to merge');
      return;
    }

    setMerging(true);

    try {
      // Create a new document by combining the XML content
      const zip = new JSZip();

      // Use the first file as a template
      const firstFile = await JSZip.loadAsync(
        await fetch(URL.createObjectURL(new Blob([files[0].content]))).then(r => r.blob())
      );

      // Copy all files from first document except document.xml
      const documentFiles: string[] = [];
      firstFile.forEach((path, file) => {
        if (!file.dir && path !== 'word/document.xml') {
          documentFiles.push(path);
        }
      });

      // Combine all paragraphs from all documents
      let combinedParagraphs = '';
      for (const file of files) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(file.content, 'text/xml');
        const body = xmlDoc.getElementsByTagName('w:body')[0];
        if (body) {
          const paragraphs = body.getElementsByTagName('w:p');
          for (let i = 0; i < paragraphs.length; i++) {
            combinedParagraphs += paragraphs[i].outerHTML;
          }
        }
        // Add a page break between documents
        combinedParagraphs += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
      }

      // Create modified document.xml
      const modifiedContent = files[0].content.replace(
        /<w:body>[\s\S]*<\/w:body>/,
        `<w:body>${combinedParagraphs}</w:body>`
      );

      // Add files to zip
      for (const path of documentFiles) {
        const file = firstFile.file(path);
        if (file) {
          const content = await file.async('blob');
          zip.file(path, content);
        }
      }

      zip.file('word/document.xml', modifiedContent);

      // Generate the merged file
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error merging documents. Please try again.');
    } finally {
      setMerging(false);
    }
  };

  const download = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'merged-document.docx';
    link.click();
  };

  const clear = () => {
    setFiles([]);
    setDownloadUrl(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={merging}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Add Word Files
        </button>
        <p className="text-sm text-gray-500 mt-2">Select multiple .docx files to merge</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Files to merge ({files.length})</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700 truncate flex-1">
                {index + 1}. {file.name}
              </span>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => moveFile(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveFile(index, 'down')}
                  disabled={index === files.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Download Result */}
      {downloadUrl && (
        <div className="bg-green-50 p-4 rounded-lg space-y-3">
          <p className="text-sm text-green-700">Documents merged successfully!</p>
          <button
            onClick={download}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Merged Document
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={merge}
          disabled={files.length < 2 || merging}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {merging ? 'Merging...' : 'Merge Documents'}
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
