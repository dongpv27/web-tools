'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

const timeUnits: Record<string, { name: string; toSeconds: number }> = {
  milliseconds: { name: 'Milliseconds', toSeconds: 0.001 },
  seconds: { name: 'Seconds', toSeconds: 1 },
  minutes: { name: 'Minutes', toSeconds: 60 },
  hours: { name: 'Hours', toSeconds: 3600 },
  days: { name: 'Days', toSeconds: 86400 },
  weeks: { name: 'Weeks', toSeconds: 604800 },
  months: { name: 'Months (30 days)', toSeconds: 2592000 },
  years: { name: 'Years (365 days)', toSeconds: 31536000 },
};

export default function TimeConverterClient() {
  const [inputValue, setInputValue] = useState('1');
  const [inputUnit, setInputUnit] = useState('hours');
  const [results, setResults] = useState<Record<string, string>>({});

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResults({});
      return;
    }

    const inputToSeconds = timeUnits[inputUnit].toSeconds;
    const valueInSeconds = value * inputToSeconds;

    const newResults: Record<string, string> = {};
    for (const [key, unit] of Object.entries(timeUnits)) {
      if (key !== inputUnit) {
        const converted = valueInSeconds / unit.toSeconds;
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
            {Object.entries(timeUnits).map(([key, unit]) => (
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
            {inputValue} {timeUnits[inputUnit].name} equals:
          </label>
          <div className="space-y-2">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-800">{value}</span>
                  <span className="text-sm text-gray-500 ml-2">{timeUnits[key].name}</span>
                </div>
                <CopyButton text={`${value} ${timeUnits[key].name}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Conversions */}
      <div className="text-sm text-gray-500">
        <p className="font-medium mb-2">Common Conversions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>1 hour = 60 minutes = 3,600 seconds</li>
          <li>1 day = 24 hours = 1,440 minutes</li>
          <li>1 week = 7 days = 168 hours</li>
          <li>1 year = 365 days = 8,760 hours</li>
        </ul>
      </div>
    </div>
  );
}
