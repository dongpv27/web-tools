'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

// Common named entities for the encoder. The decoder uses the browser's
// DOMParser which already knows the full HTML5 spec (~2000 entities) — no
// reason to ship our own table for that direction.
const NAMED_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  ' ': '&nbsp;',
  '¢': '&cent;',
  '£': '&pound;',
  '¥': '&yen;',
  '€': '&euro;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '§': '&sect;',
  '¶': '&para;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
  '¡': '&iexcl;',
  '¿': '&iquest;',
  '«': '&laquo;',
  '»': '&raquo;',
  '‘': '&lsquo;',
  '’': '&rsquo;',
  '“': '&ldquo;',
  '”': '&rdquo;',
  '–': '&ndash;',
  '—': '&mdash;',
  '…': '&hellip;',
  '•': '&bull;',
  '←': '&larr;',
  '→': '&rarr;',
  '↑': '&uarr;',
  '↓': '&darr;',
  '♠': '&spades;',
  '♣': '&clubs;',
  '♥': '&hearts;',
  '♦': '&diams;',
};

type EncodeMode = 'basic' | 'named' | 'all-non-ascii' | 'numeric';

export default function HtmlEncodeDecodeClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<EncodeMode>('named');

  const htmlEncode = (text: string): string => {
    if (encodeMode === 'basic') {
      const basic: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return text.replace(/[&<>"']/g, (c) => basic[c]);
    }
    if (encodeMode === 'all-non-ascii') {
      return text.replace(/[\s\S]/gu, (c) => {
        const cp = c.codePointAt(0)!;
        if (cp < 128 && !'&<>"\''.includes(c)) return c;
        return NAMED_ENTITIES[c] ?? `&#${cp};`;
      });
    }
    if (encodeMode === 'numeric') {
      // Pure numeric encoding for every char — useful for obfuscation / when
      // the consumer's named-entity support is uncertain.
      return text.replace(/[\s\S]/gu, (c) => `&#${c.codePointAt(0)};`);
    }
    // 'named' (default): expand mandatory + common named entities, leave
    // ASCII letters/digits alone.
    return text.replace(/[\s\S]/gu, (c) => NAMED_ENTITIES[c] ?? c);
  };

  // DOMParser route handles every named HTML5 entity AND numeric forms
  // (decimal `&#NNN;` and hex `&#xNN;`) without us shipping a table.
  const htmlDecode = (text: string): string => {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent ?? '';
  };

  const handleProcess = () => {
    if (!input.trim()) return;
    setOutput(mode === 'encode' ? htmlEncode(input) : htmlDecode(input));
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Decode
        </button>
      </div>

      {mode === 'encode' && (
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm text-gray-600">Encoding mode:</label>
          <select
            value={encodeMode}
            onChange={(e) => setEncodeMode(e.target.value as EncodeMode)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="basic">Basic (only &amp; &lt; &gt; &quot; &apos;)</option>
            <option value="named">Named + special (€ © ™ … — recommended)</option>
            <option value="all-non-ascii">All non-ASCII characters</option>
            <option value="numeric">Numeric only (every char → &amp;#N;)</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'encode' ? 'Plain Text' : 'HTML Encoded Text'}
        </label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter HTML entities to decode...'}
          rows={6}
          lineNumbers
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleProcess}
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
        >
          Swap
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {output && (
        <ToolResult
          value={output}
          label={mode === 'encode' ? 'HTML Encoded' : 'Decoded Text'}
        />
      )}

      <p className="text-xs text-gray-500">
        Decoder supports the full HTML5 entity set (&amp;euro;, &amp;hearts;, &amp;iexcl;, &amp;#x2603;, &amp;#9731;… ~2000 entities) via the browser&apos;s native parser.
      </p>
    </div>
  );
}
