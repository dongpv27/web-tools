'use client';

import { useState, useMemo } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
}

export default function WordCounterClient() {
  const [input, setInput] = useState('');

  const stats = useMemo<TextStats>(() => {
    const text = input;

    // Characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Words
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    // Sentences
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;

    // Paragraphs
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

    // Lines
    const lines = text ? text.split('\n').length : 0;

    // Reading time (avg 200 words/min)
    const readingMinutes = Math.ceil(words / 200);
    const readingTime = readingMinutes < 1 ? '< 1 min' : `${readingMinutes} min`;

    // Speaking time (avg 150 words/min)
    const speakingMinutes = Math.ceil(words / 150);
    const speakingTime = speakingMinutes < 1 ? '< 1 min' : `${speakingMinutes} min`;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
    };
  }, [input]);

  const clearAll = () => {
    setInput('');
  };

  const loadSample = () => {
    setInput(`The quick brown fox jumps over the lazy dog. This is a sample paragraph that contains multiple sentences. It demonstrates the word counter functionality.

This is a second paragraph. It has some more text to show how the counter handles multiple paragraphs.

And here's a third one with a question? And an exclamation!`);
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
          rows={8}
        lineNumbers
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="Characters (no spaces)" value={stats.charactersNoSpaces} />
        <StatCard label="Words" value={stats.words} highlight />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard label="Reading Time" value={stats.readingTime} />
        <StatCard label="Speaking Time" value={stats.speakingTime} />
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

function StatCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
