'use client';

import { useState, useRef } from 'react';

export default function SvgToPngClient() {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [pngSize, setPngSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSvgContent(content);
        setPngUrl(null);
        setPngSize(0);

        // Try to parse SVG dimensions
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (svg) {
          const viewBox = svg.getAttribute('viewBox');
          if (viewBox) {
            const parts = viewBox.split(' ').map(Number);
            if (parts.length === 4) {
              setWidth(parts[2] || 800);
              setHeight(parts[3] || 600);
            }
          } else {
            const w = parseInt(svg.getAttribute('width') || '800');
            const h = parseInt(svg.getAttribute('height') || '600');
            setWidth(w);
            setHeight(h);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const convertToPng = async () => {
    if (!svgContent) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Create blob URL for SVG
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        canvas.toBlob(
          (pngBlob) => {
            if (pngBlob) {
              setPngSize(pngBlob.size);
              const reader = new FileReader();
              reader.onload = (e) => {
                setPngUrl(e.target?.result as string);
              };
              reader.readAsDataURL(pngBlob);
            }
            setIsProcessing(false);
          },
          'image/png'
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        alert('Error loading SVG');
      };

      img.src = url;
    } catch (error) {
      setIsProcessing(false);
      alert('Error converting SVG to PNG');
    }
  };

  const downloadPng = () => {
    if (!pngUrl) return;

    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = 'converted-image.png';
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".svg,image/svg+xml"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-center">
            <div className="text-gray-600 mb-2">Click to select an SVG file</div>
            <div className="text-sm text-gray-400">Only SVG files are supported</div>
          </div>
        </button>
      </div>

      {/* Options */}
      {svgContent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min="1"
              max="4096"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="1"
              max="4096"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {svgContent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SVG Preview</label>
          <div
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            style={{ backgroundColor }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )}

      {/* Convert Button */}
      {svgContent && (
        <button
          onClick={convertToPng}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isProcessing ? 'Converting...' : 'Convert to PNG'}
        </button>
      )}

      {/* Result */}
      {pngUrl && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">SVG Size</div>
              <div className="text-lg font-semibold">{formatBytes(originalSize)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">PNG Size</div>
              <div className="text-lg font-semibold text-green-600">{formatBytes(pngSize)}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PNG Preview</label>
            <img src={pngUrl} alt="Converted PNG" className="max-w-full rounded-lg border border-gray-200" />
          </div>

          <button
            onClick={downloadPng}
            className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}
