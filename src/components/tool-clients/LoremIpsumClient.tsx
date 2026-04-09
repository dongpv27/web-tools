'use client';

import { useState } from 'react';
import ToolResult from '@/components/tools/ToolResult';

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam',
  'eius', 'modi', 'tempora', 'magnam', 'quaerat',
];

export default function LoremIpsumClient() {
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithClassic, setStartWithClassic] = useState(true);

  const classicStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

  const generateWord = () => loremWords[Math.floor(Math.random() * loremWords.length)];

  const generateSentence = (wordCount: number = 0): string => {
    const words = wordCount || Math.floor(Math.random() * 10) + 8;
    const sentence: string[] = [];

    for (let i = 0; i < words; i++) {
      sentence.push(generateWord());
    }

    // Capitalize first letter
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);

    return sentence.join(' ') + '.';
  };

  const generateParagraph = (sentenceCount: number = 0): string => {
    const sentences = sentenceCount || Math.floor(Math.random() * 4) + 4;
    const paragraph: string[] = [];

    for (let i = 0; i < sentences; i++) {
      paragraph.push(generateSentence());
    }

    return paragraph.join(' ');
  };

  const generate = () => {
    let result = '';

    switch (type) {
      case 'paragraphs':
        for (let i = 0; i < count; i++) {
          if (startWithClassic && i === 0) {
            result += classicStart + '. ' + generateParagraph(4);
          } else {
            result += generateParagraph();
          }
          if (i < count - 1) {
            result += '\n\n';
          }
        }
        break;

      case 'sentences':
        for (let i = 0; i < count; i++) {
          if (startWithClassic && i === 0) {
            result += classicStart + '.';
          } else {
            result += generateSentence();
          }
          if (i < count - 1) {
            result += ' ';
          }
        }
        break;

      case 'words':
        for (let i = 0; i < count; i++) {
          result += generateWord();
          if (i < count - 1) {
            result += ' ';
          }
        }
        break;
    }

    setOutput(result);
  };

  const clearAll = () => {
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Generate</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Classic start */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={startWithClassic}
              onChange={(e) => setStartWithClassic(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Start with "Lorem ipsum..."</span>
          </label>
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
        <ToolResult value={output} label="Generated Lorem Ipsum" textClassName="text-gray-100" />
      )}

      {/* Word Count */}
      {output && (
        <div className="text-sm text-gray-500">
          {output.split(/\s+/).length} words, {output.length} characters
        </div>
      )}
    </div>
  );
}
