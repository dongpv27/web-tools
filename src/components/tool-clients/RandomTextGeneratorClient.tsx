'use client';

import { useState } from 'react';
import ToolResult from '@/components/tools/ToolResult';

const adjectives = [
  'amazing', 'beautiful', 'creative', 'dynamic', 'elegant', 'fantastic', 'gorgeous',
  'helpful', 'incredible', 'joyful', 'knowledgeable', 'lovely', 'magnificent',
  'natural', 'outstanding', 'perfect', 'quick', 'remarkable', 'stunning', 'terrific',
  'unique', 'vibrant', 'wonderful', 'excellent', 'brilliant', 'charming', 'delightful',
];

const nouns = [
  'solution', 'approach', 'system', 'platform', 'application', 'service', 'product',
  'experience', 'interface', 'design', 'feature', 'functionality', 'performance',
  'technology', 'innovation', 'strategy', 'method', 'concept', 'idea', 'project',
];

const verbs = [
  'delivers', 'provides', 'offers', 'enables', 'supports', 'enhances', 'improves',
  'optimizes', 'transforms', 'revolutionizes', 'streamlines', 'accelerates',
];

const templates = [
  'The {adj} {noun} {verb} an {adj2} {noun2}.',
  'Our {adj} {noun} {verb} the most {adj2} {noun2}.',
  'This {adj} {noun} {verb} a truly {adj2} {noun2}.',
  'Experience the {adj} {noun} that {verb} an {adj2} {noun2}.',
  'Discover how our {adj} {noun} {verb} your {adj2} {noun2}.',
];

export default function RandomTextGeneratorClient() {
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'sentences' | 'paragraphs'>('sentences');
  const [count, setCount] = useState(5);

  const generateSentence = (): string => {
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template
      .replace('{adj}', adjectives[Math.floor(Math.random() * adjectives.length)])
      .replace('{noun}', nouns[Math.floor(Math.random() * nouns.length)])
      .replace('{verb}', verbs[Math.floor(Math.random() * verbs.length)])
      .replace('{adj2}', adjectives[Math.floor(Math.random() * adjectives.length)])
      .replace('{noun2}', nouns[Math.floor(Math.random() * nouns.length)]);
  };

  const generate = () => {
    let result = '';

    if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      result = sentences.join(' ');
    } else {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        const sentences = [];
        const sentenceCount = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < sentenceCount; j++) {
          sentences.push(generateSentence());
        }
        paragraphs.push(sentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    }

    setOutput(result);
  };

  const clearAll = () => {
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Generate</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
          <input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {output && (
        <ToolResult value={output} label="Generated Text" showDownload downloadFilename="generated-text.txt" />
      )}

      {/* Stats */}
      {output && (
        <div className="text-sm text-gray-500">
          {output.split(/\s+/).length} words, {output.length} characters
        </div>
      )}
    </div>
  );
}
