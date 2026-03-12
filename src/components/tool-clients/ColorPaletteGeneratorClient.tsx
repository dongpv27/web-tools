'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function ColorPaletteGeneratorClient() {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [paletteType, setPaletteType] = useState<'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary'>('complementary');
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

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

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const generatePalette = () => {
    const { h, s, l } = hexToHsl(baseColor);
    const colors: string[] = [baseColor.toUpperCase()];

    switch (paletteType) {
      case 'complementary':
        colors.push(hslToHex((h + 180) % 360, s, l));
        break;
      case 'analogous':
        colors.push(hslToHex((h + 30) % 360, s, l));
        colors.push(hslToHex((h + 60) % 360, s, l));
        colors.push(hslToHex((h - 30 + 360) % 360, s, l));
        colors.push(hslToHex((h - 60 + 360) % 360, s, l));
        break;
      case 'triadic':
        colors.push(hslToHex((h + 120) % 360, s, l));
        colors.push(hslToHex((h + 240) % 360, s, l));
        break;
      case 'tetradic':
        colors.push(hslToHex((h + 90) % 360, s, l));
        colors.push(hslToHex((h + 180) % 360, s, l));
        colors.push(hslToHex((h + 270) % 360, s, l));
        break;
      case 'split-complementary':
        colors.push(hslToHex((h + 150) % 360, s, l));
        colors.push(hslToHex((h + 210) % 360, s, l));
        break;
    }

    setPalette(colors);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(palette.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Base Color */}
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="w-16 h-16 rounded-lg cursor-pointer border border-gray-300"
        />
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Base Color</label>
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Palette Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Palette Type</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { value: 'complementary', label: 'Complementary' },
            { value: 'analogous', label: 'Analogous' },
            { value: 'triadic', label: 'Triadic' },
            { value: 'tetradic', label: 'Tetradic' },
            { value: 'split-complementary', label: 'Split Comp.' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPaletteType(value as typeof paletteType)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                paletteType === value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePalette}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Palette
      </button>

      {/* Palette Display */}
      {palette.length > 0 && (
        <div className="space-y-4">
          <div className="flex h-24 rounded-lg overflow-hidden">
            {palette.map((color, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={copyAll} className={`text-sm rounded px-2 py-1 transition-colors ${
              copied ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'text-blue-600 hover:text-blue-700'
            }`}>{copied ? 'Copied!' : 'Copy All'}</button>
            <DownloadButton content={palette.join('\n')} filename="color-palette.txt" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {palette.map((color, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
                <code className="text-sm font-mono flex-1">{color}</code>
                <CopyButton text={color} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
