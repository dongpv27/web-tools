'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function RandomColorGeneratorClient() {
  const [colors, setColors] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'hex' | 'rgb'>('hex');
  const [copied, setCopied] = useState(false);

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    if (format === 'hex') {
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const generate = () => {
    const newColors = [];
    for (let i = 0; i < count; i++) {
      newColors.push(generateRandomColor());
    }
    setColors(newColors);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(colors.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setColors([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Count</label>
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          >
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        🎨 Generate Random Colors
      </button>

      {/* Colors Display */}
      {colors.length > 0 && (
        <div className="space-y-4">
          {/* Color Strip */}
          <div className="flex h-16 rounded-lg overflow-hidden">
            {colors.map((color, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: format === 'hex' ? color : color }}
              />
            ))}
          </div>

          {/* Color List */}
          <div className="space-y-2">
            {colors.map((color, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div
                  className="w-10 h-10 rounded border border-gray-200"
                  style={{ backgroundColor: format === 'hex' ? color : color }}
                />
                <code className="flex-1 text-sm font-mono">{color}</code>
                <CopyButton text={color} />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={copyAll} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              copied ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-green-600 text-white hover:bg-green-700'
            }`}>{copied ? 'Copied!' : 'Copy All'}</button>
            <DownloadButton content={colors.join('\n')} filename="colors.txt" />
            <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}
