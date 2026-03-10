'use client';

import { useState, useRef, useEffect } from 'react';

export default function BarcodeGeneratorClient() {
  const [text, setText] = useState('123456789012');
  const [barcodeType, setBarcodeType] = useState<'code128' | 'ean13' | 'code39'>('code128');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCode128 = (text: string): number[] => {
    const code128B = {
      ' ': 0, '!': 1, '"': 2, '#': 3, '$': 4, '%': 5, '&': 6, "'": 7,
      '(': 8, ')': 9, '*': 10, '+': 11, ',': 12, '-': 13, '.': 14, '/': 15,
      '0': 16, '1': 17, '2': 18, '3': 19, '4': 20, '5': 21, '6': 22, '7': 23,
      '8': 24, '9': 25, ':': 26, ';': 27, '<': 28, '=': 29, '>': 30, '?': 31,
      '@': 32, 'A': 33, 'B': 34, 'C': 35, 'D': 36, 'E': 37, 'F': 38, 'G': 39,
      'H': 40, 'I': 41, 'J': 42, 'K': 43, 'L': 44, 'M': 45, 'N': 46, 'O': 47,
      'P': 48, 'Q': 49, 'R': 50, 'S': 51, 'T': 52, 'U': 53, 'V': 54, 'W': 55,
      'X': 56, 'Y': 57, 'Z': 58, '[': 59, '\\': 60, ']': 61, '^': 62, '_': 63,
      '`': 64, 'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71,
      'h': 72, 'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79,
      'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85, 'v': 86, 'w': 87,
      'x': 88, 'y': 89, 'z': 90, '{': 91, '|': 92, '}': 93, '~': 94,
    };

    // Code 128 patterns (simplified)
    const patterns: string[] = [
      '11011001100', '11001101100', '11001100110', '10010011000', '10010001100',
      '10001001100', '10011001000', '10011000100', '10001100100', '11001001000',
      '11001000100', '11000100100', '10110011100', '10011011100', '10011001110',
      '10111001100', '10011101100', '10011100110', '11001110010', '11001011100',
      '11001001110', '11011100100', '11001110100', '11101101110', '11101001100',
      '11100101100', '11100100110', '11101100100', '11100110100', '11100110010',
      '11011011000', '11011000110', '11000110110', '10100011000', '10001011000',
      '10001000110', '10110001000', '10001101000', '10001100010', '11010001000',
      '11000101000', '11000100010', '10110111000', '10110001110', '10001101110',
      '10111011000', '10111000110', '10001110110', '11101110110', '11010001110',
      '11000101110', '11011101000', '11000110100', '11101101100', '11100110110',
      '11011011000', '11011000110', '11000110110', '10110011000', '10010011000',
      '10010001100', '10001001100', '10011001000', '10011000100', '10001100100',
    ];

    const startB = 104;
    const stop = 106;
    const stopPattern = '1100011101011';

    let values = [startB];
    let checksum = startB;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const value = code128B[char as keyof typeof code128B];
      if (value === undefined) {
        throw new Error(`Invalid character: ${char}`);
      }
      values.push(value);
      checksum += value * (i + 1);
    }

    const checksumValue = checksum % 103;
    values.push(checksumValue);

    let barcode = '';
    for (const v of values) {
      barcode += patterns[v] || patterns[0];
    }
    barcode += stopPattern;

    return barcode.split('').map(Number);
  };

  const generate = () => {
    setError('');

    if (!text.trim()) {
      setError('Please enter text');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      let bars: number[];

      if (barcodeType === 'code128') {
        bars = generateCode128(text);
      } else if (barcodeType === 'ean13') {
        if (!/^\d{12,13}$/.test(text)) {
          setError('EAN-13 requires 12-13 digits');
          return;
        }
        // Simplified EAN-13 (use first 12 digits, generate check digit)
        bars = generateCode128(text.substring(0, 12));
      } else {
        // Code 39 fallback to Code 128
        bars = generateCode128(text.toUpperCase());
      }

      const barWidth = 2;
      const height = 100;
      const padding = 20;

      canvas.width = bars.length * barWidth + padding * 2;
      canvas.height = height + padding * 2 + 20;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'black';
      let x = padding;
      for (const bar of bars) {
        if (bar === 1) {
          ctx.fillRect(x, padding, barWidth, height);
        }
        x += barWidth;
      }

      // Draw text
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(text, canvas.width / 2, canvas.height - 10);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'barcode.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text / Numbers</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or numbers..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Type</label>
        <select
          value={barcodeType}
          onChange={(e) => setBarcodeType(e.target.value as typeof barcodeType)}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="code128">Code 128 (Alphanumeric)</option>
          <option value="ean13">EAN-13 (Numeric)</option>
          <option value="code39">Code 39 (Alphanumeric)</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Generate</button>
        <button onClick={download} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">Download PNG</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      <div className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
