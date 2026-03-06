'use client';

import { useState, useRef } from 'react';

export default function ImageResizeClient() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainRatio && originalSize.width > 0) {
      setHeight(Math.round((newWidth / originalSize.width) * originalSize.height));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainRatio && originalSize.height > 0) {
      setWidth(Math.round((newHeight / originalSize.height) * originalSize.width));
    }
  };

  const resize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = image;
  };

  const download = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = 'resized-image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const clear = () => {
    setImage(null);
    setWidth(800);
    setHeight(600);
    setOriginalSize({ width: 0, height: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img src={image} alt="Preview" className="max-h-64 mx-auto" />
          </div>

          {/* Original Size */}
          <p className="text-sm text-gray-600">
            Original: {originalSize.width} × {originalSize.height} px
          </p>

          {/* Dimensions */}
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Maintain Ratio */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maintainRatio}
              onChange={(e) => setMaintainRatio(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Maintain aspect ratio</span>
          </label>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={resize}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Resize
            </button>
            <button
              onClick={download}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
