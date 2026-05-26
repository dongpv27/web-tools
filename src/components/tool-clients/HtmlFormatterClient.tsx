'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

// Void elements per HTML spec — no closing tag, indent level doesn't increase.
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Elements whose inner whitespace must be preserved when formatting.
const RAW_TAGS = new Set(['pre', 'script', 'style', 'textarea']);

// Inline tags whose presence shouldn't force a line break — e.g. <em>, <strong>
// inside a paragraph. Kept conservative; users can re-indent if needed.
const INLINE_TAGS = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
  'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small',
  'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',
]);

type Token =
  | { kind: 'doctype'; raw: string }
  | { kind: 'comment'; raw: string }
  | { kind: 'cdata'; raw: string }
  | { kind: 'open'; name: string; raw: string; selfClose: boolean }
  | { kind: 'close'; name: string; raw: string }
  | { kind: 'raw'; name: string; body: string }
  | { kind: 'text'; raw: string };

// Tokenise HTML into a stream of structural nodes. Handles:
//   • <!DOCTYPE ...> (any casing, multi-line)
//   • <!-- comments --> (including > inside)
//   • <![CDATA[ ... ]]>
//   • <script>/<style>/<pre>/<textarea> with attributes, whose body is
//     captured verbatim so user JS/CSS isn't mangled.
//   • Attribute values containing >, ", '
const tokenise = (src: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  const len = src.length;

  while (i < len) {
    // DOCTYPE
    if (src.startsWith('<!', i) && /^<!doctype/i.test(src.slice(i, i + 9))) {
      const end = src.indexOf('>', i);
      if (end === -1) {
        tokens.push({ kind: 'text', raw: src.slice(i) });
        break;
      }
      tokens.push({ kind: 'doctype', raw: src.slice(i, end + 1) });
      i = end + 1;
      continue;
    }
    // Comment
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) {
        tokens.push({ kind: 'comment', raw: src.slice(i) });
        break;
      }
      tokens.push({ kind: 'comment', raw: src.slice(i, end + 3) });
      i = end + 3;
      continue;
    }
    // CDATA (XHTML / SVG context)
    if (src.startsWith('<![CDATA[', i)) {
      const end = src.indexOf(']]>', i + 9);
      if (end === -1) {
        tokens.push({ kind: 'cdata', raw: src.slice(i) });
        break;
      }
      tokens.push({ kind: 'cdata', raw: src.slice(i, end + 3) });
      i = end + 3;
      continue;
    }
    // Tag
    if (src[i] === '<' && (/[a-zA-Z/]/.test(src[i + 1] ?? ''))) {
      const tagEnd = findTagEnd(src, i);
      if (tagEnd === -1) {
        tokens.push({ kind: 'text', raw: src.slice(i) });
        break;
      }
      const raw = src.slice(i, tagEnd + 1);
      const isClose = raw.startsWith('</');
      const name = (raw.match(/^<\/?\s*([a-zA-Z][a-zA-Z0-9:-]*)/) || [])[1]?.toLowerCase() ?? '';
      if (isClose) {
        tokens.push({ kind: 'close', name, raw });
        i = tagEnd + 1;
        continue;
      }
      const selfClose = raw.endsWith('/>') || VOID_TAGS.has(name);
      // Raw-text elements: capture body verbatim until the matching </name>.
      if (RAW_TAGS.has(name) && !selfClose) {
        const closeRegex = new RegExp(`</\\s*${name}\\s*>`, 'i');
        const remainder = src.slice(tagEnd + 1);
        const closeMatch = remainder.match(closeRegex);
        if (closeMatch && closeMatch.index !== undefined) {
          const body = remainder.slice(0, closeMatch.index);
          tokens.push({ kind: 'open', name, raw, selfClose: false });
          tokens.push({ kind: 'raw', name, body });
          tokens.push({ kind: 'close', name, raw: closeMatch[0] });
          i = tagEnd + 1 + closeMatch.index + closeMatch[0].length;
          continue;
        }
      }
      tokens.push({ kind: 'open', name, raw, selfClose });
      i = tagEnd + 1;
      continue;
    }
    // Text run — up to next `<`
    const next = src.indexOf('<', i);
    const slice = next === -1 ? src.slice(i) : src.slice(i, next);
    if (slice) tokens.push({ kind: 'text', raw: slice });
    if (next === -1) break;
    i = next;
  }
  return tokens;
};

