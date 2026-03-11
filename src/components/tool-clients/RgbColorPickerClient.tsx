'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function RgbColorPickerClient() {
  const [red, setRed] = useState(128);
  const [green, setGreen] = useState(128);
  const [blue, setBlue] = useState(128);

  const rgbColor = `rgb(${red}, ${green}, ${blue})`;
  const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase();
  const hslColor = rgbToHsl(red, green, blue);

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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div
        className="h-32 rounded-lg border border-gray-200 shadow-inner"
        style={{ backgroundColor: rgbColor }}
      />

      {/* RGB Sliders */}
      <div className="space-y-4">
        {/* Red */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-red-600">Red</label>
            <span className="text-sm text-gray-600">{red}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={red}
            onChange={(e) => setRed(Number(e.target.value))}
            className="w-full accent-red-500"
            style={{ background: `linear-gradient(to right, rgb(0, ${green}, ${blue}), rgb(255, ${green}, ${blue}))` }}
          />
        </div>

        {/* Green */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-green-600">Green</label>
            <span className="text-sm text-gray-600">{green}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={green}
            onChange={(e) => setGreen(Number(e.target.value))}
            className="w-full accent-green-500"
            style={{ background: `linear-gradient(to right, rgb(${red}, 0, ${blue}), rgb(${red}, 255, ${blue}))` }}
          />
        </div>

        {/* Blue */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-blue-600">Blue</label>
            <span className="text-sm text-gray-600">{blue}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={blue}
            onChange={(e) => setBlue(Number(e.target.value))}
            className="w-full accent-blue-500"
            style={{ background: `linear-gradient(to right, rgb(${red}, ${green}, 0), rgb(${red}, ${green}, 255))` }}
          />
        </div>
      </div>

      {/* Color Values */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <code className="text-sm font-mono">{rgbColor}</code>
          <CopyButton text={rgbColor} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <code className="text-sm font-mono">{hexColor}</code>
          <CopyButton text={hexColor} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <code className="text-sm font-mono">{hslColor}</code>
          <CopyButton text={hslColor} />
        </div>
      </div>

      {/* Quick Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Colors</label>
        <div className="flex flex-wrap gap-2">
          {[
            [255, 0, 0], [0, 255, 0], [0, 0, 255],
            [255, 255, 0], [255, 0, 255], [0, 255, 255],
            [255, 128, 0], [128, 0, 255], [0, 128, 255],
            [255, 255, 255], [128, 128, 128], [0, 0, 0],
          ].map(([r, g, b], i) => (
            <button
              key={i}
              onClick={() => { setRed(r); setGreen(g); setBlue(b); }}
              className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
              title={`RGB(${r}, ${g}, ${b})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
