'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function RgbToHexClient() {
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);
  const [hex, setHex] = useState('#3B82F6');

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const convert = () => {
    setHex(rgbToHex(r, g, b));
  };

  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHex(hex.toUpperCase());

    // Convert hex to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      setR(parseInt(result[1], 16));
      setG(parseInt(result[2], 16));
      setB(parseInt(result[3], 16));
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div
        className="w-full h-24 rounded-lg border border-gray-200"
        style={{ backgroundColor: hex }}
      />

      {/* Color Picker */}
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={hex}
          onChange={handleColorPicker}
          className="w-16 h-16 rounded-lg cursor-pointer border border-gray-300"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">Or use the color picker above</p>
        </div>
      </div>

      {/* RGB Inputs */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Red</label>
          <input
            type="number"
            min="0"
            max="255"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="range"
            min="0"
            max="255"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Green</label>
          <input
            type="number"
            min="0"
            max="255"
            value={g}
            onChange={(e) => setG(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="range"
            min="0"
            max="255"
            value={g}
            onChange={(e) => setG(Number(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Blue</label>
          <input
            type="number"
            min="0"
            max="255"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="range"
            min="0"
            max="255"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>
      </div>

      {/* Convert Button */}
      <button
        onClick={convert}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Convert to HEX
      </button>

      {/* Result */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">HEX</span>
          <div className="flex items-center gap-2">
            <code className="text-lg font-mono font-bold">{hex}</code>
            <CopyButton text={hex} />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>RGB</span>
          <code>rgb({r}, {g}, {b})</code>
        </div>
      </div>
    </div>
  );
}
