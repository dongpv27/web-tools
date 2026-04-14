'use client';

import { useState, useRef } from 'react';

export default function PngCompressorClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/png') {
      setOriginalSize(file.size);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setCompressedImage(null);
        setCompressedSize(0);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PNG image');
    }
  };

  const compressImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);

    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      // For PNG, we use toDataURL with quality parameter
      // Note: Browser PNG compression is limited, but we can optimize
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
        'image/png',
        1 // PNG is lossless, quality doesn't affect it
      );
    };
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed-image.png';
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
    const reduction = ((originalSize - compressedSize) / originalSize * 100);
    return reduction > 0 ? reduction.toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/png"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-center">
            <div className="text-gray-600 mb-2">Click to select a PNG image</div>
            <div className="text-sm text-gray-400">Only PNG files are supported</div>
          </div>
        </button>
      </div>

      {/* File Name */}
      {originalImage && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">File:</span>
          <span className="truncate max-w-xs">{fileName}</span>
        </div>
      )}

      {/* Info about PNG compression */}
      {originalImage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <p>PNG is a lossless format. Browser-based compression has limited effect.</p>
          <p className="mt-1">For better compression, consider using our Image Compressor with WebP output.</p>
        </div>
      )}

      {/* Compress Button */}
      {originalImage && (
        <button
          onClick={compressImage}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isProcessing ? 'Compressing...' : 'Compress PNG'}
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

          {/* Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original</label>
              <img src={originalImage!} alt="Original" className="w-full rounded-lg border border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compressed</label>
              <img src={compressedImage} alt="Compressed" className="w-full rounded-lg border border-gray-200" />
            </div>
          </div>

          {/* Download */}
          <button
            onClick={downloadCompressed}
            className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Compressed PNG
          </button>
        </div>
      )}
    </div>
  );
}
