'use client';

import { useState, useRef } from 'react';

export default function ResizeImagePercentageClient() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(100);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [25, 50, 75, 100, 125, 150, 200];

  
  const processFile = (file: File) => {const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setImage(event.target?.result as string);
        setProcessedImage(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const calculatedSize = {
    width: Math.round((originalSize.width * percentage) / 100),
    height: Math.round((originalSize.height * percentage) / 100),
  };

  const resize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = calculatedSize.width;
      canvas.height = calculatedSize.height;
      ctx.drawImage(img, 0, 0, calculatedSize.width, calculatedSize.height);

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const download = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `resized-image-${percentage}percent.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const clear = () => {
    setImage(null);
    setProcessedImage(null);
    setPercentage(100);
    setOriginalSize({ width: 0, height: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!image ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2 text-center">Original</p>
              <img src={image} alt="Original" className="max-h-48 mx-auto" />
            </div>
            {processedImage && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2 text-center">Resized ({percentage}%)</p>
                <img src={processedImage} alt="Resized" className="max-h-48 mx-auto" />
              </div>
            )}
          </div>

          {/* Dimensions Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>Original: {originalSize.width} × {originalSize.height} px</p>
            <p>Result: {calculatedSize.width} × {calculatedSize.height} px</p>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPercentage(preset)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    percentage === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          {/* Percentage Slider */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Scale: {percentage}%</label>
            <input
              type="range"
              min="10"
              max="300"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>150%</span>
              <span>300%</span>
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Custom Percentage</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-500">%</span>
          </div>

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
              disabled={!processedImage}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
