'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function CapitalizeSentencesClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const capitalize = () => {
    if (!input.trim()) return;

    // Capitalize first letter of sentences
    let result = input.toLowerCase();

    // Capitalize after sentence endings
    result = result.replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());

    // Capitalize first letter
    result = result.charAt(0).toUpperCase() + result.slice(1);

    setOutput(result);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Input Text</label>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Enter text to capitalize sentences..."
          rows={6}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={capitalize}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Capitalize Sentences
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
        <ToolResult value={output} label="Capitalized Text" textClassName="text-gray-100" />
      )}
    </div>
  );
}
