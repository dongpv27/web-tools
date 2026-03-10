'use client';

import { useState, useRef } from 'react';

export default function Base64ToImageClient() {
  const [base64, setBase64] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState('');
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0, format: '' });

  const convert = () => {
    setError('');
    if (!base64.trim()) {
      setError('Please enter Base64 data');
      return;
    }

    try {
      let dataUri = base64.trim();

      // If it doesn't start with data:, assume it's raw base64 and add prefix
      if (!dataUri.startsWith('data:')) {
        dataUri = `data:image/png;base64,${dataUri}`;
      }

      // Validate by creating an image
      const img = new Image();
      img.onload = () => {
        setImageSrc(dataUri);

        // Extract format from data URI
        const formatMatch = dataUri.match(/data:image\/([^;]+)/);
        const format = formatMatch ? formatMatch[1].toUpperCase() : 'Unknown';

        setImageInfo({
          width: img.width,
          height: img.height,
          format: format,
        });
      };
      img.onerror = () => {
        setError('Invalid image data. Please check your Base64 string.');
      };
      img.src = dataUri;
    } catch (e) {
      setError('Invalid Base64 data');
    }
  };

  const download = () => {
    if (!imageSrc) return;

    const link = document.createElement('a');
    link.download = `image.${imageInfo.format.toLowerCase()}`;
    link.href = imageSrc;
    link.click();
  };

  const clear = () => {
    setBase64('');
    setImageSrc('');
    setError('');
    setImageInfo({ width: 0, height: 0, format: '' });
  };

  const loadSample = () => {
    setBase64('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAADklEQVQI12PIz8DAwMDAwMAAAA0GDACkEQAAe2U9FAAAAABJRU5ErkJggg==');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Base64 Data</label>
          <button onClick={loadSample} className="text-sm text-blue-600 hover:text-blue-700">
            Load Sample
          </button>
        </div>
        <textarea
          value={base64}
          onChange={(e) => setBase64(e.target.value)}
          placeholder="Paste Base64 data URI or raw Base64 string..."
          rows={6}
          className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={convert}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert to Image
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Result */}
      {imageSrc && (
        <div className="space-y-4">
          {/* Image Info */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span><strong>Format:</strong> {imageInfo.format}</span>
            <span><strong>Width:</strong> {imageInfo.width}px</span>
            <span><strong>Height:</strong> {imageInfo.height}px</span>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <img src={imageSrc} alt="Converted" className="max-w-full max-h-96 mx-auto" />
          </div>

          {/* Download */}
          <button
            onClick={download}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
}
