'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function SplitWordClient() {
  const [fileName, setFileName] = useState<string>('');
  const [paragraphCount, setParagraphCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'paragraphs' | 'pages'>('paragraphs');
  const [splitSize, setSplitSize] = useState<number>(10);
  const [splitResult, setSplitResult] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSplitResult([]);
    setLoading(true);

    try {
      const zip = await JSZip.loadAsync(file);
      const documentXml = zip.file('word/document.xml');

      if (!documentXml) {
        alert('Invalid Word document');
        setLoading(false);
        return;
      }

      const content = await documentXml.async('text');
      setDocumentContent(content);

      // Count paragraphs
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      const paragraphs = xmlDoc.getElementsByTagName('w:p');
      const nonEmptyParagraphs = Array.from(paragraphs).filter(
        p => p.textContent?.trim()
      );
      setParagraphCount(nonEmptyParagraphs.length);
    } catch {
      alert('Error reading Word document');
    } finally {
      setLoading(false);
    }
  };

  const split = async () => {
    if (!documentContent) return;

    setLoading(true);

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(documentContent, 'text/xml');
      const body = xmlDoc.getElementsByTagName('w:body')[0];
      const paragraphs = Array.from(body.getElementsByTagName('w:p')).filter(
        p => p.textContent?.trim()
      );

      const results: { name: string; url: string }[] = [];
      const chunks: typeof paragraphs[] = [];
      const chunkSize = splitMode === 'paragraphs' ? splitSize : splitSize * 5; // Approx 5 paragraphs per page

      for (let i = 0; i < paragraphs.length; i += chunkSize) {
        chunks.push(paragraphs.slice(i, i + chunkSize));
      }

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Create new document XML
        const newBody = xmlDoc.createElement('w:body');
        chunk.forEach(p => newBody.appendChild(p.cloneNode(true)));

        const newContent = documentContent.replace(
          /<w:body>[\s\S]*<\/w:body>/,
          new XMLSerializer().serializeToString(newBody)
        );

        // Create a minimal docx structure
        const zip = new JSZip();
        zip.file('word/document.xml', newContent);

        // Add minimal required files
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

        zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

        zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`);

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);

        results.push({
          name: `${fileName.replace(/\.[^/.]+$/, '')}_part${i + 1}.docx`,
          url,
        });
      }

      setSplitResult(results);
    } catch (err) {
      console.error(err);
      alert('Error splitting document');
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = async () => {
    for (const result of splitResult) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.name;
      link.click();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const clear = () => {
    setFileName('');
    setParagraphCount(0);
    setSplitResult([]);
    setDocumentContent('');
  };

  return (
    <div className="space-y-6">
      {!splitResult.length ? (
        <div className="space-y-4">
          {/* Upload */}
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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Upload Word Document
            </button>
          </div>

          {/* Document Info */}
          {paragraphCount > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{fileName}</span> - {paragraphCount} paragraphs
              </p>

              {/* Split Options */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Split Mode</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSplitMode('paragraphs')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        splitMode === 'paragraphs'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      By Paragraphs
                    </button>
                    <button
                      onClick={() => setSplitMode('pages')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        splitMode === 'pages'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      By Pages (approx)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {splitMode === 'paragraphs' ? 'Paragraphs per file' : 'Pages per file'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={splitSize}
                    onChange={(e) => setSplitSize(Number(e.target.value))}
                    className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <button
                onClick={split}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Splitting...' : 'Split Document'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Split into <span className="font-medium">{splitResult.length}</span> files
          </p>

          <div className="space-y-2">
            {splitResult.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{result.name}</span>
                <a
                  href={result.url}
                  download={result.name}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadAll}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download All
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
