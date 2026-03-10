'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export default function TextDifferenceCheckerClient() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<DiffResult[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });

  const computeDiff = (a: string[], b: string[]): DiffResult[] => {
    const result: DiffResult[] = [];
    const m = a.length;
    const n = b.length;

    // Simple LCS-based diff
    const lcs: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
        }
      }
    }

    // Backtrack to find diff
    let i = m, j = n;
    const tempResult: DiffResult[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        tempResult.push({ type: 'unchanged', text: a[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        tempResult.push({ type: 'added', text: b[j - 1] });
        j--;
      } else if (i > 0) {
        tempResult.push({ type: 'removed', text: a[i - 1] });
        i--;
      }
    }

    return tempResult.reverse();
  };

  const compare = () => {
    if (!text1.trim() && !text2.trim()) return;

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    const diffResult = computeDiff(lines1, lines2);
    setDiff(diffResult);

    setStats({
      added: diffResult.filter(d => d.type === 'added').length,
      removed: diffResult.filter(d => d.type === 'removed').length,
      unchanged: diffResult.filter(d => d.type === 'unchanged').length,
    });
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiff([]);
    setStats({ added: 0, removed: 0, unchanged: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Input Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Text</label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter original text..."
            rows={8}
            className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modified Text</label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter modified text..."
            rows={8}
            className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={compare}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Compare
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Stats */}
      {diff.length > 0 && (
        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded">
            {stats.removed} removed
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
            {stats.added} added
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">
            {stats.unchanged} unchanged
          </span>
        </div>
      )}

      {/* Diff Output */}
      {diff.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Differences</label>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
            {diff.map((item, index) => (
              <div
                key={index}
                className={`py-1 ${
                  item.type === 'added'
                    ? 'bg-green-900/30 text-green-400'
                    : item.type === 'removed'
                    ? 'bg-red-900/30 text-red-400 line-through'
                    : 'text-gray-400'
                }`}
              >
                <span className="mr-2 opacity-50">
                  {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                </span>
                {item.text || '(empty line)'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
