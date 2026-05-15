'use client';

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function UrlToQrCodeClient() {
  const [url, setUrl] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const normalizeUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
    return 'https://' + trimmed;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const trimmed = url.trim();
    if (!trimmed) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setError('');
      setWarning('');
      return;
    }

    const finalUrl = normalizeUrl(trimmed);

    try {
      new URL(finalUrl);
      setWarning(finalUrl !== trimmed ? `URL normalized to: ${finalUrl}` : '');
    } catch {
      setError('Invalid URL format');
      return;
    }

    QRCode.toCanvas(canvas, finalUrl, {
      width: size,
      errorCorrectionLevel: errorLevel,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    })
      .then(() => setError(''))
      .catch((e: Error) => setError(e.message));
  }, [url, size, errorLevel]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'url-qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-website.com"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {warning && !error && (
          <p className="mt-2 text-xs text-amber-600">{warning}</p>
        )}
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      </div>

      <div className="flex justify-center">
        <button
          onClick={download}
          disabled={!url.trim() || !!error}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
}
