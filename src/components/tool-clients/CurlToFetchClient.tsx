'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export default function CurlToFetchClient() {
  const [curlInput, setCurlInput] = useState('');
  const [fetchCode, setFetchCode] = useState('');
  const [error, setError] = useState('');

  const parseCurl = (curl: string): ParsedCurl | null => {
    const result: ParsedCurl = {
      method: 'GET',
      url: '',
      headers: {},
    };

    // Remove line breaks and extra spaces
    curl = curl.replace(/\\\s*\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Extract method
    const methodMatch = curl.match(/-X\s+([A-Z]+)/i);
    if (methodMatch) {
      result.method = methodMatch[1];
    }

    // Check for POST/PUT/PATCH without -X
    if (curl.includes('--data') || curl.includes('-d ') || curl.includes('--data-raw')) {
      if (!methodMatch) {
        result.method = 'POST';
      }
    }

    // Extract URL
    const urlMatch = curl.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/);
    if (urlMatch) {
      result.url = urlMatch[1];
    }

    // Extract headers
    const headerRegex = /-H\s+['"]([^'":]+):\s*([^'"]+)['"]/g;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(curl)) !== null) {
      result.headers[headerMatch[1]] = headerMatch[2];
    }

    // Extract body
    const bodyMatch = curl.match(/--data(-raw)?\s+['"]([^'"]+)['"]/);
    if (bodyMatch) {
      result.body = bodyMatch[2];
    }

    // Also check for -d
    const bodyMatch2 = curl.match(/-d\s+['"]([^'"]+)['"]/);
    if (bodyMatch2 && !result.body) {
      result.body = bodyMatch2[1];
    }

    return result;
  };

  const generateFetch = (parsed: ParsedCurl): string => {
    const lines: string[] = [];

    lines.push(`fetch('${parsed.url}', {`);
    lines.push(`  method: '${parsed.method}',`);

    // Add headers
    if (Object.keys(parsed.headers).length > 0) {
      lines.push('  headers: {');
      Object.entries(parsed.headers).forEach(([key, value], index, arr) => {
        lines.push(`    '${key}': '${value}'${index < arr.length - 1 ? ',' : ''}`);
      });
      lines.push('  },');
    }

    // Add body
    if (parsed.body) {
      // Try to format as JSON if possible
      try {
        const jsonBody = JSON.parse(parsed.body);
        lines.push(`  body: JSON.stringify(${JSON.stringify(jsonBody, null, 4).split('\n').join('\n  ')}),`);
      } catch {
        lines.push(`  body: '${parsed.body}',`);
      }
    }

    lines.push('})');
    lines.push('.then(response => response.json())');
    lines.push('.then(data => console.log(data))');
    lines.push(".catch(error => console.error('Error:', error));");

    return lines.join('\n');
  };

  const convert = () => {
    setError('');
    setFetchCode('');

    if (!curlInput.trim()) {
      setError('Please enter a CURL command');
      return;
    }

    const parsed = parseCurl(curlInput);
    if (!parsed || !parsed.url) {
      setError('Could not parse CURL command. Please check the format.');
      return;
    }

    const code = generateFetch(parsed);
    setFetchCode(code);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(fetchCode);
  };

  return (
    <div className="space-y-6">
      {/* CURL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">CURL Command</label>
        <textarea
          value={curlInput}
          onChange={(e) => setCurlInput(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="curl 'https://api.example.com/data' -H 'Content-Type: application/json'"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={convert}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Convert to Fetch
      </button>

      {/* Output */}
      {fetchCode && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Fetch API Code</label>
            <CopyButton text={fetchCode} />
          </div>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-green-400 whitespace-pre">{fetchCode}</pre>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Converts CURL commands to JavaScript fetch API code. Supports headers, body, and various HTTP methods.</p>
      </div>
    </div>
  );
}
