'use client';

import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import ToolInput from '@/components/tools/ToolInput';

export default function FindAndReplaceClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [replaceCount, setReplaceCount] = useState(0);

  const doReplace = () => {
    if (!input.trim() || !find) return;

    let result = input;
    let count = 0;

    try {
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(find, flags);
        result = result.replace(regex, (match) => {
          count++;
          return replace;
        });
      } else {
        let searchTerm = find;
        let flags = caseSensitive ? '' : 'i';

        if (wholeWord) {
          searchTerm = `\\b${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
          flags = caseSensitive ? 'g' : 'gi';
          const regex = new RegExp(searchTerm, flags);
          result = result.replace(regex, (match) => {
            count++;
            return replace;
          });
        } else {
          // Simple string replace (case-insensitive)
          if (caseSensitive) {
            const parts = result.split(find);
            count = parts.length - 1;
            result = parts.join(replace);
          } else {
            const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            result = result.replace(regex, (match) => {
              count++;
              return replace;
            });
          }
        }
      }

      setOutput(result);
      setReplaceCount(count);
    } catch (e) {
      console.error('Replace error:', e);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setFind('');
    setReplace('');
    setReplaceCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Enter text..."
          rows={6}
        />
      </div>

      {/* Find and Replace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Find</label>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Text to find..."
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => { const tmp = find; setFind(replace); setReplace(tmp); setOutput(''); setReplaceCount(0); }}
            className="absolute -left-7 top-[38px] p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Swap Find and Replace"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <label className="block text-sm font-medium text-gray-700 mb-2">Replace with</label>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="Replacement text..."
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Case sensitive</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={wholeWord}
            onChange={(e) => setWholeWord(e.target.checked)}
            disabled={useRegex}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className={`text-sm ${useRegex ? 'text-gray-400' : 'text-gray-600'}`}>Whole word</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Regular expression</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={doReplace}
          disabled={!find}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Replace All
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Replace Count */}
      {replaceCount > 0 && (
        <div className="text-sm text-gray-600">
          Replaced <strong className="text-green-600 text-lg">{replaceCount}</strong> occurrence{replaceCount !== 1 ? 's' : ''}
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[200px]"
          />
        </div>
      )}
    </div>
  );
}
