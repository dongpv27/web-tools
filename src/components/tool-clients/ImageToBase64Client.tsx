'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';

export default function ImageToBase64Client() {
  const [base64, setBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageInfo, setImageInfo] = useState({ name: '', type: '', size: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64(result);
      setImagePreview(result);

      // Format file size
      const size = file.size;
      let sizeStr = '';
      if (size < 1024) sizeStr = `${size} B`;
      else if (size < 1024 * 1024) sizeStr = `${(size / 1024).toFixed(2)} KB`;
      else sizeStr = `${(size / (1024 * 1024)).toFixed(2)} MB`;

      setImageInfo({
        name: file.name,
        type: file.type,
        size: sizeStr,
      });
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

  const copyDataUri = () => {
    navigator.clipboard.writeText(base64);
    toast.success('Data URI copied!');
  };

  const copyBase64Only = () => {
    const base64Only = base64.split(',')[1];
    navigator.clipboard.writeText(base64Only);
    toast.success('Base64 copied!');
  };

  const clear = () => {
    setBase64('');
    setImagePreview('');
    setImageInfo({ name: '', type: '', size: '' });
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!base64 ? (
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
          <p className="text-sm text-gray-500 mt-2">or drag and drop an image</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Info */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span><strong>File:</strong> {imageInfo.name}</span>
            <span><strong>Type:</strong> {imageInfo.type}</span>
            <span><strong>Size:</strong> {imageInfo.size}</span>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto" />
          </div>

          {/* Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base64 Data URI</label>
            <textarea
              readOnly
              value={base64}
              rows={6}
              className="w-full px-4 py-3 text-sm font-mono bg-white border border-gray-300 rounded-lg text-gray-800 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Copy Buttons */}
          <div className="flex gap-2">
            <button
              onClick={copyDataUri}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy Data URI
            </button>
            <button
              onClick={copyBase64Only}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Copy Base64 Only
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Usage Examples */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Usage Examples:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-600">
              <p>&lt;img src=&quot;{base64.substring(0, 50)}...&quot; /&gt;</p>
              <p className="mt-2">background-image: url(&apos;{base64.substring(0, 50)}...&apos;);</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
