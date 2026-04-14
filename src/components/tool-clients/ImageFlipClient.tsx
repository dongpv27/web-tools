'use client';

import { useState, useRef } from 'react';

export default function ImageFlipClient() {
  const [image, setImage] = useState<string | null>(null);
  const [flipDirection, setFlipDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [fileName, setFileName] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const download = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();
      if (flipDirection === 'horizontal') {
        ctx.scale(-1, 1);
        ctx.drawImage(img, -img.width, 0);
      } else {
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, -img.height);
      }
      ctx.restore();

      const link = document.createElement('a');
      link.download = `flipped-${flipDirection}-image.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  const clear = () => {
    setImage(null);
    setFileName('');
  };

  return (
    <div className="space-y-6">
      {!image ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
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
          <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Name */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">File:</span>
            <span className="truncate max-w-xs">{fileName}</span>
          </div>

          {/* Flip Direction */}
          <div className="flex gap-2">
            <button
              onClick={() => setFlipDirection('horizontal')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                flipDirection === 'horizontal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Horizontal
            </button>
            <button
              onClick={() => setFlipDirection('vertical')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                flipDirection === 'vertical'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vertical
            </button>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img
              src={image}
              alt="Flipped"
              className="max-h-64 mx-auto"
              style={{ transform: flipDirection === 'horizontal' ? 'scaleX(-1)' : 'scaleY(-1)' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={download} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">Download</button>
            <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
