'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function PercentageCalculatorClient() {
  const [calc1, setCalc1] = useState({ percent: '', of: '', result: '' });
  const [calc2, setCalc2] = useState({ value: '', total: '', result: '' });
  const [calc3, setCalc3] = useState({ from: '', to: '', result: '' });

  const calculate1 = () => {
    const percent = parseFloat(calc1.percent);
    const of = parseFloat(calc1.of);
    if (!isNaN(percent) && !isNaN(of)) {
      const result = (percent / 100) * of;
      setCalc1({ ...calc1, result: result.toFixed(2) });
    }
  };

  const calculate2 = () => {
    const value = parseFloat(calc2.value);
    const total = parseFloat(calc2.total);
    if (!isNaN(value) && !isNaN(total) && total !== 0) {
      const result = (value / total) * 100;
      setCalc2({ ...calc2, result: result.toFixed(2) });
    }
  };

  const calculate3 = () => {
    const from = parseFloat(calc3.from);
    const to = parseFloat(calc3.to);
    if (!isNaN(from) && !isNaN(to) && from !== 0) {
      const result = ((to - from) / from) * 100;
      setCalc3({ ...calc3, result: result.toFixed(2) });
    }
  };

  return (
    <div className="space-y-8">
      {/* Calculator 1: X% of Y */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">What is X% of Y?</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={calc1.percent}
            onChange={(e) => setCalc1({ ...calc1, percent: e.target.value })}
            placeholder="X"
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <span className="text-sm text-gray-600">% of</span>
          <input
            type="number"
            value={calc1.of}
            onChange={(e) => setCalc1({ ...calc1, of: e.target.value })}
            placeholder="Y"
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <button onClick={calculate1} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">=</button>
          {calc1.result && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">{calc1.result}</span>
              <CopyButton text={calc1.result} />
            </div>
          )}
        </div>
      </div>

      {/* Calculator 2: X is what % of Y */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">X is what % of Y?</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={calc2.value}
            onChange={(e) => setCalc2({ ...calc2, value: e.target.value })}
            placeholder="X"
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <span className="text-sm text-gray-600">is what % of</span>
          <input
            type="number"
            value={calc2.total}
            onChange={(e) => setCalc2({ ...calc2, total: e.target.value })}
            placeholder="Y"
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <button onClick={calculate2} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">=</button>
          {calc2.result && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">{calc2.result}%</span>
              <CopyButton text={calc2.result + '%'} />
            </div>
          )}
        </div>
      </div>

      {/* Calculator 3: Percentage change */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Percentage Change (From X to Y)</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">From</span>
          <input
            type="number"
            value={calc3.from}
            onChange={(e) => setCalc3({ ...calc3, from: e.target.value })}
            placeholder="X"
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <span className="text-sm text-gray-600">to</span>
          <input
            type="number"
            value={calc3.to}
            onChange={(e) => setCalc3({ ...calc3, to: e.target.value })}
            placeholder="Y"
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <button onClick={calculate3} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">=</button>
          {calc3.result && (
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${parseFloat(calc3.result) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(calc3.result) >= 0 ? '+' : ''}{calc3.result}%
              </span>
              <CopyButton text={calc3.result + '%'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
