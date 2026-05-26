'use client';

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGeneratorClient() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [margin, setMargin] = useState(2);
  const [svgMarkup, setSvgMarkup] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Re-render canvas + regenerate SVG whenever any input changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!text) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setError('');
      setSvgMarkup('');
      return;
    }

    const opts = {
      width: size,
      errorCorrectionLevel: errorLevel,
      margin,
      color: { dark: darkColor, light: lightColor },
    } as const;

    QRCode.toCanvas(canvas, text, opts)
      .then(() => setError(''))
      .catch((e: Error) => setError(e.message));

    QRCode.toString(text, { ...opts, type: 'svg' })
      .then((svg) => setSvgMarkup(svg))
      .catch(() => setSvgMarkup(''));
  }, [text, size, errorLevel, darkColor, lightColor, margin]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL..."
          rows={3}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Size (px)</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={128}>128</option>
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={1024}>1024</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Error Correction</label>
          <select
            value={errorLevel}
            onChange={(e) => setErrorLevel(e.target.value as typeof errorLevel)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Foreground</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0"
              aria-label="Foreground color"
            />
            <input
              type="text"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="flex-1 min-w-0 px-2 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0"
              aria-label="Background color"
            />
            <input
              type="text"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="flex-1 min-w-0 px-2 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Margin (modules)</label>
          <input
            type="number"
            min={0}
            max={10}
            value={margin}
            onChange={(e) => setMargin(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={downloadPng}
          disabled={!text || !!error}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download PNG
        </button>
        <button
          onClick={downloadSvg}
          disabled={!text || !!error || !svgMarkup}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}
