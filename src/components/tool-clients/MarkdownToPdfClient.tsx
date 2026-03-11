'use client';

import { useState } from 'react';

export default function MarkdownToPdfClient() {
  const [markdownInput, setMarkdownInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const simpleMarkdownToHtml = (md: string): string => {
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Unordered lists
      .replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>')
      // Ordered lists
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>')
      // Blockquotes
      .replace(/^>\s+(.*$)/gim, '<blockquote>$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    return `<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
<p>${html}</p>
</div>`;
  };

  const convertToPdf = async () => {
    if (!markdownInput.trim()) {
      setError('Please enter Markdown content');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const html = simpleMarkdownToHtml(markdownInput);

      // Create a printable document
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setError('Please allow popups to generate PDF');
        setIsProcessing(false);
        return;
      }

      printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Markdown Document</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 24px; margin-bottom: 16px; }
    h2 { font-size: 20px; margin-bottom: 14px; }
    h3 { font-size: 16px; margin-bottom: 12px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 16px; color: #666; }
    a { color: #0066cc; }
    hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
${html}
</body>
</html>
      `);

      printWindow.document.close();

      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        setIsProcessing(false);
      }, 500);
    } catch (e) {
      setError('Error converting Markdown: ' + (e as Error).message);
      setIsProcessing(false);
    }
  };

  const loadSample = () => {
    setMarkdownInput(`# Sample Document

This is a **sample** Markdown document.

## Features

- Bold text with **double asterisks**
- Italic text with *single asterisks*
- \`inline code\` with backticks

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Links

Visit [Google](https://google.com) for more information.

> This is a blockquote.

---

Thank you for using our Markdown to PDF converter!`);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Markdown Input</label>
          <button
            onClick={loadSample}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          rows={12}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="# Enter your Markdown here..."
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
        onClick={convertToPdf}
        disabled={isProcessing}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isProcessing ? 'Generating...' : 'Generate PDF'}
      </button>

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>This tool converts Markdown to a printable document. After clicking "Generate PDF", a print dialog will open where you can save as PDF.</p>
        <p className="mt-2">Supports: headers, bold, italic, links, code blocks, lists, blockquotes, and horizontal rules.</p>
      </div>
    </div>
  );
}
