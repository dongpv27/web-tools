'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function JsonToCsvClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const data = JSON.parse(input);

      if (!Array.isArray(data)) {
        setError('JSON must be an array of objects');
        return;
      }

      if (data.length === 0) {
        setError('Array is empty');
        return;
      }

      // Get all unique headers
      const headers = [...new Set(data.flatMap(obj => Object.keys(obj)))];

      // Create CSV rows
      const csvRows: string[] = [];

      // Header row
      csvRows.push(headers.map(h => `"${h}"`).join(','));

      // Data rows
      for (const item of data) {
        const values = headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }

      setOutput(csvRows.join('\n'));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput(JSON.stringify([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'Los Angeles' },
      { name: 'Bob', age: 35, city: 'Chicago' }
    ], null, 2));
    setError('');
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">JSON Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          className="w-full h-48 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Convert to CSV</button>
        <button onClick={loadSample} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Load Sample</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">CSV Output</label>
            <div className="flex gap-2">
              <button onClick={download} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Download CSV</button>
              <CopyButton text={output} />
            </div>
          </div>
          <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap min-h-[200px]">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
