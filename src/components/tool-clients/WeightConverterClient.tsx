'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

const weightUnits: Record<string, { name: string; toKg: number }> = {
  milligrams: { name: 'Milligrams', toKg: 0.000001 },
  grams: { name: 'Grams', toKg: 0.001 },
  kilograms: { name: 'Kilograms', toKg: 1 },
  metric_tons: { name: 'Metric Tons', toKg: 1000 },
  ounces: { name: 'Ounces (oz)', toKg: 0.0283495 },
  pounds: { name: 'Pounds (lb)', toKg: 0.453592 },
  stones: { name: 'Stones', toKg: 6.35029 },
  us_tons: { name: 'US Tons (short)', toKg: 907.185 },
  imperial_tons: { name: 'Imperial Tons (long)', toKg: 1016.05 },
};

export default function WeightConverterClient() {
  const [inputValue, setInputValue] = useState('1');
  const [inputUnit, setInputUnit] = useState('kilograms');
  const [results, setResults] = useState<Record<string, string>>({});

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResults({});
      return;
    }

    const inputToKg = weightUnits[inputUnit].toKg;
    const valueInKg = value * inputToKg;

    const newResults: Record<string, string> = {};
    for (const [key, unit] of Object.entries(weightUnits)) {
      if (key !== inputUnit) {
        const converted = valueInKg / unit.toKg;
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
            {Object.entries(weightUnits).map(([key, unit]) => (
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
            {inputValue} {weightUnits[inputUnit].name} equals:
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-800">{value}</span>
                  <span className="text-sm text-gray-500 ml-2">{weightUnits[key].name}</span>
                </div>
                <CopyButton text={`${value} ${weightUnits[key].name}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download All Results */}
      {Object.keys(results).length > 0 && (
        <div className="mt-2">
          <DownloadButton
            content={`${inputValue} ${weightUnits[inputUnit].name} equals:\n${Object.entries(results).map(([key, value]) => `- ${value} ${weightUnits[key].name}`).join('\n')}`}
            filename="weight-conversion.txt"
          />
        </div>
      )}

      {/* Common Conversions */}
      <div className="text-sm text-gray-500">
        <p className="font-medium mb-2">Common Conversions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>1 kilogram = 2.20462 pounds</li>
          <li>1 pound = 16 ounces</li>
          <li>1 stone = 14 pounds</li>
          <li>1 metric ton = 1,000 kilograms</li>
        </ul>
      </div>
    </div>
  );
}
