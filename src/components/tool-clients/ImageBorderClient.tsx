'use client';

import { useState, useRef } from 'react';

export default function ImageBorderClient() {
  const [image, setImage] = useState<string | null>(null);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
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
      setBorderWidth(0);
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
    if (!image || !canvasRef.current || borderWidth < 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + borderWidth * 2;
      canvas.height = img.height + borderWidth * 2;

      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, borderWidth, borderWidth);

      const link = document.createElement('a');
      link.download = 'image-with-border.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  const clear = () => {
    setImage(null);
    setBorderWidth(0);
    setBorderColor('#000000');
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Border Width</label>
              <input type="number" min="0" max="100" value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Border Color</label>
              <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-10 rounded-md cursor-pointer" />
            </div>
          </div>

          {/* Preview */}
          <div
            className="border border-gray-200 rounded-lg p-2 inline-block mx-auto"
            style={{ backgroundColor: borderWidth > 0 ? borderColor : 'transparent', padding: borderWidth > 0 ? `${borderWidth}px` : undefined }}
          >
            <img src={image} alt="Preview" className="max-h-64 mx-auto block" />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={download}
              disabled={borderWidth < 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                borderWidth >= 1
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
