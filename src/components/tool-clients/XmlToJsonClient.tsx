'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function XmlToJsonClient() {
  const [xmlInput, setXmlInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState('');

  const xmlToJson = (xml: string): unknown => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML: ' + parseError.textContent);
    }

    const elementToObject = (element: Element): unknown => {
      const obj: Record<string, unknown> = {};
      const children = Array.from(element.children);

      if (children.length === 0) {
        return element.textContent?.trim() || '';
      }

      // Group children by tag name
      const grouped: Record<string, Element[]> = {};
      children.forEach(child => {
        const tagName = child.tagName;
        if (!grouped[tagName]) {
          grouped[tagName] = [];
        }
        grouped[tagName].push(child);
      });

      for (const [tagName, elements] of Object.entries(grouped)) {
        if (elements.length === 1) {
          obj[tagName] = elementToObject(elements[0]);
        } else {
          obj[tagName] = elements.map(el => elementToObject(el));
        }
      }

      return obj;
    };

    return elementToObject(doc.documentElement);
  };

  const convert = () => {
    setError('');
    setJsonOutput('');

    if (!xmlInput.trim()) {
      setError('Please enter XML data');
      return;
    }

    try {
      const result = xmlToJson(xmlInput);
      setJsonOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const clear = () => {
    setXmlInput('');
    setJsonOutput('');
    setError('');
  };

  const loadSample = () => {
    setXmlInput(`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>John Doe</name>
  <age>30</age>
  <email>john@example.com</email>
  <address>
    <street>123 Main St</street>
    <city>New York</city>
    <country>USA</country>
  </address>
  <hobbies>
    <hobby>reading</hobby>
    <hobby>coding</hobby>
    <hobby>gaming</hobby>
  </hobbies>
</root>`);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">XML Input</label>
          <button
            onClick={loadSample}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={xmlInput}
          onChange={(e) => setXmlInput(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='<?xml version="1.0" encoding="UTF-8"?>'
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
          Convert to JSON
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {jsonOutput && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">JSON Output</label>
            <CopyButton text={jsonOutput} />
          </div>
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-sm font-mono text-green-400 whitespace-pre">{jsonOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
