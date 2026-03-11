'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function HexColorPickerClient() {
  const [hexColor, setHexColor] = useState('#808080');

  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    if (!isValidHex(hex)) return null;

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      // Try 3-character hex
      result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
      if (!result) return null;
      return {
        r: parseInt(result[1] + result[1], 16),
        g: parseInt(result[2] + result[2], 16),
        b: parseInt(result[3] + result[3], 16),
      };
    }

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  };

  const rgb = hexToRgb(hexColor);
  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid';
  const hslString = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : 'Invalid';

  function rgbToHsl(r: number, g: number, b: number): string {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  const handleHexChange = (value: string) => {
    let hex = value.startsWith('#') ? value : `#${value}`;
    if (hex.length <= 7) {
      setHexColor(hex);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexColor(e.target.value.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="flex gap-4">
        <div
          className="flex-1 h-32 rounded-lg border border-gray-200 shadow-inner"
          style={{ backgroundColor: isValidHex(hexColor) ? hexColor : '#ffffff' }}
        />
        <input
          type="color"
          value={isValidHex(hexColor) ? hexColor : '#808080'}
          onChange={handleColorPickerChange}
          className="w-16 h-32 rounded-lg cursor-pointer border border-gray-200"
        />
      </div>

      {/* Hex Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">HEX Color</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={hexColor}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={7}
          />
          {!isValidHex(hexColor) && (
            <span className="text-sm text-red-500">Invalid</span>
          )}
        </div>
      </div>

      {/* Color Values */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-xs text-gray-500 block">HEX</span>
            <code className="text-sm font-mono">{hexColor.toUpperCase()}</code>
          </div>
          <CopyButton text={hexColor.toUpperCase()} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-xs text-gray-500 block">RGB</span>
            <code className="text-sm font-mono">{rgbString}</code>
          </div>
          <CopyButton text={rgbString} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-xs text-gray-500 block">HSL</span>
            <code className="text-sm font-mono">{hslString}</code>
          </div>
          <CopyButton text={hslString} />
        </div>
      </div>

      {/* Quick Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Colors</label>
        <div className="flex flex-wrap gap-2">
          {[
            '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#FF00FF', '#00FFFF',
            '#FF8000', '#8000FF', '#0080FF',
            '#FFFFFF', '#808080', '#000000',
          ].map((color) => (
            <button
              key={color}
              onClick={() => setHexColor(color)}
              className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
