'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function YoutubeTimestampClient() {
  const [url, setUrl] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState('');
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

  const generate = () => {
    setError('');
    setResult('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(url.trim());
    if (!id) {
      setError('Invalid YouTube URL');
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const timestampedUrl = `https://www.youtube.com/watch?v=${id}&t=${totalSeconds}`;

    setResult(timestampedUrl);
  };

  const clear = () => {
    setUrl('');
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setResult('');
    setError('');
  };

  const formatTime = () => {
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timestamp</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hours</label>
            <input
              type="number"
              min="0"
              max="99"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Seconds</label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Total: {formatTime()}</p>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Generate Timestamped URL</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-800">Timestamped URL:</span>
              <CopyButton text={result} />
            </div>
            <code className="text-sm text-green-900 break-all mt-2 block">{result}</code>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Quick timestamps:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '0:30', h: 0, m: 0, s: 30 },
                { label: '1:00', h: 0, m: 1, s: 0 },
                { label: '2:00', h: 0, m: 2, s: 0 },
                { label: '5:00', h: 0, m: 5, s: 0 },
                { label: '10:00', h: 0, m: 10, s: 0 },
              ].map(({ label, h, m, s }) => (
                <button
                  key={label}
                  onClick={() => { setHours(h); setMinutes(m); setSeconds(s); }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
