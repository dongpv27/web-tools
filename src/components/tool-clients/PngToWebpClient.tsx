'use client';

import { useState, useRef } from 'react';

export default function PngToWebpClient() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [fileSizes, setFileSizes] = useState({ original: 0, converted: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileSizes({ original: file.size, converted: 0 });

    const reader = new FileReader();
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

  const convert = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const webpDataUrl = canvas.toDataURL('image/webp', quality / 100);
      setProcessedImage(webpDataUrl);

      // Calculate converted file size
      const base64Length = webpDataUrl.split(',')[1].length;
      const convertedSize = Math.round((base64Length * 3) / 4);
      setFileSizes((prev) => ({ ...prev, converted: convertedSize }));
    };
    img.src = image;
  };

  const download = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = 'converted-image.webp';
    link.href = processedImage;
    link.click();
  };

  const clear = () => {
    setImage(null);
    setProcessedImage(null);
    setOriginalSize({ width: 0, height: 0 });
    setFileSizes({ original: 0, converted: 0 });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const savings = fileSizes.original > 0 && fileSizes.converted > 0
    ? Math.round(((fileSizes.original - fileSizes.converted) / fileSizes.original) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload PNG Image
          </button>
          <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2 text-center">Original PNG</p>
              <img src={image} alt="Original" className="max-h-48 mx-auto" />
            </div>
            {processedImage && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2 text-center">Converted WebP</p>
                <img src={processedImage} alt="Converted" className="max-h-48 mx-auto" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>Dimensions: {originalSize.width} × {originalSize.height} px</p>
            {fileSizes.original > 0 && (
              <p>Original size: {formatFileSize(fileSizes.original)}</p>
            )}
            {fileSizes.converted > 0 && (
              <p>
                Converted size: {formatFileSize(fileSizes.converted)}
                {savings > 0 && (
                  <span className="text-green-600 ml-2">({savings}% smaller)</span>
                )}
              </p>
            )}
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quality: {quality}%</label>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={convert}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Convert to WebP
            </button>
            <button
              onClick={download}
              disabled={!processedImage}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download WebP
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
