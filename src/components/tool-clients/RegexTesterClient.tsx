'use client';

import { useState } from 'react';
import ToolResult from '@/components/tools/ToolResult';

interface Match {
  match: string;
  index: number;
  indices?: { start: number; end: number };
  groups: Record<string, string> | null;
}

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [highlightedHtml, setHighlightedHtml] = useState('');

  const availableFlags = [
    { flag: 'g', label: 'Global', desc: 'Find all matches' },
    { flag: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
    { flag: 'm', label: 'Multiline', desc: '^ and $ match line boundaries' },
    { flag: 's', label: 'Dotall', desc: '. matches newlines' },
    { flag: 'd', label: 'Indices', desc: 'Include start/end indices for matches' },
    { flag: 'u', label: 'Unicode', desc: 'Enable full Unicode matching' },
    { flag: 'y', label: 'Sticky', desc: 'Match only from lastIndex position' },
    { flag: 'v', label: 'Sets & Properties', desc: 'Enable ES2024 set syntax' },
  ];

  const testRegex = () => {
    setError('');
    setMatches([]);
    setHighlightedHtml('');

    if (!pattern.trim()) {
      setError('Please enter a regex pattern');
      return;
    }

    if (!testString.trim()) {
      setError('Please enter a test string');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const allMatches: Match[] = [];

      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          const hasIndices = flags.includes('d');
          allMatches.push({
            match: match[0],
            index: match.index,
            indices: hasIndices && match.indices?.[0] ? { start: match.indices[0][0], end: match.indices[0][1] } : undefined,
            groups: match.groups || null,
          });
          // Prevent infinite loop for zero-length matches
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          const hasIndices = flags.includes('d');
          allMatches.push({
            match: match[0],
            index: match.index,
            indices: hasIndices && match.indices?.[0] ? { start: match.indices[0][0], end: match.indices[0][1] } : undefined,
            groups: match.groups || null,
          });
        }
      }

      setMatches(allMatches);

      // Create highlighted HTML
      let html = '';
      let lastIndex = 0;
      const sortedMatches = [...allMatches].sort((a, b) => a.index - b.index);

      for (const m of sortedMatches) {
        html += escapeHtml(testString.slice(lastIndex, m.index));
        html += `<mark class="bg-yellow-200 px-0.5 rounded">${escapeHtml(m.match)}</mark>`;
        lastIndex = m.index + m.match.length;
      }
      html += escapeHtml(testString.slice(lastIndex));
      setHighlightedHtml(html);
    } catch (e) {
      setError(`Invalid regex: ${(e as Error).message}`);
    }
  };

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br/>');
  };

  const clearAll = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setHighlightedHtml('');
    setError('');
  };

  const loadSample = () => {
    setPattern('\\b\\w+@\\w+\\.\\w+\\b');
    setFlags('gi');
    setTestString('Contact us at support@example.com or sales@company.org for more info.');
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Regular Expression
        </label>
        <div className="flex gap-2">
          <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
            /
          </span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern"
            className="flex-1 px-3 py-2 text-sm border-y border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="flex items-center px-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 font-mono">
            /{flags}
          </span>
        </div>
      </div>

      {/* Flags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Flags</label>
        <div className="flex flex-wrap gap-2">
          {availableFlags.map(({ flag, label, desc }) => (
            <label
              key={flag}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                flags.includes(flag)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              title={desc}
            >
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(flags + flag);
                  } else {
                    setFlags(flags.replace(flag, ''));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                <code className="font-mono">{flag}</code> - {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against the regex"
          rows={5}
          className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={testRegex}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Regex
        </button>
        <button
          onClick={loadSample}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Load Sample
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {matches.length > 0 && !error && (
        <div className="space-y-4">
          {/* Highlighted Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highlighted Matches
            </label>
            <div
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </div>

          {/* Match Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matches ({matches.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-blue-600">"{m.match}"</code>
                    <span className="text-xs text-gray-500">index: {m.index}</span>
                  </div>
                  {m.indices && (
                    <div className="mt-1 text-xs text-gray-500">
                      indices: [{m.indices.start}, {m.indices.end}]
                    </div>
                  )}
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <div className="mt-2 text-xs">
                      <span className="text-gray-500">Groups: </span>
                      {Object.entries(m.groups).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          <code className="bg-gray-200 px-1 rounded">{key}</code>=
                          <code className="text-green-600">"{value}"</code>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No matches */}
      {highlightedHtml && matches.length === 0 && !error && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">No matches found</p>
        </div>
      )}
    </div>
  );
}