// Find the index of the `>` that closes a tag starting at `start`, accounting
// for quoted attribute values that may contain `>`.
const findTagEnd = (src: string, start: number): number => {
  let i = start + 1;
  let quote: string | null = null;
  while (i < src.length) {
    const ch = src[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else {
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') return i;
    }
    i++;
  }
  return -1;
};

// Reassemble tokens with proper indentation.
const formatHtml = (src: string, indentValue: number | string): string => {
  const indentStr = indentValue === 'tab' ? '\t' : ' '.repeat(indentValue as number);
  const tokens = tokenise(src);

  const out: string[] = [];
  let depth = 0;
  let lastWasText = false;

  const pushLine = (s: string) => {
    out.push(indentStr.repeat(Math.max(0, depth)) + s);
    lastWasText = false;
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.kind === 'doctype') {
      pushLine(t.raw);
      continue;
    }
    if (t.kind === 'comment') {
      pushLine(t.raw);
      continue;
    }
    if (t.kind === 'cdata') {
      pushLine(t.raw);
      continue;
    }
    if (t.kind === 'raw') {
      // Re-indent each line of the preserved body by the current depth so that
      // <script>/<style>/<pre> bodies sit visually under their opening tag.
      const trimmed = t.body.replace(/^\n+|\n+$/g, '');
      if (trimmed.length === 0) continue;
      const body = trimmed
        .split('\n')
        .map(line => indentStr.repeat(depth) + line)
        .join('\n');
      out.push(body);
      lastWasText = false;
      continue;
    }
    if (t.kind === 'text') {
      const collapsed = t.raw.replace(/\s+/g, ' ').trim();
      if (!collapsed) continue;
      // Glue short text onto the previous line if it followed an inline open tag.
      const prev = out[out.length - 1];
      const prevTok = tokens[i - 1];
      const prevIsInlineOpen =
        prevTok && prevTok.kind === 'open' && INLINE_TAGS.has(prevTok.name) && !prevTok.selfClose;
      if (prevIsInlineOpen && prev !== undefined) {
        out[out.length - 1] = prev + collapsed;
      } else {
        pushLine(collapsed);
      }
      lastWasText = true;
      continue;
    }
    if (t.kind === 'open') {
      if (t.selfClose) {
        pushLine(t.raw);
        continue;
      }
      // If the next non-comment token is a closing tag for the same name with
      // only short inline text between, keep them on one line — e.g. <p>hi</p>.
      const next = tokens[i + 1];
      const after = tokens[i + 2];
      if (
        next &&
        next.kind === 'text' &&
        !next.raw.includes('\n') &&
        after &&
        after.kind === 'close' &&
        after.name === t.name
      ) {
        const inner = next.raw.replace(/\s+/g, ' ').trim();
        pushLine(`${t.raw}${inner}${after.raw}`);
        i += 2;
        continue;
      }
      pushLine(t.raw);
      depth++;
      continue;
    }
    if (t.kind === 'close') {
      depth = Math.max(0, depth - 1);
      // If previous output line is the matching opener with only inline text,
      // we already emitted it together — but this branch handles the general case.
      if (lastWasText && out.length > 0) {
        out[out.length - 1] = out[out.length - 1] + t.raw;
        lastWasText = false;
      } else {
        pushLine(t.raw);
      }
      continue;
    }
  }
  return out.join('\n').trim();
};

// Minify while preserving the body of script/style/pre/textarea.
const minifyHtml = (src: string): string => {
  const tokens = tokenise(src);
  const out: string[] = [];
  for (const t of tokens) {
    switch (t.kind) {
      case 'doctype':
      case 'open':
      case 'close':
      case 'cdata':
        out.push(t.raw);
        break;
      case 'comment':
        // Drop comments — common minify behaviour. Conditional IE comments
        // (`<!--[if ...]>`) are no longer relevant, but if preserved is wanted
        // a future flag could keep them.
        break;
      case 'raw':
        out.push(t.body);
        break;
      case 'text': {
        const collapsed = t.raw.replace(/\s+/g, ' ');
        if (collapsed.trim()) out.push(collapsed);
        break;
      }
    }
  }
  return out
    .join('')
    // Collapse whitespace between tags
    .replace(/>\s+</g, '><')
    .trim();
};

export default function HtmlFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<number | string>(2);

  const format = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter HTML to format');
      return;
    }
    try {
      setOutput(formatHtml(input, indent));
    } catch (e) {
      setError(`Error formatting HTML: ${(e as Error).message}`);
    }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter HTML to minify');
      return;
    }
    try {
      setOutput(minifyHtml(input));
    } catch (e) {
      setError(`Error minifying HTML: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput(
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Demo</title><style>body{margin:0;font-family:system-ui}</style></head><body><!-- main content --><div class="container"><header><h1>Welcome</h1></header><main><p>This is a <strong>bold</strong> paragraph with an <a href="https://example.com" title="link >">inline link</a>.</p><ul><li>Item 1</li><li>Item 2</li></ul><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg></main><script>console.log("hi <world>");</script></div></body></html>`,
    );
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">HTML Input</label>
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
          placeholder="<html>...</html>"
          rows={10}
          lineNumbers
        />
      </div>

      {/* Options */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Indent:</label>
        <select
          value={indent}
          onChange={(e) => setIndent(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
          className="appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.375rem_center] bg-no-repeat"
        >
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <option key={n} value={n}>{n} space{n > 1 ? 's' : ''}</option>
          ))}
          <option value="tab">Tab</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={format}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Minify
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

      {/* Output */}
      {output && !error && (
        <ToolResult value={output} label="Formatted HTML" language="html" theme="light" />
      )}

      {/* Stats */}
      {input && output && (
        <div className="text-sm text-gray-500">
          Input: {input.length} chars → Output: {output.length} chars
        </div>
      )}
    </div>
  );
}
