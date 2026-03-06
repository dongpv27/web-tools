'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function YoutubePlaylistIdExtractorClient() {
  const [url, setUrl] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');

  const extract = () => {
    setError('');
    setPlaylistId('');
    setVideoId('');

    if (!url.trim()) {
      setError('Please enter a YouTube playlist URL');
      return;
    }

    // Extract playlist ID
    const playlistMatch = url.match(/[?&]list=([^&]+)/);
    if (!playlistMatch) {
      setError('No playlist ID found in the URL. Make sure the URL contains a "list" parameter.');
      return;
    }

    setPlaylistId(playlistMatch[1]);

    // Also extract video ID if present
    const videoMatch = url.match(/[?&]v=([^&]+)/);
    if (videoMatch) {
      setVideoId(videoMatch[1]);
    }
  };

  const clear = () => {
    setUrl('');
    setPlaylistId('');
    setVideoId('');
    setError('');
  };

  const loadSample = () => {
    setUrl('https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Playlist URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/playlist?list=..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Works with playlist URLs and video URLs within a playlist
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={extract} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Extract Playlist ID</button>
        <button onClick={loadSample} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Load Sample</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {playlistId && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Playlist ID</p>
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono font-bold text-green-900">{playlistId}</code>
              <CopyButton text={playlistId} />
            </div>
          </div>

          {videoId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Video ID (from URL)</p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800">{videoId}</code>
                <CopyButton text={videoId} />
              </div>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Useful URLs</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <code className="text-xs text-gray-700 truncate flex-1">
                  https://www.youtube.com/playlist?list={playlistId}
                </code>
                <CopyButton text={`https://www.youtube.com/playlist?list=${playlistId}`} />
              </div>
              <div className="flex items-center justify-between">
                <code className="text-xs text-gray-700 truncate flex-1">
                  https://www.youtube.com/embed/videoseries?list={playlistId}
                </code>
                <CopyButton text={`https://www.youtube.com/embed/videoseries?list=${playlistId}`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Embed Code</p>
            <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
{`<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/videoseries?list=${playlistId}"
  frameborder="0"
  allowfullscreen
></iframe>`}
            </pre>
            <CopyButton
              text={`<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=${playlistId}" frameborder="0" allowfullscreen></iframe>`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
