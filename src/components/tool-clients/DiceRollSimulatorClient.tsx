'use client';

import { useState } from 'react';

export default function DiceRollSimulatorClient() {
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<{ rolls: number[]; total: number }[]>([]);

  const roll = () => {
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }
    setResults(rolls);
    setHistory(prev => [{ rolls, total: rolls.reduce((a, b) => a + b, 0) }, ...prev].slice(0, 10));
  };

  const clear = () => {
    setResults([]);
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Number of Dice</label>
          <select
            value={diceCount}
            onChange={(e) => setDiceCount(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Dice Sides</label>
          <select
            value={diceSides}
            onChange={(e) => setDiceSides(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[4, 6, 8, 10, 12, 20].map(n => (
              <option key={n} value={n}>D{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roll Button */}
      <button
        onClick={roll}
        className="w-full px-4 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        🎲 Roll {diceCount}D{diceSides}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            {results.map((roll, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-800 shadow-md"
              >
                {roll}
              </div>
            ))}
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-500">Total: </span>
            <span className="text-2xl font-bold text-blue-600">
              {results.reduce((a, b) => a + b, 0)}
            </span>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Roll History</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((entry, i) => (
              <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <span>[{entry.rolls.join(', ')}]</span>
                <span className="font-medium">= {entry.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear History
        </button>
      )}
    </div>
  );
}
