'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function HtmlFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const formatHtml = (html: string, indentSize: number): string => {
    const indent = ' '.repeat(indentSize);
    let formatted = '';
    let currentIndent = 0;
    let inPre = false;
    let inScript = false;
    let inStyle = false;

    // Remove extra whitespace between tags
    html = html.replace(/>\s+</g, '><');

    // Split by tags while keeping them
    const tokens = html.split(/(<[^>]+>)/g).filter(t => t.trim());

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();
      if (!token) continue;

      // Check for pre, script, style tags
      if (token.toLowerCase() === '<pre>') inPre = true;
      if (token.toLowerCase() === '</pre>') inPre = false;
      if (token.toLowerCase() === '<script>') inScript = true;
      if (token.toLowerCase() === '</script>') inScript = false;
      if (token.toLowerCase() === '<style>') inStyle = true;
      if (token.toLowerCase() === '</style>') inStyle = false;

      if (inPre || inScript || inStyle) {
        formatted += token;
        continue;
      }

      // Self-closing tags
      const isSelfClosing = token.endsWith('/>') || /^<br\s*\/?>/i.test(token) ||
        /^<hr\s*\/?>/i.test(token) || /^<img[^>]*>/i.test(token) ||
        /^<input[^>]*>/i.test(token) || /^<meta[^>]*>/i.test(token) ||
        /^<link[^>]*>/i.test(token);

      // Closing tag
      const isClosing = token.startsWith('</');

      // Opening tag (not self-closing)
      const isOpening = token.startsWith('<') && !isClosing && !isSelfClosing;

      if (isClosing) {
        currentIndent = Math.max(0, currentIndent - 1);
        formatted += '\n' + indent.repeat(currentIndent) + token;
      } else if (isSelfClosing) {
        formatted += '\n' + indent.repeat(currentIndent) + token;
      } else if (isOpening) {
        formatted += '\n' + indent.repeat(currentIndent) + token;
        currentIndent++;
      } else {
        // Text content
        formatted += token;
      }
    }

    return formatted.trim();
  };

  const format = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter HTML to format');
      return;
    }

    try {
      const formatted = formatHtml(input, indent);
      setOutput(formatted);
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
      const minified = input
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
      setOutput(minified);
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
    setInput('<div class="container"><header><h1>Welcome</h1></header><main><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></main><footer><p>&copy; 2024</p></footer></div>');
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
        />
      </div>

      {/* Options */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Indent:</label>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
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
        <ToolResult value={output} label="Formatted HTML" language="html" />
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
