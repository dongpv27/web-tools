'use client';

import { useState } from 'react';

export default function ColorContrastCheckerClient() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [ratio, setRatio] = useState<number | null>(null);
  const [wcagResult, setWcagResult] = useState<{
    aa: { normal: boolean; large: boolean };
    aaa: { normal: boolean; large: boolean };
  } | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const check = () => {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return;

    const fgLum = getLuminance(fg.r, fg.g, fg.b);
    const bgLum = getLuminance(bg.r, bg.g, bg.b);

    const lighter = Math.max(fgLum, bgLum);
    const darker = Math.min(fgLum, bgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    setRatio(contrastRatio);

    setWcagResult({
      aa: { normal: contrastRatio >= 4.5, large: contrastRatio >= 3 },
      aaa: { normal: contrastRatio >= 7, large: contrastRatio >= 4.5 },
    });
  };

  const swap = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  return (
    <div className="space-y-6">
      {/* Color Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foreground (Text)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="p-6 rounded-lg text-center"
        style={{ backgroundColor: background, color: foreground }}
      >
        <p className="text-lg font-medium">Sample Text</p>
        <p className="text-sm mt-1">This is how your text will look</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={check} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Check Contrast</button>
        <button onClick={swap} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">↔ Swap</button>
      </div>

      {/* Results */}
      {ratio !== null && wcagResult && (
        <div className="space-y-4">
          {/* Ratio Display */}
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-4xl font-bold text-gray-800">{ratio.toFixed(2)}:1</p>
            <p className="text-sm text-gray-500 mt-1">Contrast Ratio</p>
          </div>

          {/* WCAG Results */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">WCAG 2.1 Compliance</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-lg ${wcagResult.aa.normal ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs text-gray-500">AA Normal Text</p>
                <p className={`text-sm font-medium ${wcagResult.aa.normal ? 'text-green-700' : 'text-red-700'}`}>
                  {wcagResult.aa.normal ? '✓ Pass' : '✕ Fail'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${wcagResult.aa.large ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs text-gray-500">AA Large Text</p>
                <p className={`text-sm font-medium ${wcagResult.aa.large ? 'text-green-700' : 'text-red-700'}`}>
                  {wcagResult.aa.large ? '✓ Pass' : '✕ Fail'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${wcagResult.aaa.normal ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs text-gray-500">AAA Normal Text</p>
                <p className={`text-sm font-medium ${wcagResult.aaa.normal ? 'text-green-700' : 'text-red-700'}`}>
                  {wcagResult.aaa.normal ? '✓ Pass' : '✕ Fail'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${wcagResult.aaa.large ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-xs text-gray-500">AAA Large Text</p>
                <p className={`text-sm font-medium ${wcagResult.aaa.large ? 'text-green-700' : 'text-red-700'}`}>
                  {wcagResult.aaa.large ? '✓ Pass' : '✕ Fail'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
