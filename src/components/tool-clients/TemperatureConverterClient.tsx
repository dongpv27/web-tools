'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

const units: Record<TemperatureUnit, { name: string; symbol: string }> = {
  celsius: { name: 'Celsius', symbol: '°C' },
  fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
  kelvin: { name: 'Kelvin', symbol: 'K' },
};

export default function TemperatureConverterClient() {
  const [inputValue, setInputValue] = useState('0');
  const [inputUnit, setInputUnit] = useState<TemperatureUnit>('celsius');
  const [results, setResults] = useState<Record<TemperatureUnit, string | null>>({
    celsius: null,
    fahrenheit: null,
    kelvin: null,
  });

  const toCelsius = (value: number, from: TemperatureUnit): number => {
    switch (from) {
      case 'celsius':
        return value;
      case 'fahrenheit':
        return (value - 32) * 5 / 9;
      case 'kelvin':
        return value - 273.15;
    }
  };

  const fromCelsius = (celsius: number, to: TemperatureUnit): number => {
    switch (to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return (celsius * 9 / 5) + 32;
      case 'kelvin':
        return celsius + 273.15;
    }
  };

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResults({ celsius: null, fahrenheit: null, kelvin: null });
      return;
    }

    const celsius = toCelsius(value, inputUnit);

    setResults({
      celsius: inputUnit !== 'celsius' ? fromCelsius(celsius, 'celsius').toFixed(2) : null,
      fahrenheit: inputUnit !== 'fahrenheit' ? fromCelsius(celsius, 'fahrenheit').toFixed(2) : null,
      kelvin: inputUnit !== 'kelvin' ? fromCelsius(celsius, 'kelvin').toFixed(2) : null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter temperature"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value as TemperatureUnit)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(units).map(([key, unit]) => (
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
      {(results.celsius || results.fahrenheit || results.kelvin) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {inputValue}{units[inputUnit].symbol} equals:
          </label>
          <div className="space-y-2">
            {Object.entries(results).map(([key, value]) => {
              if (value === null) return null;
              const unit = units[key as TemperatureUnit];
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-lg font-medium text-gray-800">{value}</span>
                    <span className="text-lg text-gray-500 ml-1">{unit.symbol}</span>
                    <span className="text-sm text-gray-400 ml-2">({unit.name})</span>
                  </div>
                  <CopyButton text={`${value}${unit.symbol}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Common Conversions */}
      <div className="text-sm text-gray-500">
        <p className="font-medium mb-2">Common Reference Points:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Water freezes: 0°C = 32°F = 273.15K</li>
          <li>Room temperature: 20°C = 68°F = 293.15K</li>
          <li>Body temperature: 37°C = 98.6°F = 310.15K</li>
          <li>Water boils: 100°C = 212°F = 373.15K</li>
        </ul>
      </div>
    </div>
  );
}
