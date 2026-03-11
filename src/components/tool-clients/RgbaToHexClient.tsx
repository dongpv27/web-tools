'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function RgbaToHexClient() {
  const [red, setRed] = useState(128);
  const [green, setGreen] = useState(128);
  const [blue, setBlue] = useState(128);
  const [alpha, setAlpha] = useState(100);

  const rgbaColor = `rgba(${red}, ${green}, ${blue}, ${(alpha / 100).toFixed(2)})`;
  const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase();
  const hex8Color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}${Math.round(alpha * 2.55).toString(16).padStart(2, '0')}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div
        className="h-32 rounded-lg border border-gray-200 shadow-inner"
        style={{
          backgroundColor: rgbaColor,
          backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        <div
          className="h-full rounded-lg"
          style={{ backgroundColor: rgbaColor }}
        />
      </div>

      {/* RGBA Sliders */}
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
          />
        </div>

        {/* Alpha */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-600">Alpha</label>
            <span className="text-sm text-gray-600">{alpha}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full accent-gray-500"
          />
        </div>
      </div>

      {/* Color Values */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-xs text-gray-500 block">RGBA</span>
            <code className="text-sm font-mono">{rgbaColor}</code>
          </div>
          <CopyButton text={rgbaColor} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-xs text-gray-500 block">HEX (6-digit, no alpha)</span>
            <code className="text-sm font-mono">{hexColor}</code>
          </div>
          <CopyButton text={hexColor} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-xs text-gray-500 block">HEX8 (with alpha)</span>
            <code className="text-sm font-mono">{hex8Color}</code>
          </div>
          <CopyButton text={hex8Color} />
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>HEX8 format includes the alpha channel as the last two characters. For example, #RRGGBBAA where AA represents opacity (00 = transparent, FF = opaque).</p>
      </div>
    </div>
  );
}
