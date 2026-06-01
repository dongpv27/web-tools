'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Code 128 ──────────────────────────────────────────────────────────────
// Subset B (printable ASCII). Suitable for general alphanumeric text.
const CODE128B: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  // 95 printable ASCII chars starting at space → values 0..94
  for (let i = 0; i < 95; i++) map[String.fromCharCode(32 + i)] = i;
  return map;
})();

const CODE128_PATTERNS = [
  '11011001100','11001101100','11001100110','10010011000','10010001100',
  '10001001100','10011001000','10011000100','10001100100','11001001000',
  '11001000100','11000100100','10110011100','10011011100','10011001110',
  '10111001100','10011101100','10011100110','11001110010','11001011100',
  '11001001110','11011100100','11001110100','11101101110','11101001100',
  '11100101100','11100100110','11101100100','11100110100','11100110010',
  '11011011000','11011000110','11000110110','10100011000','10001011000',
  '10001000110','10110001000','10001101000','10001100010','11010001000',
  '11000101000','11000100010','10110111000','10110001110','10001101110',
  '10111011000','10111000110','10001110110','11101110110','11010001110',
  '11000101110','11011101000','11011100010','11011101110','11101011000',
  '11101000110','11100010110','11101101000','11101100010','11100011010',
  '11101111010','11001000010','11110001010','10100110000','10100001100',
  '10010110000','10010000110','10000101100','10000100110','10110010000',
  '10110000100','10011010000','10011000010','10000110100','10000110010',
  '11000010010','11001010000','11110111010','11000010100','10001111010',
  '10100111100','10010111100','10010011110','10111100100','10011110100',
  '10011110010','11110100100','11110010100','11110010010','11011011110',
  '11011110110','11110110110','10101111000','10100011110','10001011110',
  '10111101000','10111100010','11110101000','11110100010','10111011110',
  '10111101110','11101011110','11110101110','11010000100','11010010000',
  '11010011100','1100011101011',
];

function code128B(text: string): { bars: number[]; error?: string } {
  const START_B = 104;
  const STOP = 106;
  const values: number[] = [START_B];
  let checksum = START_B;
  for (let i = 0; i < text.length; i++) {
    const v = CODE128B[text[i]];
    if (v === undefined) return { bars: [], error: `Code 128 doesn't support character "${text[i]}"` };
    values.push(v);
    checksum += v * (i + 1);
  }
  values.push(checksum % 103);
  values.push(STOP);
  return { bars: values.flatMap((v) => CODE128_PATTERNS[v].split('').map(Number)) };
}

// ─── Code 39 ───────────────────────────────────────────────────────────────
// 9-element encoding per char: 5 bars + 4 spaces. Each element is narrow (1)
// or wide (3). A '0' in the pattern below = narrow, '1' = wide. Inter-character
// gap is a narrow space. Start/stop is the '*' character.
const CODE39_PATTERNS: Record<string, string> = {
  '0': '000110100','1': '100100001','2': '001100001','3': '101100000','4': '000110001',
  '5': '100110000','6': '001110000','7': '000100101','8': '100100100','9': '001100100',
  'A': '100001001','B': '001001001','C': '101001000','D': '000011001','E': '100011000',
  'F': '001011000','G': '000001101','H': '100001100','I': '001001100','J': '000011100',
  'K': '100000011','L': '001000011','M': '101000010','N': '000010011','O': '100010010',
  'P': '001010010','Q': '000000111','R': '100000110','S': '001000110','T': '000010110',
  'U': '110000001','V': '011000001','W': '111000000','X': '010010001','Y': '110010000',
  'Z': '011010000','-': '010000101','.': '110000100',' ': '011000100','$': '010101000',
  '/': '010100010','+': '010001010','%': '000101010','*': '010010100',
};

function code39(text: string): { bars: number[]; error?: string } {
  // Code 39 is case-insensitive against its uppercase charset.
  const data = `*${text.toUpperCase()}*`;
  const out: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const pat = CODE39_PATTERNS[data[i]];
    if (!pat) return { bars: [], error: `Code 39 doesn't support character "${data[i]}"` };
    // Bars/spaces alternate starting with a bar; element width = narrow(1) or wide(3).
    for (let j = 0; j < 9; j++) {
      const isBar = j % 2 === 0;
      const width = pat[j] === '1' ? 3 : 1;
      for (let k = 0; k < width; k++) out.push(isBar ? 1 : 0);
    }
    // Inter-character gap: one narrow space (skip after the last char).
    if (i < data.length - 1) out.push(0);
  }
  return { bars: out };
}

