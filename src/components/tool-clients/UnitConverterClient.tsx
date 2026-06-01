'use client';

import { useState, useEffect } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'speed' | 'time' | 'data' | 'pressure' | 'energy' | 'frequency';

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
  pressure: {
    name: 'Pressure',
    units: [
      // Base: Pascal (Pa). Factors convert each unit to Pascals.
      { value: 'pa', label: 'Pascal', factor: 1 },
      { value: 'kpa', label: 'Kilopascal', factor: 1000 },
      { value: 'mpa', label: 'Megapascal', factor: 1000000 },
      { value: 'bar', label: 'Bar', factor: 100000 },
      { value: 'atm', label: 'Atmosphere', factor: 101325 },
      { value: 'mmhg', label: 'mmHg (Torr)', factor: 133.322 },
      { value: 'psi', label: 'PSI', factor: 6894.76 },
    ],
  },
  energy: {
    name: 'Energy',
    units: [
      // Base: Joule (J).
      { value: 'j', label: 'Joule', factor: 1 },
      { value: 'kj', label: 'Kilojoule', factor: 1000 },
      { value: 'cal', label: 'Calorie', factor: 4.184 },
      { value: 'kcal', label: 'Kilocalorie', factor: 4184 },
      { value: 'wh', label: 'Watt-hour', factor: 3600 },
      { value: 'kwh', label: 'Kilowatt-hour', factor: 3600000 },
      { value: 'btu', label: 'BTU', factor: 1055.06 },
      { value: 'ev', label: 'Electronvolt', factor: 1.602176634e-19 },
    ],
  },
  frequency: {
    name: 'Frequency',
    units: [
      // Base: Hertz (Hz).
      { value: 'hz', label: 'Hertz', factor: 1 },
      { value: 'khz', label: 'Kilohertz', factor: 1000 },
      { value: 'mhz', label: 'Megahertz', factor: 1000000 },
      { value: 'ghz', label: 'Gigahertz', factor: 1000000000 },
      { value: 'thz', label: 'Terahertz', factor: 1000000000000 },
      { value: 'rpm', label: 'RPM (Revolutions/min)', factor: 1 / 60 },
    ],
  },
};

// Trim trailing zeros and unnecessary scientific notation for normal-range
// results. Falls back to toPrecision for extreme magnitudes.
function formatResult(n: number): string {
  if (!isFinite(n)) return 'Infinity';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) return n.toPrecision(8);
  // Up to 8 significant digits, then strip trailing zeros.
  return parseFloat(n.toPrecision(10)).toString();
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  // Real-time conversion: any input/unit change recomputes the result.
  useEffect(() => {
    const numValue = parseFloat(value);
    if (value === '' || isNaN(numValue)) {
      setResult('');
      return;
    }
    if (category === 'temperature') {
      let celsius: number;
      if (fromUnit === 'c') celsius = numValue;
      else if (fromUnit === 'f') celsius = (numValue - 32) * 5 / 9;
      else celsius = numValue - 273.15;
      let converted: number;
      if (toUnit === 'c') converted = celsius;
      else if (toUnit === 'f') converted = celsius * 9 / 5 + 32;
      else converted = celsius + 273.15;
      setResult(formatResult(converted));
    } else {
      const units = unitData[category].units;
      const fromFactor = units.find((u) => u.value === fromUnit)?.factor ?? 1;
      const toFactor = units.find((u) => u.value === toUnit)?.factor ?? 1;
      setResult(formatResult((numValue * fromFactor) / toFactor));
    }
  }, [value, fromUnit, toUnit, category]);

  const swap = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    if (result) setValue(result);
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
  const fromLabel = currentUnits.find((u) => u.value === fromUnit)?.label ?? '';
  const toLabel = currentUnits.find((u) => u.value === toUnit)?.label ?? '';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(unitData) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 text-sm rounded-full ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {unitData[cat].name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
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

        <button
          onClick={swap}
          className="px-3 py-2 mb-0 sm:mb-[2.4rem] text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors self-center sm:self-end"
          title="Swap units"
        >
          ⇄
        </button>

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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 font-mono"
          />
        </div>
      </div>

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-green-800">
              {value} {fromLabel} = <strong>{result}</strong> {toLabel}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <CopyButton text={result} />
              <DownloadButton content={`${value} ${fromLabel} = ${result} ${toLabel}`} filename="unit-conversion.txt" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
