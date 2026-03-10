'use client';

import { useState } from 'react';

export default function CoinFlipClient() {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);

  const flip = () => {
    setIsFlipping(true);

    // Animation delay
    setTimeout(() => {
      const flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(flipResult);
      setHistory(prev => [flipResult, ...prev].slice(0, 20) as ('heads' | 'tails')[]);
      setIsFlipping(false);
    }, 500);
  };

  const clear = () => {
    setResult(null);
    setHistory([]);
  };

  const headsCount = history.filter(h => h === 'heads').length;
  const tailsCount = history.filter(h => h === 'tails').length;

  return (
    <div className="space-y-6">
      {/* Coin Display */}
      <div className="flex justify-center">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 ${
            isFlipping
              ? 'animate-spin bg-gray-400'
              : result === 'heads'
              ? 'bg-yellow-400 text-yellow-900'
              : result === 'tails'
              ? 'bg-gray-300 text-gray-700'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {isFlipping ? '🪙' : result ? (result === 'heads' ? '👑' : '🦅') : '?'}
        </div>
      </div>

      {/* Result Text */}
      {result && !isFlipping && (
        <div className="text-center">
          <span className={`text-3xl font-bold ${result === 'heads' ? 'text-yellow-600' : 'text-gray-600'}`}>
            {result.toUpperCase()}!
          </span>
        </div>
      )}

      {/* Flip Button */}
      <button
        onClick={flip}
        disabled={isFlipping}
        className="w-full px-4 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isFlipping ? 'Flipping...' : '🪙 Flip Coin'}
      </button>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{headsCount}</p>
              <p className="text-xs text-gray-500">Heads</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{tailsCount}</p>
              <p className="text-xs text-gray-500">Tails</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{history.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>

          {history.length > 1 && (
            <div className="flex gap-1 h-4 overflow-hidden rounded-full">
              <div
                className="bg-yellow-400"
                style={{ width: `${(headsCount / history.length) * 100}%` }}
              />
              <div
                className="bg-gray-300"
                style={{ width: `${(tailsCount / history.length) * 100}%` }}
              />
            </div>
          )}

          <button
            onClick={clear}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset Statistics
          </button>
        </div>
      )}
    </div>
  );
}