// ─── EAN-13 ────────────────────────────────────────────────────────────────
// L-code, G-code, R-code patterns + parity rules. 12 data digits + 1 check
// digit. The first digit is implicit and chosen by the parity pattern of the
// next 6 digits, not encoded directly.
const EAN_L: Record<string, string> = {
  '0':'0001101','1':'0011001','2':'0010011','3':'0111101','4':'0100011',
  '5':'0110001','6':'0101111','7':'0111011','8':'0110111','9':'0001011',
};
const EAN_G: Record<string, string> = {
  '0':'0100111','1':'0110011','2':'0011011','3':'0100001','4':'0011101',
  '5':'0111001','6':'0000101','7':'0010001','8':'0001001','9':'0010111',
};
const EAN_R: Record<string, string> = {
  '0':'1110010','1':'1100110','2':'1101100','3':'1000010','4':'1011100',
  '5':'1001110','6':'1010000','7':'1000100','8':'1001000','9':'1110100',
};
// Parity table indexed by the first digit. 'L'=L-code, 'G'=G-code.
const EAN_PARITY: string[] = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];

function ean13Checksum(digits12: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(digits12[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}

function ean13(input: string): { bars: number[]; error?: string; rendered?: string } {
  if (!/^\d{12,13}$/.test(input)) return { bars: [], error: 'EAN-13 requires 12 or 13 digits.' };
  let digits = input;
  if (digits.length === 12) {
    digits += String(ean13Checksum(digits));
  } else {
    const expected = ean13Checksum(digits.slice(0, 12));
    if (Number(digits[12]) !== expected) {
      return { bars: [], error: `Invalid check digit. Expected ${expected}, got ${digits[12]}. For a 12-digit input we'd compute it automatically.` };
    }
  }
  const first = digits[0];
  const parity = EAN_PARITY[Number(first)];
  let bin = '101'; // start guard
  // Left half: 6 digits using L/G per parity table.
  for (let i = 0; i < 6; i++) {
    const d = digits[1 + i];
    bin += parity[i] === 'L' ? EAN_L[d] : EAN_G[d];
  }
  bin += '01010'; // center guard
  // Right half: 6 digits with R-code.
  for (let i = 0; i < 6; i++) {
    bin += EAN_R[digits[7 + i]];
  }
  bin += '101'; // end guard
  return { bars: bin.split('').map(Number), rendered: digits };
}

// ─── Component ─────────────────────────────────────────────────────────────
type BarcodeType = 'code128' | 'ean13' | 'code39';

export default function BarcodeGeneratorClient() {
  const [text, setText] = useState('123456789012');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('code128');
  const [error, setError] = useState('');
  const [renderedLabel, setRenderedLabel] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(() => {
    setError('');
    setRenderedLabel('');
    if (!text.trim()) {
      setError('Please enter text');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars: number[] = [];
    let label = text;
    let err: string | undefined;

    if (barcodeType === 'code128') {
      ({ bars, error: err } = code128B(text));
    } else if (barcodeType === 'code39') {
      ({ bars, error: err } = code39(text));
      label = text.toUpperCase();
    } else {
      const r = ean13(text);
      bars = r.bars;
      err = r.error;
      if (r.rendered) label = r.rendered;
    }

    if (err) { setError(err); return; }
    setRenderedLabel(label);

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
      if (bar === 1) ctx.fillRect(x, padding, barWidth, height);
      x += barWidth;
    }
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, canvas.width / 2, canvas.height - 10);
  }, [text, barcodeType]);

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
  }, [generate]);

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
          onChange={(e) => setBarcodeType(e.target.value as BarcodeType)}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="code128">Code 128 (full ASCII)</option>
          <option value="ean13">EAN-13 (12 or 13 digits, check digit auto-computed)</option>
          <option value="code39">Code 39 (0-9 A-Z and -.$/+%) — start/stop *)</option>
        </select>
        {barcodeType === 'code39' && (
          <p className="mt-1 text-xs text-gray-500">Letters are normalised to uppercase. Supported: 0-9 A-Z space - . $ / + %</p>
        )}
        {barcodeType === 'ean13' && renderedLabel && renderedLabel !== text && (
          <p className="mt-1 text-xs text-gray-500">Check digit appended: <code className="font-mono">{renderedLabel}</code></p>
        )}
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
