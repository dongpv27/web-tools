'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function TextCaseConverterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const conversions = [
    {
      name: 'UPPERCASE',
      fn: (text: string) => text.toUpperCase(),
      desc: 'Convert to uppercase',
    },
    {
      name: 'lowercase',
      fn: (text: string) => text.toLowerCase(),
      desc: 'Convert to lowercase',
    },
    {
      name: 'Title Case',
      fn: (text: string) =>
        text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
      desc: 'Capitalize first letter of each word',
    },
    {
      name: 'Sentence case',
      fn: (text: string) =>
        text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase()),
      desc: 'Capitalize first letter of sentences',
    },
    {
      name: 'aLtErNaTiNg CaSe',
      fn: (text: string) =>
        text.split('').map((char, i) =>
          i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join(''),
      desc: 'Alternating uppercase/lowercase',
    },
    {
      name: 'InVeRsE CaSe',
      fn: (text: string) =>
        text.split('').map(char =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join(''),
      desc: 'Swap case of each character',
    },
    {
      name: 'snake_case',
      fn: (text: string) =>
        text.trim().toLowerCase().replace(/\s+/g, '_'),
      desc: 'Replace spaces with underscores',
    },
    {
      name: 'kebab-case',
      fn: (text: string) =>
        text.trim().toLowerCase().replace(/\s+/g, '-'),
      desc: 'Replace spaces with hyphens',
    },
    {
      name: 'camelCase',
      fn: (text: string) =>
        text.trim().toLowerCase().replace(/\s+(.)/g, (_, char) => char.toUpperCase()),
      desc: 'Camel case format',
    },
    {
      name: 'PascalCase',
      fn: (text: string) =>
        text.trim().toLowerCase().replace(/(^|\s+)(.)/g, (_, __, char) => char.toUpperCase()),
      desc: 'Pascal case format',
    },
  ];

  const convert = (fn: (text: string) => string) => {
    if (!input.trim()) return;
    setOutput(fn(input));
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const loadSample = () => {
    setInput('the quick brown fox jumps over the lazy dog');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Input Text</label>
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
          placeholder="Enter text to convert..."
          rows={4}
        />
      </div>

      {/* Conversion Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Convert To
        </label>
        <div className="flex flex-wrap gap-2">
          {conversions.map(({ name, fn, desc }) => (
            <button
              key={name}
              onClick={() => convert(fn)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
              title={desc}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      {output && (
        <ToolResult value={output} label="Converted Text" showDownload={true} downloadFilename="converted-text.txt" textClassName="text-gray-100" />
      )}

      {/* Clear Button */}
      <button
        onClick={clearAll}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
