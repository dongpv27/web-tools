'use client';

import { useState } from 'react';
import ToolResult from '@/components/tools/ToolResult';

export default function SlugGeneratorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    lowercase: true,
    replaceSpaces: '-',
    removeSpecial: true,
  });

  const generateSlug = (text: string): string => {
    let slug = text.trim();

    // Convert to lowercase if option is set
    if (options.lowercase) {
      slug = slug.toLowerCase();
    }

    // Normalize unicode characters
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Replace spaces
    slug = slug.replace(/\s+/g, options.replaceSpaces);

    // Remove special characters
    if (options.removeSpecial) {
      slug = slug.replace(/[^a-zA-Z0-9\-_]/g, '');
    }

    // Remove consecutive separators
    const separator = options.replaceSpaces;
    const regex = new RegExp(`\\${separator}{2,}`, 'g');
    slug = slug.replace(regex, separator);

    // Remove leading/trailing separators
    slug = slug.replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), '');

    return slug;
  };

  const generate = () => {
    if (!input.trim()) return;
    setOutput(generateSlug(input));
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title or Text
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter title to generate slug..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Options</label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.lowercase}
            onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Lowercase</span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Replace spaces with:</span>
          <select
            value={options.replaceSpaces}
            onChange={(e) => setOptions({ ...options, replaceSpaces: e.target.value })}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.removeSpecial}
            onChange={(e) => setOptions({ ...options, removeSpecial: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Remove special characters</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Slug
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
        <ToolResult value={output} label="Generated Slug" />
      )}

      {/* Preview URL */}
      {output && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Preview URL</p>
          <code className="text-sm text-blue-600 break-all">
            https://example.com/{output}
          </code>
        </div>
      )}
    </div>
  );
}
