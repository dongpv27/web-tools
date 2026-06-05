'use client';

import { useState, useRef } from 'react';
import { ocrImage, type OcrLang, type OcrProgress } from '@/lib/ocr';

export default function ImageToTextClient() {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [lang, setLang] = useState<OcrLang>('auto');
  const [detectedInfo, setDetectedInfo] = useState<{ lang: OcrLang; script: string } | null>(null);
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
    setDetectedInfo(null);
    try {
      const result = await ocrImage(file, lang, (p) => setProgress(p));
      setText(result.text.trim());
      if (result.detectedLang && result.detectedScript) {
        setDetectedInfo({ lang: result.detectedLang, script: result.detectedScript });
      }
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
    setDetectedInfo(null);
  };

  return (
    <div className="space-y-6">
      {/* Prominent guidance — accuracy is meaningfully better when the user
          picks the exact language vs. relying on multi-language auto mode. */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z" />
          </svg>
          <div className="text-sm">
            <p className="font-semibold text-amber-900">Tip: pick the exact language for best accuracy</p>
            <p className="text-amber-800 mt-0.5">
              <strong>Auto-detect</strong> loads 5 languages at once — convenient but accuracy is only ~75-85%.
              If you know the image contains <strong>Japanese / Chinese / Korean / Vietnamese</strong>, select that
              specific language below — accuracy jumps to <strong>90-95%</strong> and OCR runs ~3× faster.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <label className="text-sm font-medium text-gray-700">OCR language:</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as OcrLang)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto">Auto-detect (any language, lower accuracy)</option>
          <option value="eng">English (recommended for English images)</option>
          <option value="vie">Vietnamese (recommended for Vietnamese)</option>
          <option value="eng+vie">English + Vietnamese (mixed docs)</option>
          <option value="chi_sim">Chinese — Simplified (recommended for Chinese)</option>
          <option value="jpn">Japanese (recommended for Japanese)</option>
          <option value="kor">Korean (recommended for Korean)</option>
          <option value="fra">French</option>
          <option value="spa">Spanish</option>
          <option value="deu">German</option>
          <option value="rus">Russian</option>
        </select>
        <span className="text-xs text-gray-500">
          {lang === 'auto'
            ? '~13 MB download on first use · slower · lower accuracy'
            : 'First use of a language downloads ~5-15 MB of training data.'}
        </span>
      </div>

      {detectedInfo && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <strong>Note:</strong> OCR ran in Auto mode (combined model <code className="bg-blue-100 px-1 rounded">{detectedInfo.lang}</code>).
          If the result looks inaccurate, <strong>switch the language dropdown to the specific language</strong> in the image
          and click Run OCR again for noticeably better results.
        </div>
      )}

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
