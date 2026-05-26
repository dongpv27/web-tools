'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import JSZip from 'jszip';

type Status = 'pending' | 'processing' | 'done' | 'error';
type OutputFormat = 'png' | 'jpeg' | 'webp';
type ResizeMode = 'percent' | 'maxWidth' | 'maxHeight' | 'exact';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  status: Status;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  resizedBlob?: Blob;
  resizedUrl?: string;
  resizedWidth?: number;
  resizedHeight?: number;
  error?: string;
}

const EXT: Record<OutputFormat, string> = { png: 'png', jpeg: 'jpg', webp: 'webp' };
const MIME: Record<OutputFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

// Load an image from a File and resolve with its natural dimensions + a stable
// object URL preview (caller is responsible for revoking).
const loadImageMeta = (file: File): Promise<{ url: string; width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => resolve({ url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });

const targetDimensions = (
  originalW: number,
  originalH: number,
  mode: ResizeMode,
  value: { percent: number; maxWidth: number; maxHeight: number; width: number; height: number },
): { w: number; h: number } => {
  switch (mode) {
    case 'percent': {
      const p = Math.max(1, value.percent) / 100;
      return { w: Math.max(1, Math.round(originalW * p)), h: Math.max(1, Math.round(originalH * p)) };
    }
    case 'maxWidth': {
      if (originalW <= value.maxWidth) return { w: originalW, h: originalH };
      const scale = value.maxWidth / originalW;
      return { w: value.maxWidth, h: Math.max(1, Math.round(originalH * scale)) };
    }
    case 'maxHeight': {
      if (originalH <= value.maxHeight) return { w: originalW, h: originalH };
      const scale = value.maxHeight / originalH;
      return { w: Math.max(1, Math.round(originalW * scale)), h: value.maxHeight };
    }
    case 'exact':
      return { w: Math.max(1, value.width), h: Math.max(1, value.height) };
  }
};

const resizeOne = (
  file: File,
  w: number,
  h: number,
  format: OutputFormat,
  quality: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Canvas 2D context unavailable'));
      }
      if (format === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error('Resize produced no output'));
          resolve(blob);
        },
        MIME[format],
        format === 'png' ? undefined : quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image'));
    };
    img.src = url;
  });

