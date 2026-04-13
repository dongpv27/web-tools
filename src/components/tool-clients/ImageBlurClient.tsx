'use client';

import { useState, useRef } from 'react';

export default function ImageBlurClient() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState(5);
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
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const applyBlur = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply CSS filter blur
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const download = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'blurred-image.png';
    link.href = processedImage;
    link.click();
  };

  const clear = () => {
    setImage(null);
    setProcessedImage(null);
    setBlurAmount(5);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
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
        </div>
      ) : (
        <div className="space-y-4">
          {/* Blur Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Blur Amount</label>
              <span className="text-sm text-gray-600">{blurAmount}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={blurAmount}
              onChange={(e) => setBlurAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Original</p>
              <div className="border border-gray-200 rounded-lg p-2">
                <img src={image} alt="Original" className="max-h-48 mx-auto" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Blurred</p>
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                {processedImage ? (
                  <img src={processedImage} alt="Blurred" className="max-h-48 mx-auto" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    Click apply
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={applyBlur}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Blur
            </button>
            {processedImage && (
              <button
                onClick={download}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Download
              </button>
            )}
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
