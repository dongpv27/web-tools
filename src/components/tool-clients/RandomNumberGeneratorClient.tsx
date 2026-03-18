'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function RandomNumberGeneratorClient() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const numbers: number[] = [];
    const usedNumbers = new Set<number>();

    // Use crypto.getRandomValues() for cryptographically secure random numbers
    const generateSecureRandom = (minVal: number, maxVal: number): number => {
      const range = maxVal - minVal + 1;
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return minVal + (array[0] % range);
    };

    const maxIterations = Math.min(count * 10, (max - min + 1) * 100);
    let iterations = 0;

    while (numbers.length < count && iterations < maxIterations) {
      iterations++;
      const num = generateSecureRandom(min, max);

      if (allowDuplicates || !usedNumbers.has(num)) {
        numbers.push(num);
        usedNumbers.add(num);
      }
    }

    setResults(numbers);
  };

  const clear = () => {
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Minimum</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Maximum</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={allowDuplicates}
          onChange={(e) => setAllowDuplicates(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">Allow duplicate numbers</span>
      </label>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Generated Numbers</span>
            <div className="flex gap-2">
              <CopyButton text={results.join('\n')} />
              <DownloadButton content={results.join('\n')} filename="numbers.txt" />
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <span className="text-3xl font-bold text-blue-600">
              {results.join(', ')}
            </span>
          </div>

          {results.length > 1 && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-50 rounded text-center">
                <span className="text-gray-500">Sum:</span>{' '}
                <span className="font-medium">{results.reduce((a, b) => a + b, 0)}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center">
                <span className="text-gray-500">Average:</span>{' '}
                <span className="font-medium">
                  {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
