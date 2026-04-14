'use client';

import { useState, useRef } from 'react';

export default function ImageRotateClient() {
  const [image, setImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isRotated, setIsRotated] = useState(false);
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
      setOriginalImage(event.target?.result as string);
      setImage(event.target?.result as string);
      setRotation(null);
      setIsRotated(false);
      setFileName(file.name);
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

  const applyRotation = () => {
    if (!originalImage || !canvasRef.current || rotation === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const radians = (rotation * Math.PI) / 180;

      // Calculate new canvas size
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));
      const newWidth = img.width * cos + img.height * sin;
      const newHeight = img.width * sin + img.height * cos;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Clear and rotate
      ctx.clearRect(0, 0, newWidth, newHeight);
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      setImage(canvas.toDataURL('image/png'));
      setIsRotated(true);
    };
    img.src = originalImage;
  };

  const download = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.download = 'rotated-image.png';
    link.href = image;
    link.click();
  };

  const clear = () => {
    setImage(null);
    setOriginalImage(null);
    setRotation(null);
    setIsRotated(false);
    setFileName('');
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
          <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Name */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">File:</span>
            <span className="truncate max-w-xs">{fileName}</span>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img src={image} alt="Preview" className="max-h-64 mx-auto" />
          </div>

          {/* Rotation Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Rotation Angle</label>
              {rotation !== null && (
                <span className="text-sm text-gray-600">{rotation}°</span>
              )}
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation ?? 0}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex gap-2">
              {[0, 90, 180, 270].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setRotation(angle)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    rotation === angle
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {rotation !== null && (
              <button
                onClick={applyRotation}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRotated ? 'Re-apply' : 'Apply Rotation'}
              </button>
            )}
            <button
              onClick={download}
              disabled={!isRotated}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isRotated
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-300 text-white cursor-not-allowed'
              }`}
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
