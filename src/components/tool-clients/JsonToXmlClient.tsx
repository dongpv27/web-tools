'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function JsonToXmlClient() {
  const [jsonInput, setJsonInput] = useState('');
  const [xmlOutput, setXmlOutput] = useState('');
  const [error, setError] = useState('');

  const jsonToXml = (obj: unknown, rootName = 'root', indent = '  '): string => {
    let xml = '';

    const convertValue = (value: unknown, key: string, level: number): string => {
      const indentation = indent.repeat(level);

      if (value === null || value === undefined) {
        return `${indentation}<${key}/>\n`;
      }

      if (Array.isArray(value)) {
        let result = '';
        value.forEach((item, index) => {
          const itemKey = key.endsWith('s') ? key.slice(0, -1) : key;
          result += convertValue(item, `${itemKey}`, level);
        });
        return result;
      }

      if (typeof value === 'object') {
        let result = `${indentation}<${key}>\n`;
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          result += convertValue(v, k, level + 1);
        }
        result += `${indentation}</${key}>\n`;
        return result;
      }

      // Escape XML special characters
      const escapedValue = String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      return `${indentation}<${key}>${escapedValue}</${key}>\n`;
    };

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += convertValue(obj, rootName, 0);

    return xml;
  };

  const convert = () => {
    setError('');
    setXmlOutput('');

    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const xml = jsonToXml(parsed);
      setXmlOutput(xml);
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };

  const clear = () => {
    setJsonInput('');
    setXmlOutput('');
    setError('');
  };

  const loadSample = () => {
    setJsonInput(JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      hobbies: ["reading", "coding", "gaming"]
    }, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">JSON Input</label>
          <button
            onClick={loadSample}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='{"name": "John", "age": 30}'
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={convert}
          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert to XML
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {xmlOutput && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">XML Output</label>
            <CopyButton text={xmlOutput} />
          </div>
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-sm font-mono text-green-400 whitespace-pre">{xmlOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
