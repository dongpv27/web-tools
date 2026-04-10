'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function TextToListClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [listType, setListType] = useState<'bullet' | 'numbered' | 'letter' | 'custom'>('bullet');
  const [customPrefix, setCustomPrefix] = useState('');
  const [separator, setSeparator] = useState<'newline' | 'comma' | 'space'>('newline');

  const convert = () => {
    if (!input.trim()) return;

    // Split by separator
    let items: string[];
    switch (separator) {
      case 'newline':
        items = input.split('\n').filter(s => s.trim());
        break;
      case 'comma':
        items = input.split(',').filter(s => s.trim());
        break;
      case 'space':
        items = input.split(/\s+/).filter(s => s.trim());
        break;
    }

    // Trim items
    items = items.map(s => s.trim());

    // Format as list
    let result = '';
    switch (listType) {
      case 'bullet':
        result = items.map(item => `• ${item}`).join('\n');
        break;
      case 'numbered':
        result = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
        break;
      case 'letter':
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        result = items.map((item, i) => `${letters[i % 26]}. ${item}`).join('\n');
        break;
      case 'custom':
        const prefix = customPrefix || '>';
        result = items.map(item => `${prefix} ${item}`).join('\n');
        break;
    }

    setOutput(result);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const loadSample = () => {
    setInput('Apple\nBanana\nCherry\nDate\nElderberry');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Input Text</label>
          <button onClick={loadSample} className="text-sm text-blue-600 hover:text-blue-700">
            Load Sample
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Enter items separated by newlines, commas, or spaces..."
          rows={6}
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Input Separator</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as typeof separator)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newline">New lines</option>
            <option value="comma">Commas</option>
            <option value="space">Spaces</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">List Style</label>
          <select
            value={listType}
            onChange={(e) => setListType(e.target.value as typeof listType)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bullet">Bullet points (•)</option>
            <option value="numbered">Numbered (1. 2. 3.)</option>
            <option value="letter">Lettered (a. b. c.)</option>
            <option value="custom">Custom Prefix</option>
          </select>
          {listType === 'custom' && (
            <input
              type="text"
              value={customPrefix}
              onChange={(e) => setCustomPrefix(e.target.value)}
              placeholder="Enter custom prefix (e.g. →, -, *, #)"
              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={convert}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert to List
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
        <ToolResult value={output} label="List Output" textClassName="text-gray-100" />
      )}
    </div>
  );
}
