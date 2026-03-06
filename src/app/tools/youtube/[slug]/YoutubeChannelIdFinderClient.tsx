'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function YoutubeChannelIdFinderClient() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{
    channelId: string;
    handle: string;
    customUrl: string;
  } | null>(null);
  const [error, setError] = useState('');

  const extract = () => {
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a YouTube channel URL');
      return;
    }

    // Extract channel ID from various URL formats
    const patterns = [
      /youtube\.com\/channel\/([^/?&]+)/,
      /youtube\.com\/@([^/?&]+)/,
      /youtube\.com\/c\/([^/?&]+)/,
      /youtube\.com\/user\/([^/?&]+)/,
    ];

    let channelId = '';
    let handle = '';

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const value = match[1];
        if (pattern.source.includes('/channel/')) {
          channelId = value;
        } else {
          handle = value;
        }
        break;
      }
    }

    if (!channelId && !handle) {
      setError('Invalid YouTube channel URL. Please enter a valid channel URL.');
      return;
    }

    // If we only have handle, we can't get the actual channel ID without API
    // This is a limitation of client-side processing
    setResult({
      channelId: channelId || '(Requires YouTube API to extract)',
      handle: handle ? `@${handle}` : '',
      customUrl: handle ? `https://www.youtube.com/@${handle}` : `https://www.youtube.com/channel/${channelId}`,
    });
  };

  const clear = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const loadSample = () => {
    setUrl('https://www.youtube.com/@MrBeast');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/@channelname"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: /channel/, /@handle, /c/, /user/
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={extract} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Extract Channel Info</button>
        <button onClick={loadSample} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Load Sample</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {result && (
        <div className="space-y-4">
          {result.channelId !== '(Requires YouTube API to extract)' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-600 mb-1">Channel ID</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-bold text-green-900">{result.channelId}</code>
                <CopyButton text={result.channelId} />
              </div>
            </div>
          )}

          {result.handle && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Handle</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-gray-800">{result.handle}</code>
                <CopyButton text={result.handle} />
              </div>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Channel URL</p>
            <div className="flex items-center justify-between">
              <code className="text-sm text-gray-800 truncate flex-1">{result.customUrl}</code>
              <CopyButton text={result.customUrl} />
            </div>
          </div>

          {result.channelId === '(Requires YouTube API to extract)' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> To get the actual Channel ID from a handle URL, YouTube's API is required.
                The handle URL format still works for accessing the channel.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
