'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'speed' | 'time' | 'data';

const unitData: Record<UnitCategory, { name: string; units: { value: string; label: string; factor: number }[] }> = {
  length: {
    name: 'Length',
    units: [
      { value: 'mm', label: 'Millimeter', factor: 0.001 },
      { value: 'cm', label: 'Centimeter', factor: 0.01 },
      { value: 'm', label: 'Meter', factor: 1 },
      { value: 'km', label: 'Kilometer', factor: 1000 },
      { value: 'in', label: 'Inch', factor: 0.0254 },
      { value: 'ft', label: 'Foot', factor: 0.3048 },
      { value: 'yd', label: 'Yard', factor: 0.9144 },
      { value: 'mi', label: 'Mile', factor: 1609.344 },
    ],
  },
  weight: {
    name: 'Weight',
    units: [
      { value: 'mg', label: 'Milligram', factor: 0.000001 },
      { value: 'g', label: 'Gram', factor: 0.001 },
      { value: 'kg', label: 'Kilogram', factor: 1 },
      { value: 't', label: 'Metric Ton', factor: 1000 },
      { value: 'oz', label: 'Ounce', factor: 0.0283495 },
      { value: 'lb', label: 'Pound', factor: 0.453592 },
    ],
  },
  temperature: {
    name: 'Temperature',
    units: [
      { value: 'c', label: 'Celsius', factor: 1 },
      { value: 'f', label: 'Fahrenheit', factor: 1 },
      { value: 'k', label: 'Kelvin', factor: 1 },
    ],
  },
  volume: {
    name: 'Volume',
    units: [
      { value: 'ml', label: 'Milliliter', factor: 0.001 },
      { value: 'l', label: 'Liter', factor: 1 },
      { value: 'gal', label: 'Gallon (US)', factor: 3.78541 },
      { value: 'qt', label: 'Quart', factor: 0.946353 },
      { value: 'pt', label: 'Pint', factor: 0.473176 },
      { value: 'cup', label: 'Cup', factor: 0.236588 },
      { value: 'floz', label: 'Fluid Ounce', factor: 0.0295735 },
    ],
  },
  area: {
    name: 'Area',
    units: [
      { value: 'mm2', label: 'Square Millimeter', factor: 0.000001 },
      { value: 'cm2', label: 'Square Centimeter', factor: 0.0001 },
      { value: 'm2', label: 'Square Meter', factor: 1 },
      { value: 'km2', label: 'Square Kilometer', factor: 1000000 },
      { value: 'ha', label: 'Hectare', factor: 10000 },
      { value: 'in2', label: 'Square Inch', factor: 0.00064516 },
      { value: 'ft2', label: 'Square Foot', factor: 0.092903 },
      { value: 'ac', label: 'Acre', factor: 4046.86 },
    ],
  },
  speed: {
    name: 'Speed',
    units: [
      { value: 'mps', label: 'Meters/second', factor: 1 },
      { value: 'kph', label: 'Km/hour', factor: 0.277778 },
      { value: 'mph', label: 'Miles/hour', factor: 0.44704 },
      { value: 'knot', label: 'Knot', factor: 0.514444 },
      { value: 'fps', label: 'Feet/second', factor: 0.3048 },
    ],
  },
  time: {
    name: 'Time',
    units: [
      { value: 'ms', label: 'Millisecond', factor: 0.001 },
      { value: 's', label: 'Second', factor: 1 },
      { value: 'min', label: 'Minute', factor: 60 },
      { value: 'h', label: 'Hour', factor: 3600 },
      { value: 'd', label: 'Day', factor: 86400 },
      { value: 'w', label: 'Week', factor: 604800 },
      { value: 'mo', label: 'Month (30d)', factor: 2592000 },
      { value: 'y', label: 'Year (365d)', factor: 31536000 },
    ],
  },
  data: {
    name: 'Data',
    units: [
      { value: 'b', label: 'Bit', factor: 0.125 },
      { value: 'B', label: 'Byte', factor: 1 },
      { value: 'KB', label: 'Kilobyte', factor: 1024 },
      { value: 'MB', label: 'Megabyte', factor: 1048576 },
      { value: 'GB', label: 'Gigabyte', factor: 1073741824 },
      { value: 'TB', label: 'Terabyte', factor: 1099511627776 },
    ],
  },
};

export default function UnitConverterClient() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const convert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('');
      return;
    }

    if (category === 'temperature') {
      // Special handling for temperature
      let celsius: number;

      // Convert to Celsius first
      if (fromUnit === 'c') celsius = numValue;
      else if (fromUnit === 'f') celsius = (numValue - 32) * 5/9;
      else celsius = numValue - 273.15; // Kelvin

      // Convert from Celsius to target
      let converted: number;
      if (toUnit === 'c') converted = celsius;
      else if (toUnit === 'f') converted = celsius * 9/5 + 32;
      else converted = celsius + 273.15; // Kelvin

      setResult(converted.toFixed(4));
    } else {
      // Standard factor-based conversion
      const units = unitData[category].units;
      const fromFactor = units.find(u => u.value === fromUnit)?.factor || 1;
      const toFactor = units.find(u => u.value === toUnit)?.factor || 1;

      const baseValue = numValue * fromFactor;
      const converted = baseValue / toFactor;

      setResult(converted.toFixed(6));
    }
  };

  const swap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setValue(result);
      setResult(value);
    }
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    const units = unitData[newCategory].units;
    setFromUnit(units[0].value);
    setToUnit(units[1].value);
    setValue('');
    setResult('');
  };

  const currentUnits = unitData[category].units;

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(unitData) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 text-sm rounded-full ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {unitData[cat].name}
            </button>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-2"
          >
            {currentUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-2"
          >
            {currentUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={result}
            readOnly
            placeholder="Result"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Convert</button>
        <button onClick={swap} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Swap</button>
      </div>

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-800">
              {value} {currentUnits.find(u => u.value === fromUnit)?.label} = <strong>{result}</strong> {currentUnits.find(u => u.value === toUnit)?.label}
            </span>
            <CopyButton text={result} />
          </div>
        </div>
      )}
    </div>
  );
}
