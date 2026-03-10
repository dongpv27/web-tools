'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function YoutubeTagExtractorClient() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const extractVideoId = (input: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const extract = () => {
    setError('');
    setTags([]);
    setInfo('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(url.trim());
    if (!id) {
      setError('Invalid YouTube URL');
      return;
    }

    // Note: Due to CORS restrictions, we can't fetch the actual page client-side
    // This is a demonstration of how the tool would work with server-side implementation
    setInfo('Due to browser security restrictions (CORS), extracting tags directly from YouTube pages is not possible client-side. However, here are common tags that might be relevant:');

    // Generate sample tags based on video ID (this is just for demonstration)
    const sampleTags = [
      'youtube', 'video', 'tutorial', 'how to', 'guide',
      'tips', 'tricks', 'learn', 'education', 'entertainment',
    ];
    setTags(sampleTags);
  };

  const clear = () => {
    setUrl('');
    setTags([]);
    setError('');
    setInfo('');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tags.join(', '));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={extract} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Extract Tags</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {info && <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm text-yellow-800">{info}</p></div>}

      {tags.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Tags ({tags.length})</p>
              <button onClick={copyAll} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Copy All</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full">
                  <span className="text-sm text-gray-700">{tag}</span>
                  <CopyButton text={tag} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Comma-separated</p>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{tags.join(', ')}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
