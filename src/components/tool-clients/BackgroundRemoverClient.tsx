'use client';

import { useState, useRef } from 'react';

export default function BackgroundRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image (PNG, JPG, WebP).'); return; }
    if (f.size > 30 * 1024 * 1024) { setError('Image too large (max 30 MB).'); return; }
    setError('');
    setFile(f);
    setResultUrl('');
    setPreviewUrl(URL.createObjectURL(f));
  };

  const run = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setProgressLabel('Loading model…');
    setError('');
    try {
      // Dynamic import keeps the ~50 MB ONNX runtime + model fetch out of the
      // initial bundle and only loads on tool use.
      const { removeBackground } = await import('@imgly/background-removal');
      const blob: Blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          const ratio = total > 0 ? current / total : 0;
          setProgress(Math.round(ratio * 100));
          setProgressLabel(key);
        },
      });
      setResultUrl(URL.createObjectURL(blob));
      setProgressLabel('Done');
    } catch (e) {
      setError(`Background removal failed: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + '-nobg.png';
    a.click();
  };

  const clear = () => {
    setFile(null); setPreviewUrl(''); setResultUrl(''); setProgress(0); setProgressLabel(''); setError('');
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        <button onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Upload Image
        </button>
        <p className="text-xs text-gray-500 mt-2">PNG / JPG / WebP up to 30 MB · 100% local, nothing uploaded.</p>
        <p className="text-xs text-amber-700 mt-1">First use downloads a ~80 MB AI model (cached afterwards).</p>
      </div>

      {(previewUrl || resultUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previewUrl && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium">Original</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="original" className="w-full h-72 object-contain bg-gray-100" />
            </div>
          )}
          {resultUrl && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium">Background removed</div>
              {/* Checkered transparent indicator background */}
              <div className="h-72 flex items-center justify-center"
                style={{ backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="no-bg" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          )}
        </div>
      )}

      {processing && (() => {
        // The @imgly library reports stages via `progressLabel`. Translate
        // its internal keys into something human-readable so the user knows
        // what's happening (especially during the long first-run model
        // download where progress can sit at 0% for a while).
        const isFetching = progressLabel.startsWith('fetch:');
        const isComputing = progressLabel.startsWith('compute:') || progressLabel.includes('inference');
        const friendlyLabel = isFetching
          ? 'Downloading AI model from CDN…'
          : isComputing
            ? 'Running AI inference on image…'
            : progressLabel || 'Initialising…';
        return (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between text-sm text-blue-800 mb-1">
              <span>{friendlyLabel}</span>
              {progress > 0 && <span>{progress}%</span>}
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              {/* Pulse animation when we have no real progress signal, so the
                  user sees the page is still alive instead of frozen at 0%. */}
              <div
                className={`h-2 rounded-full ${progress > 0 ? 'bg-blue-600 transition-all' : 'bg-blue-400 animate-pulse'}`}
                style={{ width: progress > 0 ? `${progress}%` : '100%' }}
              />
            </div>
            {isFetching && (
              <p className="text-xs text-amber-700 mt-2">
                ⏳ First-time setup: an ~80 MB AI model (ISNet FP16) is downloading from CDN. This typically takes 30-90 seconds on a fast connection, longer on slower networks. The model is cached afterwards — subsequent runs start in 1-3 seconds.
              </p>
            )}
            {isComputing && (
              <p className="text-xs text-blue-700 mt-2">
                Processing locally in your browser via WebAssembly. Higher-resolution images take longer (typically 2-8 seconds for 1080p, 10-30 seconds for 4K).
              </p>
            )}
          </div>
        );
      })()}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={run} disabled={!file || processing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {processing ? 'Removing background…' : 'Remove Background'}
        </button>
        {resultUrl && (
          <button onClick={download} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Download PNG (transparent)
          </button>
        )}
        {(file || resultUrl) && (
          <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
