'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function ColorPickerClient() {
  const [color, setColor] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

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

  const handleColorChange = (hex: string) => {
    setColor(hex);
    const rgbVal = hexToRgb(hex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-24 h-24 rounded-lg cursor-pointer border border-gray-300"
        />
        <div
          className="w-24 h-24 rounded-lg border border-gray-300"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Color Values */}
      <div className="space-y-3">
        {/* HEX */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">HEX</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono">{color.toUpperCase()}</code>
            <CopyButton text={color.toUpperCase()} />
          </div>
        </div>

        {/* RGB */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">RGB</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
            <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          </div>
        </div>

        {/* HSL */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">HSL</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
            <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          </div>
        </div>

        {/* CSS Variable */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">CSS Variable</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono">{color}</code>
            <CopyButton text={`--color: ${color};`} />
          </div>
        </div>
      </div>

      {/* HEX Input */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Or enter HEX value:</label>
        <input
          type="text"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#000000"
          className="w-32 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
