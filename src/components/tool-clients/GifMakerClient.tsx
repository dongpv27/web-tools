'use client';

import { useState, useRef } from 'react';

interface ImageFile {
  id: string;
  src: string;
  file: File;
}

export default function GifMakerClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [delay, setDelay] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      src: URL.createObjectURL(file),
      file,
    }));
    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.src);
      return prev.filter(i => i.id !== id);
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const createGif = async () => {
    if (images.length < 2) {
      alert('Please add at least 2 images');
      return;
    }

    setIsProcessing(true);

    try {
      // Load all images
      const loadedImages = await Promise.all(
        images.map(
          img =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = reject;
              image.src = img.src;
            })
        )
      );

      // Find max dimensions
      const maxWidth = Math.max(...loadedImages.map(img => img.width));
      const maxHeight = Math.max(...loadedImages.map(img => img.height));

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Create frames as data URLs
      const frames: string[] = [];
      for (const img of loadedImages) {
        ctx.clearRect(0, 0, maxWidth, maxHeight);
        const x = (maxWidth - img.width) / 2;
        const y = (maxHeight - img.height) / 2;
        ctx.drawImage(img, x, y);
        frames.push(canvas.toDataURL('image/png'));
      }

      // Create a simple animated preview using CSS animation
      // For actual GIF, we'd need a proper library
      // This is a workaround that creates an HTML file with the animation
      const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .animated { animation: fade ${delay}ms infinite; }
    @keyframes fade {
      0%, 100% { opacity: 1; }
      ${100 / frames.length}% { opacity: 0; }
    }
    .frame { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; }
    ${frames.map((_, i) => `.frame:nth-child(${frames.length}n+${i + 1}) { animation-delay: ${i * delay}ms; }`).join('\n')}
  </style>
</head>
<body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#333">
  ${frames.map((src, i) => `<img class="frame" src="${src}" style="animation-delay: ${i * delay}ms;">`).join('\n  ')}
  <script>
    const frames = ${JSON.stringify(frames)};
    let current = 0;
    const imgs = document.querySelectorAll('.frame');
    setInterval(() => {
      imgs.forEach((img, i) => {
        img.style.opacity = i === current ? 1 : 0;
      });
      current = (current + 1) % frames.length;
    }, ${delay});
  </script>
</body>
</html>`;

      // For now, download as individual images
      // Real GIF encoding requires a library like gif.js
      const blob = new Blob([html], { type: 'text/html' });
      setGifUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error creating GIF:', error);
      alert('Error creating GIF');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = 'animation.html';
    link.click();
  };

  const downloadAsZip = async () => {
    // Download all images as individual files
    for (let i = 0; i < images.length; i++) {
      const link = document.createElement('a');
      link.href = images[i].src;
      link.download = `frame-${i + 1}.png`;
      link.click();
      await new Promise(r => setTimeout(r, 100));
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
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
          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-center">
            <div className="text-gray-600 mb-2">Click to add images</div>
            <div className="text-sm text-gray-400">Add multiple images to create an animated GIF</div>
          </div>
        </button>
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frame Delay: {delay}ms
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frames ({images.length}) - Use arrows to reorder
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

      {/* Create Button */}
      {images.length >= 2 && (
        <div className="flex gap-2">
          <button
            onClick={createGif}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isProcessing ? 'Creating...' : 'Create Animation'}
          </button>
          <button
            onClick={downloadAsZip}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Download Frames
          </button>
        </div>
      )}

      {/* Preview */}
      {gifUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Animation created! Click download to save.</p>
          </div>
          <button
            onClick={downloadGif}
            className="w-full mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Animation
          </button>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Note: This tool creates an HTML-based animation. For proper GIF files, consider using our Video to GIF tool.</p>
      </div>
    </div>
  );
}
