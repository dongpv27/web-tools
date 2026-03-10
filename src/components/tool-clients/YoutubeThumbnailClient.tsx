'use client';

import { useState } from 'react';

export default function YoutubeThumbnailClient() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (input: string): string | null => {
    // Various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Just the video ID
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getThumbnails = () => {
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

  const thumbnails = videoId ? [
    { quality: 'Max Resolution', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, size: '1280×720' },
    { quality: 'High Quality', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, size: '480×360' },
    { quality: 'Standard', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, size: '640×480' },
    { quality: 'Medium', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, size: '320×180' },
    { quality: 'Default', url: `https://img.youtube.com/vi/${videoId}/default.jpg`, size: '120×90' },
  ] : [];

  const download = async (thumbnailUrl: string, quality: string) => {
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `youtube-thumbnail-${videoId}-${quality}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  const clear = () => {
    setUrl('');
    setVideoId('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
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

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={getThumbnails}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Thumbnails
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Thumbnails */}
      {videoId && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Video ID: <code className="bg-gray-100 px-2 py-0.5 rounded">{videoId}</code></p>

          <div className="grid gap-4">
            {thumbnails.map((thumb) => (
              <div key={thumb.quality} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{thumb.quality}</span>
                  <span className="text-sm text-gray-500">{thumb.size}</span>
                </div>
                <img
                  src={thumb.url}
                  alt={`${thumb.quality} thumbnail`}
                  className="w-full max-w-md rounded-lg mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  onClick={() => download(thumb.url, thumb.quality.toLowerCase().replace(' ', '-'))}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
