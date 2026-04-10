'use client';

import { useState } from 'react';

interface Segment {
  highlight: boolean;
  text: string;
}

function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) || [];
}

function computeDiff(tokensA: string[], tokensB: string[]): { type: 'unchanged' | 'removed' | 'added'; text: string }[] {
  const m = tokensA.length;
  const n = tokensB.length;
  const lcs: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (tokensA[i - 1] === tokensB[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  let i = m, j = n;
  const result: { type: 'unchanged' | 'removed' | 'added'; text: string }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
      result.push({ type: 'unchanged', text: tokensA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      result.push({ type: 'added', text: tokensB[j - 1] });
      j--;
    } else if (i > 0) {
      result.push({ type: 'removed', text: tokensA[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

function buildSegments(text1: string, text2: string): { original: Segment[]; modified: Segment[] } {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  const diff = computeDiff(tokens1, tokens2);

  const original: Segment[] = [];
  const modified: Segment[] = [];

  for (const token of diff) {
    if (token.type === 'unchanged') {
      original.push({ highlight: false, text: token.text });
      modified.push({ highlight: false, text: token.text });
    } else if (token.type === 'removed') {
      original.push({ highlight: true, text: token.text });
    } else if (token.type === 'added') {
      modified.push({ highlight: true, text: token.text });
    }
  }

  const merge = (segs: Segment[]): Segment[] => {
    const result: Segment[] = [];
    for (const seg of segs) {
      if (result.length > 0 && result[result.length - 1].highlight === seg.highlight) {
        result[result.length - 1].text += seg.text;
      } else {
        result.push({ ...seg });
      }
    }
    return result;
  };

  return { original: merge(original), modified: merge(modified) };
}

export default function TextDifferenceCheckerClient() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [originalSegments, setOriginalSegments] = useState<Segment[]>([]);
  const [modifiedSegments, setModifiedSegments] = useState<Segment[]>([]);

  const compare = () => {
    if (!text1.trim() && !text2.trim()) return;
    const { original, modified } = buildSegments(text1, text2);
    setOriginalSegments(original);
    setModifiedSegments(modified);
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setOriginalSegments([]);
    setModifiedSegments([]);
  };

  const loadSample = () => {
    setText1('The quick brown fox jumps over the lazy dog.');
    setText2('The quick red fox jumps over the lazy cat.');
    setOriginalSegments([]);
    setModifiedSegments([]);
  };

  return (
    <div className="space-y-6">
      {/* Input Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Original Text</label>
            <button onClick={loadSample} className="text-sm text-blue-600 hover:text-blue-700">
              Load Sample
            </button>
          </div>
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

      {/* Diff Output */}
      {originalSegments.length > 0 && modifiedSegments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Original Text</label>
            <div className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg min-h-[80px] whitespace-pre-wrap break-words">
              {originalSegments.map((seg, index) => (
                <span
                  key={index}
                  className={seg.highlight ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : ''}
                >
                  {seg.text}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modified Text</label>
            <div className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg min-h-[80px] whitespace-pre-wrap break-words">
              {modifiedSegments.map((seg, index) => (
                <span
                  key={index}
                  className={seg.highlight ? 'bg-yellow-200 text-yellow-900 rounded px-0.5' : ''}
                >
                  {seg.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
