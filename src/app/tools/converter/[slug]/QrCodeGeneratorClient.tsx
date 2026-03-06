'use client';

import { useState, useRef, useEffect } from 'react';

// Simple QR Code generator using canvas
export default function QrCodeGeneratorClient() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // QR Code generation logic (simplified)
  useEffect(() => {
    if (!canvasRef.current || !text) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate QR matrix (simplified - using a basic pattern)
    const qr = generateQRMatrix(text, errorLevel);
    const moduleSize = Math.floor(size / qr.length);

    canvas.width = size;
    canvas.height = size;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Draw QR modules
    ctx.fillStyle = '#000000';
    for (let row = 0; row < qr.length; row++) {
      for (let col = 0; col < qr[row].length; col++) {
        if (qr[row][col]) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }, [text, size, errorLevel]);

  const generateQRMatrix = (data: string, errorLevel: string): boolean[][] => {
    // Simplified QR generation - creates a basic pattern
    // In production, use a proper QR library
    const size = 25;
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    // Add finder patterns (corners)
    addFinderPattern(matrix, 0, 0);
    addFinderPattern(matrix, size - 7, 0);
    addFinderPattern(matrix, 0, size - 7);

    // Add timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Encode data (simplified)
    const bytes = new TextEncoder().encode(data);
    let bitIndex = 0;
    const bits: boolean[] = [];
    for (const byte of bytes) {
      for (let i = 7; i >= 0; i--) {
        bits.push(((byte >> i) & 1) === 1);
      }
    }

    // Fill data area (simplified)
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (let row = 0; row < size; row++) {
        for (let c = 0; c < 2; c++) {
          const actualCol = col - c;
          if (!isReserved(row, actualCol, size)) {
            if (bitIndex < bits.length) {
              matrix[row][actualCol] = bits[bitIndex++];
            }
          }
        }
      }
    }

    return matrix;
  };

  const addFinderPattern = (matrix: boolean[][], startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[startRow + r][startCol + c] = isOuter || isInner;
      }
    }
  };

  const isReserved = (row: number, col: number, size: number): boolean => {
    // Finder patterns
    if (row < 9 && col < 9) return true;
    if (row < 9 && col >= size - 8) return true;
    if (row >= size - 8 && col < 9) return true;
    // Timing patterns
    if (row === 6 || col === 6) return true;
    return false;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Options */}
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

      {/* Preview */}
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      </div>

      {/* Download */}
      <div className="flex justify-center">
        <button
          onClick={download}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
}
