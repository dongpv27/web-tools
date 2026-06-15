'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import ToolResult from '@/components/tools/ToolResult';
import { trackToolRun } from '@/lib/analytics';

// Tightly grouped cheatsheet: characters → quantifiers → anchors → groups → classes → escapes.
// Each entry: token, human description. Kept short so the panel doesn't bury results.
const CHEATSHEET: { section: string; rows: { token: string; desc: string }[] }[] = [
  {
    section: 'Character classes',
    rows: [
      { token: '.', desc: 'Any character except newline' },
      { token: '\\d', desc: 'Digit (0-9)' },
      { token: '\\D', desc: 'Non-digit' },
      { token: '\\w', desc: 'Word char (a-z, A-Z, 0-9, _)' },
      { token: '\\W', desc: 'Non-word char' },
      { token: '\\s', desc: 'Whitespace (space, tab, newline)' },
      { token: '\\S', desc: 'Non-whitespace' },
      { token: '[abc]', desc: 'Any of a, b, or c' },
      { token: '[^abc]', desc: 'Not a, b, or c' },
      { token: '[a-z]', desc: 'Range from a to z' },
    ],
  },
  {
    section: 'Quantifiers',
    rows: [
      { token: '*', desc: '0 or more (greedy)' },
      { token: '+', desc: '1 or more (greedy)' },
      { token: '?', desc: '0 or 1 (optional)' },
      { token: '{n}', desc: 'Exactly n times' },
      { token: '{n,}', desc: 'At least n times' },
      { token: '{n,m}', desc: 'Between n and m times' },
      { token: '*?', desc: 'Lazy (non-greedy) version' },
    ],
  },
  {
    section: 'Anchors',
    rows: [
      { token: '^', desc: 'Start of string (or line with /m)' },
      { token: '$', desc: 'End of string (or line with /m)' },
      { token: '\\b', desc: 'Word boundary' },
      { token: '\\B', desc: 'Non-word boundary' },
    ],
  },
  {
    section: 'Groups & references',
    rows: [
      { token: '(abc)', desc: 'Capturing group → use as $1 in replace' },
      { token: '(?:abc)', desc: 'Non-capturing group' },
      { token: '(?<name>abc)', desc: 'Named group → use as $<name>' },
      { token: '(a|b)', desc: 'Alternation: a or b' },
      { token: '\\1', desc: 'Backreference to group 1' },
    ],
  },
  {
    section: 'Lookaround',
    rows: [
      { token: '(?=abc)', desc: 'Positive lookahead (followed by abc)' },
      { token: '(?!abc)', desc: 'Negative lookahead' },
      { token: '(?<=abc)', desc: 'Positive lookbehind' },
      { token: '(?<!abc)', desc: 'Negative lookbehind' },
    ],
  },
  {
    section: 'Common patterns',
    rows: [
      { token: '\\d{4}-\\d{2}-\\d{2}', desc: 'ISO date YYYY-MM-DD' },
      { token: '[\\w.+-]+@[\\w-]+\\.[\\w.-]+', desc: 'Email (basic)' },
      { token: 'https?://[^\\s]+', desc: 'URL' },
      { token: '^[a-zA-Z0-9_]{3,16}$', desc: 'Username (3-16 chars)' },
      { token: '\\b[0-9a-f]{6}\\b', desc: 'Hex color (6 digits)' },
    ],
  },
];

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
  const [replacement, setReplacement] = useState('');
  const [replacedOutput, setReplacedOutput] = useState('');
  const [showCheatsheet, setShowCheatsheet] = useState(false);

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
    setReplacedOutput('');

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
      trackToolRun('regex-tester', 'test');

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

      // Replacement preview — fresh regex so lastIndex doesn't leak from .exec loop
      try {
        const replaceRegex = new RegExp(pattern, flags);
        setReplacedOutput(testString.replace(replaceRegex, replacement));
      } catch {
        setReplacedOutput('');
      }
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
    setReplacement('');
    setReplacedOutput('');
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

      {/* Replacement (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replacement <span className="text-gray-400 font-normal">(optional — supports <code className="font-mono">$1</code>, <code className="font-mono">$&lt;name&gt;</code>)</span>
        </label>
        <input
          type="text"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          placeholder="Replacement string"
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Replacement preview */}
      {matches.length > 0 && !error && replacement && (
        <ToolResult value={replacedOutput} label="Replacement Result" />
      )}

      {/* No matches */}
      {highlightedHtml && matches.length === 0 && !error && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">No matches found</p>
        </div>
      )}

      {/* Cheatsheet */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => setShowCheatsheet(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          aria-expanded={showCheatsheet}
        >
          <span className="flex items-center gap-2">
            {showCheatsheet ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Regex cheatsheet
          </span>
          <span className="text-xs text-gray-500">Click any token to insert into pattern</span>
        </button>
        {showCheatsheet && (
          <div className="px-4 pb-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {CHEATSHEET.map(({ section, rows }) => (
              <div key={section}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {section}
                </div>
                <ul className="space-y-1">
                  {rows.map(({ token, desc }) => (
                    <li key={token} className="flex items-start gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPattern(p => p + token)}
                        className="flex-shrink-0 px-1.5 py-0.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 font-mono text-gray-700 rounded transition-colors text-left"
                        title="Click to append to pattern"
                      >
                        {token}
                      </button>
                      <span className="text-gray-600 leading-relaxed">{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
