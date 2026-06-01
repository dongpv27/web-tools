'use client';

import { useState, useRef } from 'react';
import { lanczosResample } from '@/lib/lanczos';

type Scale = 2 | 3 | 4;

export default function ImageUpscalerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [scale, setScale] = useState<Scale>(2);
  const [outFormat, setOutFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [jpgQuality, setJpgQuality] = useState(95);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [srcSize, setSrcSize] = useState<{ w: number; h: number } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image.'); return; }
    if (f.size > 30 * 1024 * 1024) { setError('Image too large (max 30 MB).'); return; }
    setError('');
    setFile(f);
    setResultUrl('');
    setPreviewUrl(URL.createObjectURL(f));
    // Capture intrinsic dimensions for the size estimate.
    const img = new Image();
    img.onload = () => setSrcSize({ w: img.width, h: img.height });
    img.src = URL.createObjectURL(f);
  };

  const run = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setError('');
    setResultUrl('');
    try {
      // Decode → canvas → ImageData
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D unavailable');
      ctx.drawImage(bitmap, 0, 0);
      const src = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

      const dstW = bitmap.width * scale;
      const dstH = bitmap.height * scale;
      // Guardrail: 8000 px²-side cap to avoid OOM on phones.
      if (dstW > 8000 || dstH > 8000) {
        throw new Error(`Output exceeds 8000 px (${dstW}×${dstH}). Pick a smaller scale or downscale source first.`);
      }

      // Run on next animation frame so the UI can paint the "starting" state.
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const upscaled = lanczosResample(src, dstW, dstH, (r) => setProgress(Math.round(r * 100)));

      const outCanvas = document.createElement('canvas');
      outCanvas.width = dstW; outCanvas.height = dstH;
      const outCtx = outCanvas.getContext('2d');
      if (!outCtx) throw new Error('Canvas 2D unavailable');
      outCtx.putImageData(upscaled, 0, 0);

      const mime = outFormat === 'png' ? 'image/png' : outFormat === 'jpg' ? 'image/jpeg' : 'image/webp';
      const quality = outFormat === 'png' ? undefined : jpgQuality / 100;
      const blob: Blob = await new Promise((resolve, reject) => {
        outCanvas.toBlob((b) => b ? resolve(b) : reject(new Error('Encode failed')), mime, quality);
      });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(`Upscale failed: ${(e as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + `-${scale}x.` + outFormat;
    a.click();
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
        <p className="text-xs text-gray-500 mt-2">PNG / JPG / WebP up to 30 MB · Lanczos-3 sharp resampling.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scale</label>
          <div className="flex gap-2">
            {([2, 3, 4] as Scale[]).map((s) => (
              <button key={s} onClick={() => setScale(s)}
                className={`flex-1 px-3 py-1.5 text-sm rounded-md ${scale === s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {s}×
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output format</label>
          <select value={outFormat} onChange={(e) => setOutFormat(e.target.value as 'png' | 'jpg' | 'webp')}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            <option value="png">PNG (lossless)</option>
            <option value="jpg">JPG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        {outFormat !== 'png' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality: {jpgQuality}</label>
            <input type="range" min="50" max="100" value={jpgQuality} onChange={(e) => setJpgQuality(parseInt(e.target.value))} className="w-full" />
          </div>
        )}
      </div>

      {srcSize && (
        <p className="text-sm text-gray-600">
          Source: <span className="font-medium">{srcSize.w}×{srcSize.h}</span> →
          Output: <span className="font-medium">{srcSize.w * scale}×{srcSize.h * scale}</span>
        </p>
      )}

      {processing && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Upscaling…</span><span>{progress}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
        </div>
      )}

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
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium">Upscaled ({scale}×)</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="upscaled" className="w-full h-72 object-contain bg-gray-100" />
            </div>
          )}
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={run} disabled={!file || processing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {processing ? 'Upscaling…' : `Upscale ${scale}×`}
        </button>
        {resultUrl && (
          <button onClick={download} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Download
          </button>
        )}
      </div>
    </div>
  );
}
