'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function CssFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const formatCss = (css: string, indentSize: number): string => {
    const indent = ' '.repeat(indentSize);
    let formatted = '';
    let currentIndent = 0;
    let inAtRule = false;

    // Remove comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');

    // Add newlines after braces and semicolons
    css = css.replace(/\{/g, ' {\n');
    css = css.replace(/\}/g, '\n}\n');
    css = css.replace(/;/g, ';\n');

    const lines = css.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Check for closing brace
      if (line === '}') {
        currentIndent = Math.max(0, currentIndent - 1);
        formatted += indent.repeat(currentIndent) + '}\n';
        if (inAtRule && currentIndent === 0) inAtRule = false;
        continue;
      }

      // Check for @ rules
      if (line.startsWith('@')) {
        inAtRule = true;
      }

      // Check for opening brace
      if (line.endsWith('{')) {
        formatted += indent.repeat(currentIndent) + line + '\n';
        currentIndent++;
        continue;
      }

      // Property or selector
      if (line.includes(':') || line.includes(';')) {
        formatted += indent.repeat(currentIndent) + line + '\n';
      } else if (line) {
        formatted += indent.repeat(currentIndent) + line + '\n';
      }
    }

    return formatted.trim();
  };

  const format = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter CSS to format');
      return;
    }

    try {
      const formatted = formatCss(input, indent);
      setOutput(formatted);
    } catch (e) {
      setError(`Error formatting CSS: ${(e as Error).message}`);
    }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter CSS to minify');
      return;
    }

    try {
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\n/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .trim();
      setOutput(minified);
    } catch (e) {
      setError(`Error minifying CSS: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput('.container{max-width:1200px;margin:0 auto;padding:20px}.header{background:#333;color:#fff;padding:10px 0}.header h1{font-size:24px;margin:0}.content{display:flex;gap:20px}.sidebar{width:250px}.main{flex:1}');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">CSS Input</label>
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
          placeholder=".class { property: value; }"
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
        <ToolResult value={output} label="Formatted CSS" language="css" />
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
