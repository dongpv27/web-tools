'use client';

import { useState } from 'react';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

// Register colord's mix plugin once (idempotent — extend dedupes internally).
extend([mixPlugin]);
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';
import { hexToRgb } from '@/lib/color';
import { trackToolRun } from '@/lib/analytics';

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
  // Manipulation state — only meaningful once a valid colour has been parsed.
  // Amount applies to lighten/darken/saturate/desaturate (0–50%). Mix color
  // is the second color blended with the current one.
  const [amount, setAmount] = useState(20);
  const [mixColor, setMixColor] = useState('#ffffff');

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
      trackToolRun('color-converter', 'convert');
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

          {/* Manipulation — lighten / darken / saturate / desaturate / mix.
              Built on colord, which works in HSL space so changes are
              perceptually sensible (a 20% lighten on dark red doesn't blow
              out to white). */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Color Manipulation</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <label>Amount:</label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-32"
                />
                <span className="font-mono w-10 text-right">{amount}%</span>
              </div>
            </div>

            {(() => {
              const c = colord(colorValues.hex);
              const a = amount / 100;
              const variants = [
                { label: `Lighten ${amount}%`, hex: c.lighten(a).toHex().toUpperCase() },
                { label: `Darken ${amount}%`, hex: c.darken(a).toHex().toUpperCase() },
                { label: `Saturate ${amount}%`, hex: c.saturate(a).toHex().toUpperCase() },
                { label: `Desaturate ${amount}%`, hex: c.desaturate(a).toHex().toUpperCase() },
                { label: `Mix 50%`, hex: c.mix(mixColor, 0.5).toHex().toUpperCase() },
              ];
              return (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {variants.map((v) => (
                      <div key={v.label} className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <div className="h-14" style={{ backgroundColor: v.hex }} />
                        <div className="px-2 py-1.5 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 truncate">{v.label}</p>
                            <code className="text-xs font-mono">{v.hex}</code>
                          </div>
                          <CopyButton text={v.hex} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <label>Mix with:</label>
                    <input
                      type="color"
                      value={mixColor}
                      onChange={(e) => setMixColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <code className="font-mono text-xs">{mixColor.toUpperCase()}</code>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
