'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ImageCompressorClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setCompressedImage(null);
        setCompressedSize(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);

    const img = new window.Image();
    img.src = originalImage;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const reader = new FileReader();
            reader.onload = (e) => {
              setCompressedImage(e.target?.result as string);
            };
            reader.readAsDataURL(blob);
          }
          setIsProcessing(false);
        },
        format,
        quality / 100
      );
    };
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-image.${format.split('/')[1]}`;
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getReduction = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  };

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
            <div className="text-sm text-gray-400">Supports PNG, JPG, WebP</div>
          </div>
        </button>
      </div>

      {/* Options */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {quality}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'image/jpeg' | 'image/png' | 'image/webp')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
        </div>
      )}

      {/* Compress Button */}
      {originalImage && (
        <button
          onClick={compressImage}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isProcessing ? 'Compressing...' : 'Compress Image'}
        </button>
      )}

      {/* Results */}
      {compressedImage && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Original</div>
              <div className="text-lg font-semibold">{formatBytes(originalSize)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Compressed</div>
              <div className="text-lg font-semibold text-green-600">{formatBytes(compressedSize)}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Reduction</div>
              <div className="text-lg font-semibold text-blue-600">{getReduction()}%</div>
            </div>
          </div>

          {/* Download */}
          <button
            onClick={downloadCompressed}
            className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Compressed Image
          </button>
        </div>
      )}
    </div>
  );
}
