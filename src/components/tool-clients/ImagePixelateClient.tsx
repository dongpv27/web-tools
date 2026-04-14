'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImagePixelateClient() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState(1);
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
      setPixelSize(1);
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

  useEffect(() => {
    if (!image || !canvasRef.current || pixelSize < 2) {
      if (image && pixelSize < 2) setProcessedImage(null);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
            for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
              const pIdx = ((y + py) * canvas.width + (x + px)) * 4;
              data[pIdx] = r;
              data[pIdx + 1] = g;
              data[pIdx + 2] = b;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, pixelSize]);

  const download = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'pixelated-image.png';
    link.href = processedImage;
    link.click();
  };

  const clear = () => {
    setImage(null);
    setProcessedImage(null);
    setPixelSize(1);
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
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Pixel Size</label>
              <span className="text-sm text-gray-600">{pixelSize}px</span>
            </div>
            <input
              type="range" min="1" max="50" value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            {processedImage ? (
              <img src={processedImage} alt="Pixelated" className="max-h-64 mx-auto" />
            ) : (
              <img src={image} alt="Original" className="max-h-64 mx-auto" />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={download}
              disabled={!processedImage}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                processedImage
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-300 text-white cursor-not-allowed'
              }`}
            >
              Download
            </button>
            <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
