'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function HtmlToMarkdownClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter HTML content');
      return;
    }

    try {
      let md = input;

      // Remove script and style tags with content
      md = md.replace(/<script[\s\S]*?<\/script>/gi, '');
      md = md.replace(/<style[\s\S]*?<\/style>/gi, '');

      // Headers
      md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
      md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
      md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
      md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
      md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
      md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');

      // Bold
      md = md.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');

      // Italic
      md = md.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');

      // Strikethrough
      md = md.replace(/<(del|s)[^>]*>(.*?)<\/(del|s)>/gi, '~~$2~~');

      // Links
      md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

      // Images
      md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
      md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

      // Code blocks
      md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```');

      // Inline code
      md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

      // Blockquotes
      md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
        return content.split('\n').map((line: string) => `> ${line}`).join('\n');
      });

      // Lists
      md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
      md = md.replace(/<[ou]l[^>]*>/gi, '\n');
      md = md.replace(/<\/[ou]l>/gi, '\n');

      // Paragraphs
      md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

      // Line breaks
      md = md.replace(/<br\s*\/?>/gi, '\n');

      // Horizontal rules
      md = md.replace(/<hr\s*\/?>/gi, '\n---\n');

      // Divs - just add newlines
      md = md.replace(/<div[^>]*>/gi, '');
      md = md.replace(/<\/div>/gi, '\n');

      // Remove remaining tags
      md = md.replace(/<[^>]+>/g, '');

      // Decode HTML entities
      md = md.replace(/&amp;/g, '&');
      md = md.replace(/&lt;/g, '<');
      md = md.replace(/&gt;/g, '>');
      md = md.replace(/&quot;/g, '"');
      md = md.replace(/&#39;/g, "'");
      md = md.replace(/&nbsp;/g, ' ');

      // Clean up extra whitespace
      md = md.replace(/\n{3,}/g, '\n\n');
      md = md.trim();

      setOutput(md);
    } catch (e) {
      setError('Error parsing HTML: ' + (e as Error).message);
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput(`<h1>Main Heading</h1>
<h2>Subheading</h2>

<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>

<p>Here's a <a href="https://example.com">link</a> to example.com.</p>

<ul>
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</ul>

<blockquote>
  This is a quote
</blockquote>

<pre><code>const x = 42;</code></pre>

<hr>

<p>The end.</p>`);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">HTML Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<h1>Your HTML here...</h1>"
          className="w-full h-48 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Convert to Markdown</button>
        <button onClick={loadSample} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Load Sample</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Markdown Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap min-h-[200px]">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
