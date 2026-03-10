'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function HexToRgbClient() {
  const [hex, setHex] = useState('#3B82F6');
  const [result, setResult] = useState<{
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
  } | null>(null);
  const [error, setError] = useState('');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const convert = () => {
    setError('');

    const rgbVal = hexToRgb(hex);
    if (!rgbVal) {
      setError('Invalid HEX color format');
      setResult(null);
      return;
    }

    setResult({
      rgb: rgbVal,
      hsl: rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b),
    });
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="w-16 h-16 rounded-lg cursor-pointer border border-gray-300"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#000000"
          className="w-32 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={convert}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          {/* Color Preview */}
          <div
            className="w-full h-16 rounded-lg border border-gray-200"
            style={{ backgroundColor: hex }}
          />

          {/* RGB */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">RGB</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono">rgb({result.rgb.r}, {result.rgb.g}, {result.rgb.b})</code>
              <CopyButton text={`rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`} />
            </div>
          </div>

          {/* Individual RGB values */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <span className="text-xs text-gray-500">Red</span>
              <p className="text-lg font-bold text-red-600">{result.rgb.r}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <span className="text-xs text-gray-500">Green</span>
              <p className="text-lg font-bold text-green-600">{result.rgb.g}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <span className="text-xs text-gray-500">Blue</span>
              <p className="text-lg font-bold text-blue-600">{result.rgb.b}</p>
            </div>
          </div>

          {/* HSL */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">HSL</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono">hsl({result.hsl.h}, {result.hsl.s}%, {result.hsl.l}%)</code>
              <CopyButton text={`hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