export default function ImageResizeClient() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [mode, setMode] = useState<ResizeMode>('percent');
  const [percent, setPercent] = useState(50);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [exactW, setExactW] = useState(800);
  const [exactH, setExactH] = useState(600);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(0.92);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke all object URLs on unmount.
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        URL.revokeObjectURL(it.originalUrl);
        if (it.resizedUrl) URL.revokeObjectURL(it.resizedUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supportsQuality = format !== 'png';

  const doneCount = useMemo(() => items.filter((it) => it.status === 'done').length, [items]);

  const addFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    const loaded = await Promise.all(
      arr.map(async (file) => {
        try {
          const meta = await loadImageMeta(file);
          return {
            id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
            file,
            name: file.name,
            status: 'pending' as Status,
            originalUrl: meta.url,
            originalWidth: meta.width,
            originalHeight: meta.height,
          };
        } catch {
          return null;
        }
      }),
    );
    const valid = loaded.filter((x): x is ImageItem => x !== null);
    setItems((prev) => [...prev, ...valid]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) {
        URL.revokeObjectURL(target.originalUrl);
        if (target.resizedUrl) URL.revokeObjectURL(target.resizedUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((it) => {
      URL.revokeObjectURL(it.originalUrl);
      if (it.resizedUrl) URL.revokeObjectURL(it.resizedUrl);
    });
    setItems([]);
  };

  const resizeAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    for (const it of items) {
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: 'processing' } : x)));
      try {
        const { w, h } = targetDimensions(it.originalWidth, it.originalHeight, mode, {
          percent,
          maxWidth,
          maxHeight,
          width: exactW,
          height: exactH,
        });
        const blob = await resizeOne(it.file, w, h, format, quality);
        const url = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((x) =>
            x.id === it.id
              ? {
                  ...x,
                  status: 'done',
                  resizedBlob: blob,
                  resizedUrl: url,
                  resizedWidth: w,
                  resizedHeight: h,
                  error: undefined,
                }
              : x,
          ),
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((x) =>
            x.id === it.id ? { ...x, status: 'error', error: (err as Error).message } : x,
          ),
        );
      }
    }
    setIsProcessing(false);
  };

  const downloadOne = (it: ImageItem) => {
    if (!it.resizedBlob || !it.resizedUrl) return;
    const base = it.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = it.resizedUrl;
    link.download = `${base}-resized.${EXT[format]}`;
    link.click();
  };

  const downloadAllZip = async () => {
    const done = items.filter((it) => it.resizedBlob);
    if (done.length === 0) return;
    const zip = new JSZip();
    done.forEach((it) => {
      const base = it.name.replace(/\.[^/.]+$/, '');
      zip.file(`${base}-resized.${EXT[format]}`, it.resizedBlob!);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resized-images.zip';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Images
        </button>
        <p className="text-sm text-gray-500 mt-2">
          or drag and drop — select multiple files for batch resizing
        </p>
      </div>

      {/* Mode + dimension inputs */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Resize mode:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ResizeMode)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="percent">Scale by percentage</option>
              <option value="maxWidth">Fit within max width</option>
              <option value="maxHeight">Fit within max height</option>
              <option value="exact">Exact dimensions (may distort)</option>
            </select>
          </div>

          {mode === 'percent' && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 min-w-[80px]">Scale:</label>
              <input
                type="range"
                min={1}
                max={200}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="flex-1 max-w-md h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-mono w-16 text-right">{percent}%</span>
            </div>
          )}
          {mode === 'maxWidth' && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 min-w-[80px]">Max width:</label>
              <input
                type="number"
                min={1}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Math.max(1, Number(e.target.value) || 1))}
                className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">px (height auto, keeps aspect ratio)</span>
            </div>
          )}
          {mode === 'maxHeight' && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 min-w-[80px]">Max height:</label>
              <input
                type="number"
                min={1}
                value={maxHeight}
                onChange={(e) => setMaxHeight(Math.max(1, Number(e.target.value) || 1))}
                className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">px (width auto, keeps aspect ratio)</span>
            </div>
          )}
          {mode === 'exact' && (
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-gray-600 min-w-[80px]">Width × Height:</label>
              <input
                type="number"
                min={1}
                value={exactW}
                onChange={(e) => setExactW(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">×</span>
              <input
                type="number"
                min={1}
                value={exactH}
                onChange={(e) => setExactH(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          )}

          {/* Format + quality */}
          <div className="flex flex-wrap items-end gap-4 pt-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Output format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="png">PNG (lossless)</option>
                <option value="jpeg">JPEG (smaller)</option>
                <option value="webp">WebP (best ratio)</option>
              </select>
            </div>
            {supportsQuality && (
              <div className="min-w-[200px]">
                <label className="block text-sm text-gray-600 mb-1">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={Math.round(quality * 100)}
                  onChange={(e) => setQuality(Number(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resizeAll}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Resizing…' : `Resize ${items.length} image${items.length > 1 ? 's' : ''}`}
          </button>
          {doneCount > 1 && (
            <button
              onClick={downloadAllZip}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download all as ZIP ({doneCount})
            </button>
          )}
          <button
            onClick={clearAll}
            disabled={isProcessing}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Item list */}
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              <img
                src={it.originalUrl}
                alt={it.name}
                className="w-14 h-14 object-cover rounded border border-gray-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate" title={it.name}>
                  {it.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {it.originalWidth} × {it.originalHeight}
                  {it.resizedWidth !== undefined && (
                    <>
                      {' → '}
                      <span className="text-green-700 font-medium">
                        {it.resizedWidth} × {it.resizedHeight}
                      </span>
                    </>
                  )}
                </div>
                {it.status === 'processing' && (
                  <div className="text-xs text-gray-500 mt-0.5">Resizing…</div>
                )}
                {it.status === 'error' && (
                  <div className="text-xs text-red-600 mt-0.5">{it.error}</div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {it.status === 'done' && (
                  <button
                    onClick={() => downloadOne(it)}
                    className="px-2.5 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Download
                  </button>
                )}
                <button
                  onClick={() => removeItem(it.id)}
                  disabled={isProcessing}
                  className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
