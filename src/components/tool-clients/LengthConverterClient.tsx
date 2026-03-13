'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

const lengthUnits: Record<string, { name: string; toMeters: number }> = {
  millimeters: { name: 'Millimeters', toMeters: 0.001 },
  centimeters: { name: 'Centimeters', toMeters: 0.01 },
  meters: { name: 'Meters', toMeters: 1 },
  kilometers: { name: 'Kilometers', toMeters: 1000 },
  inches: { name: 'Inches', toMeters: 0.0254 },
  feet: { name: 'Feet', toMeters: 0.3048 },
  yards: { name: 'Yards', toMeters: 0.9144 },
  miles: { name: 'Miles', toMeters: 1609.34 },
  nautical_miles: { name: 'Nautical Miles', toMeters: 1852 },
  micrometers: { name: 'Micrometers', toMeters: 0.000001 },
};

export default function LengthConverterClient() {
  const [inputValue, setInputValue] = useState('1');
  const [inputUnit, setInputUnit] = useState('meters');
  const [results, setResults] = useState<Record<string, string>>({});

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResults({});
      return;
    }

    const inputToMeters = lengthUnits[inputUnit].toMeters;
    const valueInMeters = value * inputToMeters;

    const newResults: Record<string, string> = {};
    for (const [key, unit] of Object.entries(lengthUnits)) {
      if (key !== inputUnit) {
        const converted = valueInMeters / unit.toMeters;
        newResults[key] = formatNumber(converted);
      }
    }
    setResults(newResults);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return num.toExponential(4);
    } else if (num >= 1) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
    } else if (num >= 0.0001) {
      return num.toFixed(6);
    } else {
      return num.toExponential(4);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(lengthUnits).map(([key, unit]) => (
              <option key={key} value={key}>{unit.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Convert Button */}
      <button
        onClick={convert}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Convert
      </button>

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {inputValue} {lengthUnits[inputUnit].name} equals:
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-800">{value}</span>
                  <span className="text-sm text-gray-500 ml-2">{lengthUnits[key].name}</span>
                </div>
                <CopyButton text={`${value} ${lengthUnits[key].name}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download All Results */}
      {Object.keys(results).length > 0 && (
        <div className="mt-2">
          <DownloadButton
            content={`${inputValue} ${lengthUnits[inputUnit].name} equals:\n${Object.entries(results).map(([key, value]) => `- ${value} ${lengthUnits[key].name}`).join('\n')}`}
            filename="length-conversion.txt"
          />
        </div>
      )}

      {/* Common Conversions */}
      <div className="text-sm text-gray-500">
        <p className="font-medium mb-2">Common Conversions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>1 inch = 2.54 centimeters</li>
          <li>1 foot = 12 inches = 30.48 centimeters</li>
          <li>1 yard = 3 feet = 0.9144 meters</li>
          <li>1 mile = 1.60934 kilometers</li>
        </ul>
      </div>
    </div>
  );
}
