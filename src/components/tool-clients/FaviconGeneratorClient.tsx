'use client';

import { useState, useRef } from 'react';

interface GeneratedFavicon {
  size: number;
  url: string;
  blob: Blob;
}

export default function FaviconGeneratorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 180, 192, 512]);
  const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFavicon[]>([]);
  const [htmlSnippet, setHtmlSnippet] = useState<string>('');
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSizes = [
    { size: 16, label: '16×16', desc: 'Browser tab' },
    { size: 32, label: '32×32', desc: 'Browser tab (Retina)' },
    { size: 48, label: '48×48', desc: 'Windows' },
    { size: 64, label: '64×64', desc: 'Windows' },
    { size: 180, label: '180×180', desc: 'Apple Touch' },
    { size: 192, label: '192×192', desc: 'Android Chrome' },
    { size: 512, label: '512×512', desc: 'PWA' },
  ];

  
  const processFile = (file: File) => {const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setImage(event.target?.result as string);
        setGeneratedFavicons([]);
        setHtmlSnippet('');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const generateFavicons = async () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      const favicons: GeneratedFavicon[] = [];

      for (const size of selectedSizes) {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit within the target size
        const scale = Math.min(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;

        ctx.drawImage(img, x, y, width, height);

        const dataUrl = canvas.toDataURL('image/png');

        // Convert to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        favicons.push({ size, url: dataUrl, blob });
      }

      setGeneratedFavicons(favicons);

      // Generate HTML snippet
      const snippet = generateHtmlSnippet(favicons);
      setHtmlSnippet(snippet);
    };
    img.src = image;
  };

  const generateHtmlSnippet = (favicons: GeneratedFavicon[]) => {
    const lines: string[] = [];

    // Standard favicon
    if (favicons.find((f) => f.size === 32)) {
      lines.push('<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">');
    }
    if (favicons.find((f) => f.size === 16)) {
      lines.push('<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">');
    }

    // Apple Touch Icon
    if (favicons.find((f) => f.size === 180)) {
      lines.push('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">');
    }

    // Android/Chrome
    if (favicons.find((f) => f.size === 192)) {
      lines.push('<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">');
    }
    if (favicons.find((f) => f.size === 512)) {
      lines.push('<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">');
    }

    return lines.join('\n');
  };

  const downloadFavicon = (favicon: GeneratedFavicon) => {
    const link = document.createElement('a');
    link.href = favicon.url;
    const filename = favicon.size === 180
      ? 'apple-touch-icon.png'
      : `favicon-${favicon.size}x${favicon.size}.png`;
    link.download = filename;
    link.click();
  };

  const downloadAll = async () => {
    for (const favicon of generatedFavicons) {
      downloadFavicon(favicon);
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const copyHtmlSnippet = async () => {
    try {
      await navigator.clipboard.writeText(htmlSnippet);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = htmlSnippet;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const clear = () => {
    setImage(null);
    setGeneratedFavicons([]);
    setHtmlSnippet('');
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
          <p className="text-sm text-gray-500 mt-2">
            Square image recommended (at least 512×512 px)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Original Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img src={image} alt="Original" className="max-h-48 mx-auto" />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {originalSize.width} × {originalSize.height} px
            </p>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Select Sizes to Generate</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSizes.map(({ size, label, desc }) => (
                <label
                  key={size}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                    selectedSizes.includes(size)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs text-gray-500 block">{desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateFavicons}
            disabled={selectedSizes.length === 0}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Favicons
          </button>

          {/* Generated Favicons */}
          {generatedFavicons.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Generated Favicons</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {generatedFavicons.map((favicon) => (
                  <div
                    key={favicon.size}
                    className="border border-gray-200 rounded-lg p-2 text-center"
                  >
                    <img
                      src={favicon.url}
                      alt={`${favicon.size}x${favicon.size}`}
                      className="w-12 h-12 mx-auto"
                    />
                    <p className="text-xs text-gray-600 mt-1">{favicon.size}×{favicon.size}</p>
                    <button
                      onClick={() => downloadFavicon(favicon)}
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>

              {/* Download All Button */}
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Download All
              </button>

              {/* HTML Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">HTML Snippet</label>
                  <button
                    onClick={copyHtmlSnippet}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
                  {htmlSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* Clear Button */}
          <button
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
