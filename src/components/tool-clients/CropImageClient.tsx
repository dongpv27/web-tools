'use client';

import { useState, useRef, useEffect } from 'react';

export default function CropImageClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setCropArea({ x: 0, y: 0, width: img.width / 2, height: img.height / 2 });
        };
        setImageSrc(event.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * imageDimensions.width;
    const y = (e.clientY - rect.top) / rect.height * imageDimensions.height;
    setIsDragging(true);
    setDragStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !imageSrc) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * imageDimensions.width;
    const y = (e.clientY - rect.top) / rect.height * imageDimensions.height;

    let newWidth = x - dragStart.x;
    let newHeight = y - dragStart.y;

    if (aspectRatio) {
      const ratio = parseFloat(aspectRatio);
      if (Math.abs(newWidth) > Math.abs(newHeight)) {
        newHeight = newWidth / ratio;
      } else {
        newWidth = newHeight * ratio;
      }
    }

    setCropArea(prev => ({
      ...prev,
      width: newWidth,
      height: newHeight,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cropImage = () => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const x = Math.min(cropArea.x, cropArea.x + cropArea.width);
      const y = Math.min(cropArea.y, cropArea.y + cropArea.height);
      const width = Math.abs(cropArea.width);
      const height = Math.abs(cropArea.height);

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, x, y, width, height, 0, 0, width, height);

      const link = document.createElement('a');
      link.download = 'cropped-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  const aspectRatios = [
    { label: 'Free', value: null },
    { label: '1:1', value: '1' },
    { label: '4:3', value: '1.333' },
    { label: '16:9', value: '1.778' },
    { label: '2:3', value: '0.667' },
  ];

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-center">
            <div className="text-gray-600 mb-2">Click to select an image</div>
            <div className="text-sm text-gray-400">Drag to select crop area</div>
          </div>
        </button>
      </div>

      {/* File Name */}
      {imageSrc && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">File:</span>
          <span className="truncate max-w-xs">{fileName}</span>
        </div>
      )}

      {/* Aspect Ratio Selection */}
      {imageSrc && (
        <div className="flex gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.label}
              onClick={() => setAspectRatio(ratio.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                aspectRatio === ratio.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview with Crop Selection */}
      {imageSrc && (
        <div
          className="relative border border-gray-300 rounded-lg overflow-hidden cursor-crosshair"
          style={{ maxHeight: '400px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={imageSrc}
            alt="Preview"
            className="w-full h-auto"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          {/* Crop Overlay */}
          <div
            className="absolute border-2 border-white bg-black/30"
            style={{
              left: `${(Math.min(cropArea.x, cropArea.x + cropArea.width) / imageDimensions.width) * 100}%`,
              top: `${(Math.min(cropArea.y, cropArea.y + cropArea.height) / imageDimensions.height) * 100}%`,
              width: `${(Math.abs(cropArea.width) / imageDimensions.width) * 100}%`,
              height: `${(Math.abs(cropArea.height) / imageDimensions.height) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Crop Button */}
      {imageSrc && cropArea.width !== 0 && cropArea.height !== 0 && (
        <button
          onClick={cropImage}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Crop & Download
        </button>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
