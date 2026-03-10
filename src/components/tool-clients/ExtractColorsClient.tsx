'use client';

import { useState, useRef } from 'react';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  count: number;
  percentage: number;
}

export default function ExtractColorsClient() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [numColors, setNumColors] = useState(10);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setColors([]);
    };
    reader.readAsDataURL(file);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  };

  const extractColors = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Resize for faster processing
      const maxDim = 200;
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Quantize colors and count occurrences
      const colorMap = new Map<string, number>();

      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const a = data[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and get top N colors
      const totalPixels = data.length / 4;
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors)
        .map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number);
          return {
            hex: rgbToHex(r, g, b),
            rgb: { r, g, b },
            count,
            percentage: Math.round((count / totalPixels) * 100 * 100) / 100,
          };
        });

      setColors(sortedColors);
    };
    img.src = image;
  };

  const copyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = hex;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  const exportAsCss = () => {
    const css = colors
      .map((color, i) => `--color-${i + 1}: ${color.hex};`)
      .join('\n');
    const fullCss = `:root {\n${css}\n}`;
    downloadFile(fullCss, 'color-palette.css', 'text/css');
  };

  const exportAsJson = () => {
    const json = JSON.stringify(
      colors.map((c) => ({ hex: c.hex, rgb: c.rgb, percentage: c.percentage })),
      null,
      2
    );
    downloadFile(json, 'color-palette.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setImage(null);
    setColors([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
          <p className="text-sm text-gray-500 mt-2">Extract dominant colors from any image</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img src={image} alt="Preview" className="max-h-48 mx-auto" />
          </div>

          {/* Number of Colors */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Number of colors: {numColors}</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumColors(n)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    numColors === n
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Extract Button */}
          <button
            onClick={extractColors}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Extract Colors
          </button>

          {/* Color Palette */}
          {colors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Extracted Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => copyColor(color.hex)}
                  >
                    <div
                      className="h-16 w-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="p-2 text-center">
                      <p className="text-xs font-mono font-medium">{color.hex}</p>
                      <p className="text-xs text-gray-500">{color.percentage}%</p>
                      {copiedColor === color.hex && (
                        <p className="text-xs text-green-600">Copied!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={exportAsCss}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Export CSS
                </button>
                <button
                  onClick={exportAsJson}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Export JSON
                </button>
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
