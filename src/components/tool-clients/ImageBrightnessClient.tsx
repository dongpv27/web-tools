'use client';

import { useState, useRef } from 'react';

export default function ImageBrightnessClient() {
  const [image, setImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
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
      setBrightness(100);
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
      ctx.filter = `brightness(${brightness}%)`;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'brightness-adjusted-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  const clear = () => {
    setImage(null);
    setBrightness(100);
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
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Upload Image</button>
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
              <label className="text-sm font-medium text-gray-700">Brightness</label>
              <span className="text-sm text-gray-600">{brightness}%</span>
            </div>
            <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-gray-400"><span>Darker</span><span>Normal</span><span>Brighter</span></div>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img
              src={image}
              alt="Preview"
              className="max-h-64 mx-auto"
              style={{ filter: `brightness(${brightness}%)` }}
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
