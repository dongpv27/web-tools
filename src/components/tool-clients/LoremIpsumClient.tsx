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
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words' | 'list' | 'headings'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithClassic, setStartWithClassic] = useState(true);
  const [format, setFormat] = useState<'plain' | 'html'>('plain');
  const [listStyle, setListStyle] = useState<'ul' | 'ol'>('ul');

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

  // Short, title-cased phrase for headings/list items (5–9 words).
  const generateTitle = (): string => {
    const len = Math.floor(Math.random() * 5) + 5;
    return Array.from({ length: len }, generateWord)
      .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(' ');
  };

  const generate = () => {
    const paragraphs: string[] = [];

    switch (type) {
      case 'paragraphs':
        for (let i = 0; i < count; i++) {
          paragraphs.push(
            startWithClassic && i === 0
              ? classicStart + '. ' + generateParagraph(4)
              : generateParagraph(),
          );
        }
        setOutput(
          format === 'html'
            ? paragraphs.map(p => `<p>${p}</p>`).join('\n')
            : paragraphs.join('\n\n'),
        );
        return;

      case 'sentences': {
        const sentences: string[] = [];
        for (let i = 0; i < count; i++) {
          sentences.push(
            startWithClassic && i === 0 ? classicStart + '.' : generateSentence(),
          );
        }
        setOutput(sentences.join(' '));
        return;
      }

      case 'words':
        setOutput(Array.from({ length: count }, generateWord).join(' '));
        return;

      case 'headings': {
        const headings: string[] = [];
        for (let i = 0; i < count; i++) {
          const title = generateTitle();
          // Cycle h2 → h3 → h4 so longer outputs feel like an outline.
          const level = 2 + (i % 3);
          if (format === 'html') {
            headings.push(`<h${level}>${title}</h${level}>`);
          } else {
            headings.push(`${'#'.repeat(level)} ${title}`);
          }
        }
        setOutput(headings.join('\n\n'));
        return;
      }

      case 'list': {
        const items = Array.from({ length: count }, generateTitle);
        if (format === 'html') {
          const inner = items.map(it => `  <li>${it}</li>`).join('\n');
          setOutput(`<${listStyle}>\n${inner}\n</${listStyle}>`);
        } else {
          const prefix = (i: number) => (listStyle === 'ol' ? `${i + 1}. ` : '- ');
          setOutput(items.map((it, i) => prefix(i) + it).join('\n'));
        }
        return;
      }
    }
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
            <option value="headings">Headings</option>
            <option value="list">List items</option>
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

        {/* Classic start (only meaningful for prose types) */}
        <div className="flex items-end">
          <label
            className={`flex items-center gap-2 pb-2 ${
              type === 'paragraphs' || type === 'sentences' ? 'cursor-pointer' : 'opacity-50'
            }`}
          >
            <input
              type="checkbox"
              checked={startWithClassic}
              onChange={(e) => setStartWithClassic(e.target.checked)}
              disabled={type !== 'paragraphs' && type !== 'sentences'}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Start with &quot;Lorem ipsum...&quot;</span>
          </label>
        </div>
      </div>

      {/* Output format options */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Output:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'plain' | 'html')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="plain">Plain text</option>
            <option value="html">HTML</option>
          </select>
        </div>
        {type === 'list' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">List style:</label>
            <select
              value={listStyle}
              onChange={(e) => setListStyle(e.target.value as 'ul' | 'ol')}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ul">Bulleted (ul)</option>
              <option value="ol">Numbered (ol)</option>
            </select>
          </div>
        )}
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
        <ToolResult value={output} label="Generated Lorem Ipsum" />
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
