'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorConverterClient() {
  const [inputType, setInputType] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [rgbInput, setRgbInput] = useState({ r: 59, g: 130, b: 246 });
  const [hslInput, setHslInput] = useState({ h: 217, s: 91, l: 60 });
  const [colorValues, setColorValues] = useState<ColorValues | null>(null);
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

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    if (r === 0 && g === 0 && b === 0) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);

    return {
      c: Math.round(((c - k) / (1 - k)) * 100),
      m: Math.round(((m - k) / (1 - k)) * 100),
      y: Math.round(((y - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const convert = () => {
    setError('');
    setColorValues(null);

    try {
      let rgb: { r: number; g: number; b: number };

      if (inputType === 'hex') {
        const parsed = hexToRgb(hexInput);
        if (!parsed) throw new Error('Invalid HEX color');
        rgb = parsed;
      } else if (inputType === 'rgb') {
        rgb = rgbInput;
      } else {
        rgb = hslToRgb(hslInput.h, hslInput.s, hslInput.l);
      }

      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;

      setColorValues({ hex: hex.toUpperCase(), rgb, hsl, cmyk });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Input Type</label>
        <div className="flex gap-2">
          {(['hex', 'rgb', 'hsl'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setInputType(type)}
              className={`px-4 py-2 text-sm rounded-lg uppercase ${
                inputType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      {inputType === 'hex' && (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer border border-gray-300"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md"
          />
        </div>
      )}

      {inputType === 'rgb' && (
        <div className="grid grid-cols-3 gap-4">
          {(['r', 'g', 'b'] as const).map((channel) => (
            <div key={channel}>
              <label className="block text-xs text-gray-500 mb-1 uppercase">{channel}</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbInput[channel]}
                onChange={(e) => setRgbInput({ ...rgbInput, [channel]: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
      )}

      {inputType === 'hsl' && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hue (0-360)</label>
            <input
              type="number"
              min="0"
              max="360"
              value={hslInput.h}
              onChange={(e) => setHslInput({ ...hslInput, h: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Saturation (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={hslInput.s}
              onChange={(e) => setHslInput({ ...hslInput, s: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Lightness (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={hslInput.l}
              onChange={(e) => setHslInput({ ...hslInput, l: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}

      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Convert</button>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {colorValues && (
        <div className="space-y-3">
          {/* Color Preview */}
          <div className="h-20 rounded-lg border border-gray-200" style={{ backgroundColor: colorValues.hex }} />

          {/* HEX */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">HEX</p>
              <code className="text-sm font-mono">{colorValues.hex}</code>
            </div>
            <CopyButton text={colorValues.hex} />
          </div>

          {/* RGB */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">RGB</p>
              <code className="text-sm font-mono">rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})</code>
            </div>
            <CopyButton text={`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`} />
          </div>

          {/* HSL */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">HSL</p>
              <code className="text-sm font-mono">hsl({colorValues.hsl.h}, {colorValues.hsl.s}%, {colorValues.hsl.l}%)</code>
            </div>
            <CopyButton text={`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`} />
          </div>

          {/* CMYK */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">CMYK</p>
              <code className="text-sm font-mono">cmyk({colorValues.cmyk.c}%, {colorValues.cmyk.m}%, {colorValues.cmyk.y}%, {colorValues.cmyk.k}%)</code>
            </div>
            <CopyButton text={`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`} />
          </div>

          {/* Download All */}
          <DownloadButton
            content={`Color Values\n------------\n\nHEX: ${colorValues.hex}\nRGB: rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})\nHSL: hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)\nCMYK: cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`}
            filename="color-values.txt"
          />
        </div>
      )}
    </div>
  );
}
