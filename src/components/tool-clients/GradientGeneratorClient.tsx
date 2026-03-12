'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function GradientGeneratorClient() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [colors, setColors] = useState(['#3B82F6', '#8B5CF6']);
  const [cssOutput, setCssOutput] = useState('');

  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, '#FFFFFF']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const generateCss = () => {
    const colorStops = colors.join(', ');
    let css = '';

    if (gradientType === 'linear') {
      css = `linear-gradient(${angle}deg, ${colorStops})`;
    } else {
      css = `radial-gradient(circle, ${colorStops})`;
    }

    setCssOutput(css);
  };

  const copyCss = () => {
    const fullCss = `background: ${cssOutput};`;
    navigator.clipboard.writeText(fullCss);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      {cssOutput && (
        <div
          className="w-full h-32 rounded-lg border border-gray-200"
          style={{ background: cssOutput }}
        />
      )}

      {/* Gradient Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => setGradientType('linear')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              gradientType === 'linear' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setGradientType('radial')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              gradientType === 'radial' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Radial
          </button>
        </div>
      </div>

      {/* Angle (for linear) */}
      {gradientType === 'linear' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Angle</label>
            <span className="text-sm text-gray-600">{angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}

      {/* Colors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Colors</label>
          {colors.length < 5 && (
            <button onClick={addColor} className="text-sm text-blue-600 hover:text-blue-700">
              + Add Color
            </button>
          )}
        </div>
        <div className="space-y-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md"
              />
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateCss}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate CSS
      </button>

      {/* Output */}
      {cssOutput && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">CSS</span>
            <div className="flex gap-2">
              <CopyButton text={`background: ${cssOutput};`} />
              <DownloadButton content={`background: ${cssOutput};`} filename="gradient.css" />
            </div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <code className="text-sm font-mono text-green-400 break-all">
              background: {cssOutput};
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
