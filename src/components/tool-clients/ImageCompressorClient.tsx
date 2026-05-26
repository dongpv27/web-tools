'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import JSZip from 'jszip';

type Status = 'pending' | 'processing' | 'done' | 'error';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  status: Status;
  previewUrl: string;
  compressedBlob?: Blob;
  compressedSize?: number;
  compressedUrl?: string;
  error?: string;
}

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

const FORMAT_LABEL: Record<OutputFormat, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'image/avif': 'AVIF',
};

const EXT: Record<OutputFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

// Probe the browser for AVIF encode support — Safari < 16 and older Chromium
// will silently fall back to PNG when asked for AVIF, which would surprise
// users. Hide the option when unsupported.
const detectAvifSupport = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/avif', 0.5),
    );
    return !!blob && blob.type === 'image/avif';
  } catch {
    return false;
  }
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const compressOne = (file: File, format: OutputFormat, quality: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas 2D context unavailable'));
        // JPEG has no alpha — pre-fill white so transparent pixels don't go black.
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression produced no output'));
            // Safety check — if the browser fell back to a different format
            // (e.g. AVIF on Safari), surface that so the user isn't misled.
            if (blob.type && blob.type !== format) {
              return reject(new Error(`Browser fell back to ${blob.type}`));
            }
            resolve(blob);
          },
          format,
          format === 'image/png' ? undefined : quality / 100,
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function ImageCompressorClient() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [avifSupported, setAvifSupported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    detectAvifSupport().then(setAvifSupported);
  }, []);

  // Clean up object URLs on unmount or when items change to avoid leaks.
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        URL.revokeObjectURL(it.previewUrl);
        if (it.compressedUrl) URL.revokeObjectURL(it.compressedUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalOriginal = useMemo(
     () => items.reduce((a, b) => a + b.originalSize, 0),
     [items],
  );
  const totalCompressed = useMemo(
     () => items.reduce((a, b) => a + (b.compressedSize ?? 0), 0),
     [items],
  );
  const reduction = totalOriginal > 0 && totalCompressed > 0
    ? ((totalOriginal - totalCompressed) / totalOriginal) * 100
    : 0;
  const doneCount = items.filter((it) => it.status === 'done').length;

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    const newItems: ImageItem[] = arr.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      originalSize: file.size,
      status: 'pending',
      previewUrl: URL.createObjectURL(file),
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((it) => {
      URL.revokeObjectURL(it.previewUrl);
      if (it.compressedUrl) URL.revokeObjectURL(it.compressedUrl);
    });
    setItems([]);
  };

  const compressAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    // Process serially so the browser doesn't OOM on large batches.
    for (const it of items) {
      if (it.status === 'done') continue;
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: 'processing' } : x)));
      try {
        const blob = await compressOne(it.file, format, quality);
        const url = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((x) =>
            x.id === it.id
              ? {
                  ...x,
                  status: 'done',
                  compressedBlob: blob,
                  compressedSize: blob.size,
                  compressedUrl: url,
                  error: undefined,
                }
              : x,
          ),
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((x) =>
            x.id === it.id
              ? { ...x, status: 'error', error: (err as Error).message }
              : x,
          ),
        );
      }
    }
    setIsProcessing(false);
  };

  const downloadOne = (it: ImageItem) => {
    if (!it.compressedBlob) return;
    const base = it.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = it.compressedUrl!;
    link.download = `${base}-compressed.${EXT[format]}`;
    link.click();
  };

  const downloadAllZip = async () => {
    const done = items.filter((it) => it.compressedBlob);
    if (done.length === 0) return;
    const zip = new JSZip();
    done.forEach((it) => {
      const base = it.name.replace(/\.[^/.]+$/, '');
      zip.file(`${base}-compressed.${EXT[format]}`, it.compressedBlob!);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed-images.zip`;
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
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          accept="image/*"
          multiple
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Images
        </button>
        <p className="text-sm text-gray-500 mt-2">
          or drag and drop — select multiple files for batch compression
        </p>
      </div>

      {/* Options */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality: {quality}% {format === 'image/png' && <span className="text-xs text-gray-500">(PNG ignores quality)</span>}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
              disabled={format === 'image/png'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="image/jpeg">JPEG (smallest, no transparency)</option>
              <option value="image/png">PNG (lossless)</option>
              <option value="image/webp">WebP (best ratio, modern)</option>
              {avifSupported && <option value="image/avif">AVIF (smallest, newest)</option>}
            </select>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={compressAll}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Compressing…' : `Compress ${items.length} image${items.length > 1 ? 's' : ''}`}
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

      {/* Totals */}
      {doneCount > 0 && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">Total original</div>
            <div className="text-base font-semibold">{formatBytes(totalOriginal)}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600">Total compressed</div>
            <div className="text-base font-semibold text-green-700">{formatBytes(totalCompressed)}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-gray-600">Reduction</div>
            <div className="text-base font-semibold text-blue-700">{reduction.toFixed(1)}%</div>
          </div>
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
                src={it.previewUrl}
                alt={it.name}
                className="w-14 h-14 object-cover rounded border border-gray-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate" title={it.name}>
                  {it.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {formatBytes(it.originalSize)}
                  {it.compressedSize !== undefined && (
                    <>
                      {' → '}
                      <span className="text-green-700 font-medium">
                        {formatBytes(it.compressedSize)}
                      </span>
                      {' '}
                      <span className="text-blue-700">
                        ({(((it.originalSize - it.compressedSize) / it.originalSize) * 100).toFixed(1)}%)
                      </span>
                    </>
                  )}
                </div>
                {it.status === 'processing' && (
                  <div className="text-xs text-gray-500 mt-0.5">Compressing…</div>
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
