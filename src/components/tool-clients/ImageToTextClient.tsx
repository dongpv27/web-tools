'use client';

import { useState, useRef } from 'react';
import { ocrImage, type OcrLang, type OcrProgress } from '@/lib/ocr';

export default function ImageToTextClient() {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [lang, setLang] = useState<OcrLang>('eng');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (file: File) => {
    setFileName(file.name);
    setText('');
    setProgress(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFiles(f);
  };

  const runOcr = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);
    setProgress(null);
    try {
      const result = await ocrImage(file, lang, (p) => setProgress(p));
      setText(result.trim());
    } catch (err) {
      alert(`OCR failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadText = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, '')}_ocr.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setText('');
    setFileName('');
    setPreviewUrl('');
    setProgress(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <label className="text-sm font-medium text-gray-700">OCR language:</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as OcrLang)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="eng">English</option>
          <option value="vie">Vietnamese</option>
          <option value="eng+vie">English + Vietnamese</option>
          <option value="chi_sim">Chinese (Simplified)</option>
          <option value="jpn">Japanese</option>
          <option value="kor">Korean</option>
          <option value="fra">French</option>
          <option value="spa">Spanish</option>
          <option value="deu">German</option>
          <option value="rus">Russian</option>
        </select>
        <span className="text-xs text-gray-500">First use of a language downloads ~5-15 MB of training data.</span>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFiles(f);
        }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Image
        </button>
        <p className="text-sm text-gray-500 mt-2">PNG, JPG, WebP, BMP — runs locally in your browser.</p>
      </div>

      {previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-700">
              Source: {fileName}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="preview" className="w-full h-64 object-contain bg-gray-100" />
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-700">
              Extracted text
            </div>
            <textarea
              value={text}
              readOnly
              placeholder={loading ? 'Running OCR…' : 'Click "Run OCR" to start'}
              className="flex-1 h-64 p-4 text-sm font-mono resize-none focus:outline-none"
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {progress?.status ?? 'Initialising…'} — {Math.round((progress?.progress ?? 0) * 100)}%
          </p>
          <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((progress?.progress ?? 0) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={runOcr}
          disabled={!fileName || loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Running OCR…' : 'Run OCR'}
        </button>
        {text && (
          <>
            <button
              onClick={downloadText}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download .txt
            </button>
            <button
              onClick={copyText}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                copied ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </>
        )}
        {fileName && (
          <button
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
