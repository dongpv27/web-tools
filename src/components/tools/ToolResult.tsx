import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';
import React from 'react';

interface ToolResultProps {
  value: string;
  label?: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  downloadFilename?: string;
  theme?: 'dark' | 'light';
}

// ─── JSON highlighter ───────────────────────────────────────────────────────
function highlightJson(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match: strings | numbers | booleans/null | brackets | the rest
  const regex = /("(?:[^"\\]|\\.)*"\s*:?)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(true|false|null)|([{}\[\],])/gi;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, str, num, bool, bracket] = match;
    if (str) {
      if (str.endsWith(':')) {
        // Key
        parts.push(<span key={match.index} className="text-purple-700 font-medium">{str}</span>);
      } else {
        // String value
        parts.push(<span key={match.index} className="text-green-600">{str}</span>);
      }
    } else if (num) {
      parts.push(<span key={match.index} className="text-blue-600">{num}</span>);
    } else if (bool) {
      parts.push(<span key={match.index} className="text-orange-600">{bool}</span>);
    } else if (bracket) {
      parts.push(<span key={match.index} className="text-gray-500">{bracket}</span>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ─── CSS highlighter ────────────────────────────────────────────────────────
function highlightCss(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match: comments | strings | properties (word before :) | selectors/at-rules | values
  const regex = /(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([a-z-]+\s*:)|([.@#\:][^{,\}]*(?=\s*\{))|([{};])/gi;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, comment, str, prop, selector, brace] = match;
    if (comment) {
      parts.push(<span key={match.index} className="text-gray-400 italic">{comment}</span>);
    } else if (str) {
      parts.push(<span key={match.index} className="text-green-600">{str}</span>);
    } else if (prop) {
      parts.push(<span key={match.index} className="text-red-700">{prop}</span>);
    } else if (selector) {
      parts.push(<span key={match.index} className="text-blue-700 font-medium">{selector}</span>);
    } else if (brace) {
      parts.push(<span key={match.index} className="text-gray-500">{brace}</span>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ─── HTML highlighter ───────────────────────────────────────────────────────
function highlightHtml(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match: comments | tags | attribute values | the rest
  const regex = /(&lt;!--[\s\S]*?--&gt;|<!--[\s\S]*?-->)|(<\/?[a-zA-Z][^>]*>)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/gi;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, comment, tag, attrVal] = match;
    if (comment) {
      parts.push(<span key={match.index} className="text-gray-400 italic">{comment}</span>);
    } else if (tag) {
      // Highlight tag: < and > in gray, tag name in blue, attributes in maroon, values in green
      const tagParts: React.ReactNode[] = [];
      const tagRegex = /(<\/?)(\w[\w-]*)|(\s[\w-]+)(=)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')?|(\s*>|\/>)/gi;
      let tagLast = 0;
      let tm;
      while ((tm = tagRegex.exec(tag)) !== null) {
        if (tm.index > tagLast) tagParts.push(tag.slice(tagLast, tm.index));
        const [, open, name, attrName, eq, val, close] = tm;
        if (open && name) {
          tagParts.push(<span key={`${match.index}-${tm.index}`} className="text-gray-500">{open}</span>);
          tagParts.push(<span key={`${match.index}-${tm.index}n`} className="text-blue-700 font-medium">{name}</span>);
        } else if (attrName) {
          tagParts.push(<span key={`${match.index}-${tm.index}a`} className="text-red-700">{attrName}</span>);
          if (eq) tagParts.push(<span key={`${match.index}-${tm.index}e`} className="text-gray-500">{eq}</span>);
          if (val) tagParts.push(<span key={`${match.index}-${tm.index}v`} className="text-green-600">{val}</span>);
        } else if (close) {
          tagParts.push(<span key={`${match.index}-${tm.index}c`} className="text-gray-500">{close}</span>);
        }
        tagLast = tagRegex.lastIndex;
      }
      if (tagLast < tag.length) tagParts.push(tag.slice(tagLast));
      parts.push(<span key={match.index}>{tagParts}</span>);
    } else if (attrVal) {
      parts.push(<span key={match.index} className="text-green-600">{attrVal}</span>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ─── Highlight dispatch ─────────────────────────────────────────────────────
function highlightLines(text: string, language?: string): React.ReactNode[] {
  return text.split('\n').map((line, i) => {
    let nodes: React.ReactNode[];
    switch (language) {
      case 'json':
        nodes = highlightJson(line);
        break;
      case 'css':
        nodes = highlightCss(line);
        break;
      case 'html':
        nodes = highlightHtml(line);
        break;
      default:
        nodes = [line];
    }
    return <div key={i}>{nodes}</div>;
  });
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function ToolResult({
  value,
  label = 'Result',
  language,
  className = '',
  showCopy = true,
  showDownload = false,
  downloadFilename = 'result.txt',
  theme = 'dark',
}: ToolResultProps) {
  if (!value) return null;

  const isLight = theme === 'light';

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-2">
          {showCopy && <CopyButton text={value} />}
          {showDownload && (
            <DownloadButton content={value} filename={downloadFilename} />
          )}
        </div>
      </div>
      <div className="relative">
        <pre
          className={`w-full px-4 py-3 text-sm font-mono rounded-lg overflow-x-auto ${
            isLight
              ? 'bg-white border border-gray-200 text-gray-800'
              : `bg-gray-900 text-gray-100 ${language ? `language-${language}` : ''}`
          }`}
        >
          <code>{isLight ? highlightLines(value, language) : value}</code>
        </pre>
      </div>
    </div>
  );
}
