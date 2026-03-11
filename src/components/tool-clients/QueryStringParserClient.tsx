'use client';

import { useState, useMemo } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface ParsedParam {
  key: string;
  value: string;
  decodedKey: string;
  decodedValue: string;
}

export default function QueryStringParserClient() {
  const [input, setInput] = useState('');

  const parsedParams = useMemo((): ParsedParam[] | null => {
    if (!input.trim()) return null;

    try {
      let queryString = input.trim();

      // Extract query string from URL if needed
      if (queryString.includes('?')) {
        queryString = queryString.split('?')[1] || '';
      }

      // Remove hash fragment
      if (queryString.includes('#')) {
        queryString = queryString.split('#')[0];
      }

      if (!queryString) return [];

      const params: ParsedParam[] = [];
      const pairs = queryString.split('&');

      for (const pair of pairs) {
        const [key, value = ''] = pair.split('=');
        if (key) {
          params.push({
            key,
            value,
            decodedKey: decodeURIComponent(key),
            decodedValue: decodeURIComponent(value),
          });
        }
      }

      return params;
    } catch {
      return null;
    }
  }, [input]);

  const handleSample = () => {
    setInput('https://example.com/search?q=hello+world&page=1&sort=desc&filter%5Bstatus%5D=active');
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">URL or Query String</label>
          <button
            onClick={handleSample}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="https://example.com?key=value&foo=bar or key=value&foo=bar"
          rows={3}
        />
      </div>

      <button
        onClick={handleClear}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        Clear
      </button>

      {parsedParams && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Parsed Parameters</h3>
            <span className="text-sm text-gray-500">{parsedParams.length} parameter(s)</span>
          </div>

          {parsedParams.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">No parameters found in the query string.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">Parameter</th>
                    <th className="text-left p-3 font-medium text-gray-700">Value</th>
                    <th className="text-left p-3 font-medium text-gray-700">Decoded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parsedParams.map((param, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-blue-600">{param.decodedKey}</td>
                      <td className="p-3 font-mono text-gray-600">{param.value || '(empty)'}</td>
                      <td className="p-3 font-mono text-green-600">{param.decodedValue || '(empty)'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {parsedParams.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">As JSON</h4>
              <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(
                  Object.fromEntries(parsedParams.map(p => [p.decodedKey, p.decodedValue])),
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
