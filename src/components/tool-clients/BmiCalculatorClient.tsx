'use client';

import { useState } from 'react';

export default function BmiCalculatorClient() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    color: string;
    healthyRange: { min: number; max: number };
  } | null>(null);

  const calculate = () => {
    let weightKg: number;
    let heightM: number;

    if (unit === 'metric') {
      weightKg = parseFloat(weight);
      heightM = parseFloat(height) / 100;
    } else {
      weightKg = parseFloat(weight) * 0.453592; // lbs to kg
      const totalInches = parseFloat(heightFeet) * 12 + parseFloat(heightInches);
      heightM = totalInches * 0.0254; // inches to meters
    }

    if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
      alert('Please enter valid weight and height');
      return;
    }

    const bmi = weightKg / (heightM * heightM);

    let category: string;
    let color: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600';
    } else if (bmi < 25) {
      category = 'Normal weight';
      color = 'text-green-600';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-600';
    } else {
      category = 'Obese';
      color = 'text-red-600';
    }

    // Calculate healthy weight range
    const healthyRange = {
      min: 18.5 * heightM * heightM,
      max: 24.9 * heightM * heightM,
    };

    setResult({ bmi, category, color, healthyRange });
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            unit === 'metric'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Metric
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            unit === 'imperial'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Imperial
        </button>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight ({unit === 'metric' ? 'kg' : 'lbs'})
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Height {unit === 'metric' ? '(cm)' : ''}
        </label>
        {unit === 'metric' ? (
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g., 175"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                placeholder="Feet"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                placeholder="Inches"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Calculate BMI
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* BMI Score */}
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <p className="text-5xl font-bold text-gray-800">{result.bmi.toFixed(1)}</p>
            <p className={`text-lg font-medium mt-2 ${result.color}`}>{result.category}</p>
          </div>

          {/* BMI Scale */}
          <div className="space-y-1">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="flex-1 bg-blue-400" title="Underweight (<18.5)" />
              <div className="flex-1 bg-green-400" title="Normal (18.5-24.9)" />
              <div className="flex-1 bg-yellow-400" title="Overweight (25-29.9)" />
              <div className="flex-1 bg-red-400" title="Obese (30+)" />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>

          {/* Healthy Weight Range */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              For your height, a healthy weight range is{' '}
              <strong>
                {unit === 'metric'
                  ? `${result.healthyRange.min.toFixed(1)} - ${result.healthyRange.max.toFixed(1)} kg`
                  : `${(result.healthyRange.min * 2.205).toFixed(1)} - ${(result.healthyRange.max * 2.205).toFixed(1)} lbs`}
              </strong>
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center">
            BMI is a general indicator and may not be accurate for athletes or the elderly.
          </p>
        </div>
      )}
    </div>
  );
}
