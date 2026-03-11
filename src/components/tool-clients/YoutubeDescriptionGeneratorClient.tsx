'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function YoutubeDescriptionGeneratorClient() {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeSocial, setIncludeSocial] = useState(true);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setDescription('');

    if (!title.trim()) {
      setError('Please enter a video title');
      return;
    }

    const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
    const keywordSection = keywordList.length > 0
      ? `\n\n📌 Related Topics:\n${keywordList.map(k => `• ${k}`).join('\n')}`
      : '';

    const timestampSection = includeTimestamps
      ? `\n\n⏰ Timestamps:\n0:00 - Introduction\n1:00 - Main Topic\n5:00 - Tips & Tricks\n10:00 - Conclusion`
      : '';

    const socialSection = includeSocial
      ? `\n\n📱 Connect with me:\n• Website: [Your Website]\n• Twitter: [Your Twitter]\n• Instagram: [Your Instagram]\n• Facebook: [Your Facebook]`
      : '';

    const generated = `🎬 ${title}

Welcome to this video! In this tutorial, I'll show you everything you need to know about ${title.toLowerCase()}.

If you found this video helpful, please LIKE and SUBSCRIBE for more content! 👍
${keywordSection}${timestampSection}${socialSection}

🔔 Subscribe for more tips: [Your Channel Link]

💼 Business Inquiries: [Your Email]

---
#${title.replace(/\s+/g, '').toLowerCase()} #youtube #tutorial #howto${keywordList.length > 0 ? ' ' + keywordList.map(k => '#' + k.replace(/\s+/g, '')).join(' ') : ''}

Thanks for watching! 🙏`;

    setDescription(generated);
  };

  const clear = () => {
    setTitle('');
    setKeywords('');
    setDescription('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your video title..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="keyword1, keyword2, keyword3..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeTimestamps}
            onChange={(e) => setIncludeTimestamps(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-600">Include timestamp template</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSocial}
            onChange={(e) => setIncludeSocial(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-600">Include social links section</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Generate Description</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {description && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Generated Description</label>
            <div className="flex gap-2">
              <CopyButton text={description} />
              <DownloadButton content={description} filename="youtube-description.txt" />
            </div>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-64 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg resize-y"
          />
          <p className="text-xs text-gray-500 mt-1">{description.length} characters</p>
        </div>
      )}
    </div>
  );
}
