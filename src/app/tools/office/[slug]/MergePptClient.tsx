'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

interface PptFile {
  name: string;
  slides: string[];
}

export default function MergePptClient() {
  const [files, setFiles] = useState<PptFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setMerging(true);

    try {
      const newFiles: PptFile[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const zip = await JSZip.loadAsync(file);
        const slidesFolder = zip.folder('ppt/slides');

        const slides: string[] = [];
        if (slidesFolder) {
          const slideFiles = Object.keys(slidesFolder.files)
            .filter(f => f.endsWith('.xml') && !f.includes('_rels'))
            .sort((a, b) => {
              const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
              const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
              return numA - numB;
            });

          for (const slideFile of slideFiles) {
            const content = await slidesFolder.files[slideFile].async('text');
            slides.push(content);
          }
        }

        newFiles.push({
          name: file.name,
          slides,
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);
    } catch {
      alert('Error reading PowerPoint files');
    } finally {
      setMerging(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
      alert('Please add at least 2 PowerPoint files to merge');
      return;
    }

    setMerging(true);

    try {
      // This is a simplified merge - in a real implementation,
      // you would need to handle slide relationships, media, etc.
      const zip = new JSZip();

      // Create minimal PPTX structure
      let allSlides: string[] = [];
      files.forEach(file => {
        allSlides = [...allSlides, ...file.slides];
      });

      // Add slides
      allSlides.forEach((slide, index) => {
        zip.file(`ppt/slides/slide${index + 1}.xml`, slide);
      });

      // Add minimal required files
      zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${allSlides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('\n  ')}
</Types>`);

      zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

      zip.file('ppt/presentation.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldLst>
    ${allSlides.map((_, i) => `<p:sld r:id="rId${i + 1}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>`).join('\n    ')}
  </p:sldLst>
</p:presentation>`);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      alert('Error merging PowerPoint files. Note: Complex presentations may not merge correctly.');
    } finally {
      setMerging(false);
    }
  };

  const download = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'merged-presentation.pptx';
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
          accept=".pptx"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={merging}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Add PowerPoint Files
        </button>
        <p className="text-sm text-gray-500 mt-2">Select multiple .pptx files to merge</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Files to merge ({files.length})</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">({file.slides.length} slides)</span>
              </div>
              <div className="flex gap-1">
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
          <p className="text-sm text-green-700">
            Merged {files.length} presentations ({files.reduce((sum, f) => sum + f.slides.length, 0)} slides total)
          </p>
          <button
            onClick={download}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Merged PPT
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
          {merging ? 'Merging...' : 'Merge Presentations'}
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
