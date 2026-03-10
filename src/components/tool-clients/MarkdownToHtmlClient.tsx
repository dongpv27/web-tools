'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function MarkdownToHtmlClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const parseMarkdown = (markdown: string): string => {
    let html = markdown;

    // Escape HTML entities first
    html = html.replace(/&/g, '&amp;');
    html = html.replace(/</g, '&lt;');
    html = html.replace(/>/g, '&gt;');

    // Headers (h1-h6)
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');

    // Unordered lists
    html = html.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs (lines not already wrapped)
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
      if (line.trim() === '') return '';
      if (line.match(/^<(h[1-6]|p|div|ul|ol|li|blockquote|pre|hr|img)/)) return line;
      if (line.match(/<\/(h[1-6]|p|div|ul|ol|li|blockquote|pre)>$/)) return line;
      if (line.startsWith('<li>')) return line;
      return `<p>${line}</p>`;
    });
    html = processedLines.join('\n');

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  };

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter Markdown content');
      return;
    }

    try {
      const html = parseMarkdown(input);
      setOutput(html);
    } catch (e) {
      setError('Error parsing Markdown: ' + (e as Error).message);
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput(`# Heading 1
## Heading 2

This is **bold** and *italic* text.

Here's a [link](https://example.com) and some \`inline code\`.

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

- List item 1
- List item 2
- List item 3

> This is a blockquote

---

1. First item
2. Second item
3. Third item`);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Markdown Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="# Your markdown here..."
          className="w-full h-48 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Convert to HTML</button>
        <button onClick={loadSample} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Load Sample</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {output && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">HTML Output</label>
              <CopyButton text={output} />
            </div>
            <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap min-h-[200px]">
              {output}
            </pre>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Preview</label>
            <div
              className="p-4 bg-white border border-gray-200 rounded-lg prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
