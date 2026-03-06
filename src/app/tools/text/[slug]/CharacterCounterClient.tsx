'use client';

import { useState, useMemo } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface CharStats {
  total: number;
  letters: number;
  numbers: number;
  spaces: number;
  punctuation: number;
  symbols: number;
  uppercase: number;
  lowercase: number;
  lines: number;
}

export default function CharacterCounterClient() {
  const [input, setInput] = useState('');

  const stats = useMemo<CharStats>(() => {
    const text = input;

    return {
      total: text.length,
      letters: (text.match(/[a-zA-Z]/g) || []).length,
      numbers: (text.match(/[0-9]/g) || []).length,
      spaces: (text.match(/\s/g) || []).length,
      punctuation: (text.match(/[.,!?;:'"()-]/g) || []).length,
      symbols: (text.match(/[^a-zA-Z0-9\s.,!?;:'"()-]/g) || []).length,
      uppercase: (text.match(/[A-Z]/g) || []).length,
      lowercase: (text.match(/[a-z]/g) || []).length,
      lines: text ? text.split('\n').length : 0,
    };
  }, [input]);

  const clearAll = () => {
    setInput('');
  };

  const loadSample = () => {
    setInput('Hello World! 123\nThis is a TEST sentence with UPPERCASE and lowercase letters.\nSymbols: @#$%^&*()');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Your Text</label>
          <button
            onClick={loadSample}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Start typing or paste your text here..."
          rows={6}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        <StatCard label="Total Characters" value={stats.total} highlight />
        <StatCard label="Letters" value={stats.letters} />
        <StatCard label="Numbers" value={stats.numbers} />
        <StatCard label="Spaces" value={stats.spaces} />
        <StatCard label="Punctuation" value={stats.punctuation} />
        <StatCard label="Symbols" value={stats.symbols} />
        <StatCard label="Uppercase" value={stats.uppercase} />
        <StatCard label="Lowercase" value={stats.lowercase} />
        <StatCard label="Lines" value={stats.lines} />
      </div>

      {/* Clear Button */}
      {input && (
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
