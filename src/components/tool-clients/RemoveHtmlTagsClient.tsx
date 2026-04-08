'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function RemoveHtmlTagsClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removeAttributes, setRemoveAttributes] = useState(false);

  const removeTags = () => {
    if (!input.trim()) return;

    let result = input;

    if (removeAttributes) {
      // Remove all HTML tags completely
      result = result.replace(/<[^>]*>/g, '');
    } else {
      // Just strip tags, keep content
      result = result.replace(/<[^>]*>/g, '');
    }

    // Clean up extra whitespace
    result = result.replace(/\s+/g, ' ').trim();

    setOutput(result);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const loadSample = () => {
    setInput('<div class="container">\n  <h1>Welcome</h1>\n  <p>This is a <strong>sample</strong> HTML text.</p>\n  <ul>\n    <li>Item 1</li>\n    <li>Item 2</li>\n  </ul>\n</div>');
    setOutput('');
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
          placeholder="Paste HTML content..."
          rows={8}
        lineNumbers
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={removeTags}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Remove HTML Tags
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {output && (
        <ToolResult value={output} label="Plain Text" />
      )}

      {/* Stats */}
      {input && output && (
        <div className="text-sm text-gray-500">
          Original: {input.length} chars → Plain text: {output.length} chars
        </div>
      )}
    </div>
  );
}
