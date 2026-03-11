'use client';

import { useState, useMemo } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface ParsedURL {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  host: string;
  origin: string;
  href: string;
}

export default function UrlParserClient() {
  const [input, setInput] = useState('');

  const parsedUrl = useMemo((): ParsedURL | null => {
    if (!input.trim()) return null;

    try {
      const url = new URL(input.trim());
      return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        host: url.host,
        origin: url.origin,
        href: url.href,
      };
    } catch {
      return null;
    }
  }, [input]);

  const handleSample = () => {
    setInput('https://example.com:8080/path/to/page?query=value&foo=bar#section');
  };

  const handleClear = () => {
    setInput('');
  };

  const urlParts = parsedUrl ? [
    { label: 'Protocol', value: parsedUrl.protocol, color: 'text-purple-600' },
    { label: 'Hostname', value: parsedUrl.hostname, color: 'text-blue-600' },
    { label: 'Port', value: parsedUrl.port || '(default)', color: 'text-green-600' },
    { label: 'Path', value: parsedUrl.pathname, color: 'text-orange-600' },
    { label: 'Query String', value: parsedUrl.search || '(none)', color: 'text-cyan-600' },
    { label: 'Fragment', value: parsedUrl.hash || '(none)', color: 'text-pink-600' },
    { label: 'Host', value: parsedUrl.host, color: 'text-blue-600' },
    { label: 'Origin', value: parsedUrl.origin, color: 'text-indigo-600' },
    { label: 'Full URL', value: parsedUrl.href, color: 'text-gray-600' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Enter URL</label>
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
          placeholder="https://example.com:8080/path?query=value#hash"
          rows={2}
        />
      </div>

      <button
        onClick={handleClear}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        Clear
      </button>

      {input && !parsedUrl && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Invalid URL. Please enter a valid URL including the protocol (http:// or https://).</p>
        </div>
      )}

      {parsedUrl && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">URL Components</h3>

          <div className="space-y-3">
            {urlParts.map((part) => (
              <div key={part.label} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">{part.label}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(part.value)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Copy
                  </button>
                </div>
                <code className={`text-sm font-mono ${part.color} break-all`}>
                  {part.value}
                </code>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">As JSON</h4>
            <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
              {JSON.stringify(parsedUrl, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
