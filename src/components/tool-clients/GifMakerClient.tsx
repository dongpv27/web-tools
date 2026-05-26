'use client';

import { useState, useRef, useEffect } from 'react';
import GIF from 'gif.js';

interface ImageFile {
  id: string;
  src: string;
  file: File;
}

const MAX_IMAGES = 50;
const MAX_DIMENSION = 1200; // px — cap output to avoid OOM on giant frames

export default function GifMakerClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [delay, setDelay] = useState(200);
  const [quality, setQuality] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.src));
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
    // Cleanup on unmount only — adding deps would revoke active URLs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError('No valid image files selected.');
      return;
    }
    setError('');
    const remaining = MAX_IMAGES - images.length;
    const accepted = imageFiles.slice(0, remaining);
    if (imageFiles.length > remaining) {
      setError(`Max ${MAX_IMAGES} frames — extra files ignored.`);
    }
    const newImages = accepted.map(file => ({
      id: Math.random().toString(36).slice(2, 11),
      src: URL.createObjectURL(file),
      file,
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.src);
      return prev.filter(i => i.id !== id);
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const createGif = async () => {
    if (images.length < 2) {
      setError('Add at least 2 images.');
      return;
    }
    setIsProcessing(true);
    setError('');
    setProgress(0);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl(null);

    try {
      const loadedImages = await Promise.all(
        images.map(
          img =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = () => reject(new Error(`Failed to load ${img.file.name}`));
              image.src = img.src;
            }),
        ),
      );

      // Output dimensions: use the largest frame, capped at MAX_DIMENSION to
      // keep encoder memory bounded. Smaller frames are centred on a canvas
      // matching the largest aspect.
      const rawW = Math.max(...loadedImages.map(i => i.width));
      const rawH = Math.max(...loadedImages.map(i => i.height));
      const scale = Math.min(1, MAX_DIMENSION / Math.max(rawW, rawH));
      const outW = Math.round(rawW * scale);
      const outH = Math.round(rawH * scale);

      const gif = new GIF({
        workers: 2,
        quality, // 1=best/slow, 30=fast/lossy. gif.js default is 10.
        width: outW,
        height: outH,
        workerScript: '/gif/gif.worker.js',
      });

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable.');

      for (const img of loadedImages) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outW, outH);
        // Letterbox each frame into the output canvas, preserving aspect.
        const r = Math.min(outW / img.width, outH / img.height);
        const dw = img.width * r;
        const dh = img.height * r;
        ctx.drawImage(img, (outW - dw) / 2, (outH - dh) / 2, dw, dh);
        gif.addFrame(ctx, { delay, copy: true });
      }

      gif.on('progress', (p: number) => setProgress(Math.round(p * 100)));
      gif.on('finished', (blob: Blob) => {
        setGifUrl(URL.createObjectURL(blob));
        setGifSize(blob.size);
        setIsProcessing(false);
      });
      gif.render();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GIF encoding failed.');
      setIsProcessing(false);
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = 'animation.gif';
    link.click();
  };

  const clear = () => {
    images.forEach(img => URL.revokeObjectURL(img.src));
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setImages([]);
    setGifUrl(null);
    setGifSize(0);
    setProgress(0);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
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
        <p className="text-sm text-gray-500 mt-2">or drag &amp; drop — max {MAX_IMAGES} frames</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Frame Delay: {delay}ms</label>
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={delay}
            onChange={e => setDelay(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: {quality} <span className="text-xs text-gray-400">(1 = best, 30 = fastest)</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frames ({images.length}) — use arrows to reorder
          </label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((img, index) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.src}
                  alt={`Frame ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-0 left-0 bg-black/50 text-white text-xs px-1 rounded-br">
                  {index + 1}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-white rounded text-xs disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 bg-white rounded text-xs disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1 bg-red-500 text-white rounded text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length >= 2 && !gifUrl && (
        <div className="flex gap-2">
          <button
            onClick={createGif}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isProcessing ? `Encoding... ${progress}%` : 'Create GIF'}
          </button>
          <button
            onClick={clear}
            disabled={isProcessing}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      )}

      {gifUrl && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
            <img src={gifUrl} alt="Generated GIF" className="max-w-full mx-auto rounded" />
            <p className="text-xs text-green-700 mt-2">
              GIF ready — {(gifSize / 1024).toFixed(1)} KB
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadGif}
              className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download GIF
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              New GIF
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Output is a real .gif file encoded in your browser via gif.js. Frames are letterboxed on a
        white background and capped at {MAX_DIMENSION}px on the longest side.
      </p>
    </div>
  );
}
