'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';

export default function ImageToIcoClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [icoBlob, setIcoBlob] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = [16, 32, 48, 64, 128, 256];

  const generatePreview = (size: number) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(size / img.width, size / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (size - width) / 2;
      const y = (size - height) / 2;

      ctx.drawImage(img, x, y, width, height);
      setPreviewUrl(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  
  const processFile = (file: File) => {const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setImage(event.target?.result as string);
        setPreviewUrl(null);
        setIcoBlob(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleSizeChange = (size: number) => {
    setSelectedSize(size);
    setIcoBlob(null);
    generatePreview(size);
  };

  const createIco = async () => {
    if (!image || !canvasRef.current || !selectedSize) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      canvas.width = selectedSize;
      canvas.height = selectedSize;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(selectedSize / img.width, selectedSize / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (selectedSize - width) / 2;
      const y = (selectedSize - height) / 2;

      ctx.drawImage(img, x, y, width, height);

      // Get PNG data
      const pngDataUrl = canvas.toDataURL('image/png');
      const pngBase64 = pngDataUrl.split(',')[1];
      const pngBinary = atob(pngBase64);
      const pngArray = new Uint8Array(pngBinary.length);
      for (let i = 0; i < pngBinary.length; i++) {
        pngArray[i] = pngBinary.charCodeAt(i);
      }

      // Create ICO file structure
      const iconDirSize = 6;
      const iconDirEntrySize = 16;
      const pngOffset = iconDirSize + iconDirEntrySize;
      const totalSize = pngOffset + pngArray.length;

      const icoArray = new Uint8Array(totalSize);
      const view = new DataView(icoArray.buffer);

      // ICONDIR
      view.setUint16(0, 0, true); // Reserved
      view.setUint16(2, 1, true); // Type: 1 = ICO
      view.setUint16(4, 1, true); // Number of images

      // ICONDIRENTRY
      view.setUint8(6, selectedSize >= 256 ? 0 : selectedSize); // Width (0 = 256)
      view.setUint8(7, selectedSize >= 256 ? 0 : selectedSize); // Height (0 = 256)
      view.setUint8(8, 0); // Color palette
      view.setUint8(9, 0); // Reserved
      view.setUint16(10, 1, true); // Color planes
      view.setUint16(12, 32, true); // Bits per pixel
      view.setUint32(14, pngArray.length, true); // Size of image data
      view.setUint32(18, pngOffset, true); // Offset to image data

      // Copy PNG data
      icoArray.set(pngArray, pngOffset);

      const blob = new Blob([icoArray], { type: 'image/x-icon' });
      setIcoBlob(blob);
      toast.success('ICO generated successfully!');
    };
    img.src = image;
  };

  const download = () => {
    if (!icoBlob || !selectedSize) return;

    const url = URL.createObjectURL(icoBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `favicon-${selectedSize}x${selectedSize}.ico`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setImage(null);
    setPreviewUrl(null);
    setIcoBlob(null);
    setSelectedSize(null);
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
          <p className="text-sm text-gray-500 mt-2">PNG, JPG, or WebP recommended</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Original Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2 text-center">Original Image</p>
            <img src={image} alt="Original" className="max-h-48 mx-auto" />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {originalSize.width} × {originalSize.height} px
            </p>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">ICO Size</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>

          {/* Preview at selected size */}
          {previewUrl && selectedSize && (
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Preview at {selectedSize}×{selectedSize}</p>
              <div
                className="mx-auto border border-gray-300"
                style={{ width: Math.min(selectedSize, 256), height: Math.min(selectedSize, 256), overflow: 'hidden' }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: selectedSize <= 64 ? 'pixelated' : 'auto' }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={createIco}
              disabled={!selectedSize}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedSize
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
            >
              Generate ICO
            </button>
            <button
              onClick={download}
              disabled={!icoBlob}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download ICO
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
