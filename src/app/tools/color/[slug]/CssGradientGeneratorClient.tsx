'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

interface ColorStop {
  color: string;
  position: number;
}

export default function CssGradientGeneratorClient() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#3B82F6', position: 0 },
    { color: '#8B5CF6', position: 100 },
  ]);
  const [cssOutput, setCssOutput] = useState('');

  const generateCss = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stops = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

    let gradient: string;
    if (gradientType === 'linear') {
      gradient = `linear-gradient(${angle}deg, ${stops})`;
    } else if (gradientType === 'radial') {
      gradient = `radial-gradient(circle, ${stops})`;
    } else {
      gradient = `conic-gradient(from ${angle}deg, ${stops})`;
    }

    setCssOutput(`background: ${gradient};`);
    return gradient;
  };

  const addColorStop = () => {
    const newPosition = 50;
    setColorStops([...colorStops, { color: '#000000', position: newPosition }]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  };

  const updateColorStop = (index: number, updates: Partial<ColorStop>) => {
    const newStops = [...colorStops];
    newStops[index] = { ...newStops[index], ...updates };
    setColorStops(newStops);
  };

  const previewGradient = generateCss();

  const presets = [
    { name: 'Sunset', stops: [{ color: '#FF512F', position: 0 }, { color: '#DD2476', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#134E5E', position: 0 }, { color: '#71B280', position: 100 }] },
    { name: 'Purple', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }] },
    { name: 'Cool', stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] },
  ];

  const loadPreset = (preset: typeof presets[0]) => {
    setColorStops(preset.stops);
    setGradientType('linear');
    setAngle(90);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div
        className="h-32 rounded-lg border border-gray-200"
        style={{ background: previewGradient.replace('background: ', '').replace(';', '') }}
      />

      {/* Gradient Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <div className="flex gap-2">
          {(['linear', 'radial', 'conic'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setGradientType(type)}
              className={`px-4 py-2 text-sm rounded-lg capitalize ${
                gradientType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Angle (for linear and conic) */}
      {(gradientType === 'linear' || gradientType === 'conic') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Angle: {angle}deg</label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Color Stops */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Color Stops</label>
          <button
            onClick={addColorStop}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3">
          {colorStops.map((stop, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateColorStop(index, { color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateColorStop(index, { color: e.target.value })}
                className="w-24 px-2 py-1 text-sm font-mono border border-gray-300 rounded"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateColorStop(index, { position: Number(e.target.value) })}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-sm text-gray-500">%</span>
              {colorStops.length > 2 && (
                <button
                  onClick={() => removeColorStop(index)}
                  className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50"
              style={{
                background: `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">CSS Code</label>
          <CopyButton text={cssOutput} />
        </div>
        <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto">
          {cssOutput}
        </pre>
      </div>
    </div>
  );
}
