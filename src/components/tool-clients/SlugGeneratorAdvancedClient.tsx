'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function SlugGeneratorAdvancedClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(100);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [transliterate, setTransliterate] = useState(true);

  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after'
  ]);

  const transliterateChar = (char: string): string => {
    const map: Record<string, string> = {
      'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
      'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
      'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
      'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
      'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
      'ñ': 'n', 'ç': 'c', 'ß': 'ss',
      'ă': 'a', 'ș': 's', 'ț': 't',
      'ž': 'z', 'č': 'c', 'š': 's', 'ř': 'r', 'ě': 'e', 'ň': 'n',
      'ł': 'l', 'ż': 'z', 'ź': 'z', 'ć': 'c', 'ń': 'n', 'ś': 's',
    };
    return map[char] || map[char.toLowerCase()]?.toUpperCase() || char;
  };

  const generateSlug = () => {
    let text = input;

    // Transliterate
    if (transliterate) {
      text = text.split('').map(transliterateChar).join('');
    }

    // Convert to lowercase
    if (lowercase) {
      text = text.toLowerCase();
    }

    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');

    // Split into words
    let words = text.split(/[\s\-_]+/).filter(w => w.length > 0);

    // Remove stop words
    if (removeStopWords) {
      words = words.filter(w => !stopWords.has(w.toLowerCase()));
    }

    // Clean each word
    words = words.map(word => {
      // Remove non-alphanumeric characters
      return word.replace(/[^a-zA-Z0-9]/g, '');
    }).filter(w => w.length > 0);

    // Join with separator
    let slug = words.join(separator);

    // Truncate
    if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength);
      // Don't end with separator
      if (slug.endsWith(separator)) {
        slug = slug.slice(0, -1);
      }
    }

    setOutput(slug);
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text to Slugify</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text to convert to slug..."
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Separator */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Separator:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
            <option value="">None</option>
          </select>
        </div>

        {/* Max Length */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Max Length:</label>
          <input
            type="number"
            min={10}
            max={500}
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Lowercase</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={transliterate}
            onChange={(e) => setTransliterate(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Transliterate</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeStopWords}
            onChange={(e) => setRemoveStopWords(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Remove Stop Words</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generateSlug}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Slug
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Generated Slug</label>
            <div className="flex gap-2">
              <CopyButton text={output} />
              <DownloadButton content={output} filename="slug.txt" />
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <code className="text-sm font-mono text-gray-800 break-all">{output}</code>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Length: {output.length} characters
          </div>
        </div>
      )}
    </div>
  );
}
