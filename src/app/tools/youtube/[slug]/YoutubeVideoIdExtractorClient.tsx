'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function YoutubeVideoIdExtractorClient() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');

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
    setVideoId('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(url.trim());
    if (!id) {
      setError('Invalid YouTube URL. Please enter a valid video URL.');
      return;
    }

    setVideoId(id);
  };

  const clear = () => {
    setUrl('');
    setVideoId('');
    setError('');
  };

  const loadSample = () => {
    setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={extract} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Extract Video ID</button>
        <button onClick={loadSample} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Load Sample</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {videoId && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-800">Video ID:</span>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold text-green-900">{videoId}</code>
                <CopyButton text={videoId} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Video URLs:</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <code className="text-gray-700 truncate flex-1">https://www.youtube.com/watch?v={videoId}</code>
                <CopyButton text={`https://www.youtube.com/watch?v=${videoId}`} />
              </div>
              <div className="flex items-center justify-between">
                <code className="text-gray-700 truncate flex-1">https://youtu.be/{videoId}</code>
                <CopyButton text={`https://youtu.be/${videoId}`} />
              </div>
              <div className="flex items-center justify-between">
                <code className="text-gray-700 truncate flex-1">https://www.youtube.com/embed/{videoId}</code>
                <CopyButton text={`https://www.youtube.com/embed/${videoId}`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Thumbnail URLs:</p>
            <div className="space-y-2">
              {['maxresdefault', 'hqdefault', 'mqdefault', 'default'].map((quality) => (
                <div key={quality} className="flex items-center justify-between">
                  <code className="text-xs text-gray-700 truncate flex-1">https://img.youtube.com/vi/{videoId}/{quality}.jpg</code>
                  <CopyButton text={`https://img.youtube.com/vi/${videoId}/${quality}.jpg`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
