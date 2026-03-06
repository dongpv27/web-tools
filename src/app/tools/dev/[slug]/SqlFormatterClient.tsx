'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function SqlFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatSql = (sql: string): string => {
    // Basic SQL formatting
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
      'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
      'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE',
      'DROP TABLE', 'INDEX', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT',
      'NULL', 'NOT NULL', 'DEFAULT', 'AUTO_INCREMENT', 'IDENTITY', 'UNIQUE', 'CHECK',
      'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'DISTINCT', 'ALL', 'TOP',
      'INNER', 'OUTER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'NATURAL',
      'ASC', 'DESC', 'NULLS FIRST', 'NULLS LAST',
      'WITH', 'RECURSIVE', 'TEMPORARY', 'TEMP', 'IF EXISTS', 'IF NOT EXISTS'
    ];

    // Normalize whitespace
    sql = sql.replace(/\s+/g, ' ').trim();

    // Add newlines before major keywords
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sql = sql.replace(regex, '\n' + keyword);
    }

    // Handle parentheses
    sql = sql.replace(/\(/g, ' (\n');
    sql = sql.replace(/\)/g, '\n)');

    // Split into lines and indent
    const lines = sql.split('\n');
    let indent = 0;
    const formatted: string[] = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Decrease indent for closing parentheses
      if (line === ')') {
        indent = Math.max(0, indent - 1);
      }

      // Add indented line
      formatted.push('  '.repeat(indent) + line);

      // Increase indent for opening parentheses
      if (line.includes('(') && !line.includes(')')) {
        indent++;
      }
    }

    return formatted.join('\n').trim();
  };

  const format = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter SQL to format');
      return;
    }

    try {
      const formatted = formatSql(input);
      setOutput(formatted);
    } catch (e) {
      setError(`Error formatting SQL: ${(e as Error).message}`);
    }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter SQL to minify');
      return;
    }

    try {
      const minified = input
        .replace(/--.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\s+/g, ' ')
        .trim();
      setOutput(minified);
    } catch (e) {
      setError(`Error minifying SQL: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput("SELECT u.id, u.name, u.email, o.order_id, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2024-01-01' ORDER BY o.total DESC LIMIT 10");
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">SQL Input</label>
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
          placeholder="SELECT * FROM table..."
          rows={6}
        />
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
        <ToolResult value={output} label="Formatted SQL" language="sql" />
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
