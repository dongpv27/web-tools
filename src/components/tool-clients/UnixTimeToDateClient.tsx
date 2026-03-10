'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function UnixTimeToDateClient() {
  const [timestamp, setTimestamp] = useState('');
  const [results, setResults] = useState<{
    iso: string;
    utc: string;
    local: string;
    relative: string;
  } | null>(null);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    setResults(null);

    if (!timestamp.trim()) {
      setError('Please enter a Unix timestamp');
      return;
    }

    const ts = parseInt(timestamp.trim(), 10);

    if (isNaN(ts)) {
      setError('Invalid timestamp - must be a number');
      return;
    }

    // Handle both seconds and milliseconds
    const ms = ts < 10000000000 ? ts * 1000 : ts;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setError('Invalid date from timestamp');
      return;
    }

    // Calculate relative time
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.abs(Math.floor(diff / 1000));
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    let relative = '';
    const past = diff > 0;

    if (seconds < 60) {
      relative = `${seconds} second${seconds !== 1 ? 's' : ''} ${past ? 'ago' : 'from now'}`;
    } else if (minutes < 60) {
      relative = `${minutes} minute${minutes !== 1 ? 's' : ''} ${past ? 'ago' : 'from now'}`;
    } else if (hours < 24) {
      relative = `${hours} hour${hours !== 1 ? 's' : ''} ${past ? 'ago' : 'from now'}`;
    } else if (days < 365) {
      relative = `${days} day${days !== 1 ? 's' : ''} ${past ? 'ago' : 'from now'}`;
    } else {
      relative = `${years} year${years !== 1 ? 's' : ''} ${past ? 'ago' : 'from now'}`;
    }

    setResults({
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative,
    });
  };

  const setCurrentTime = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
    setError('');
  };

  const clear = () => {
    setTimestamp('');
    setResults(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Unix Timestamp</label>
        <input
          type="text"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          placeholder="e.g., 1703145600"
          className="w-full px-4 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Enter timestamp in seconds or milliseconds</p>
      </div>

      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Convert</button>
        <button onClick={setCurrentTime} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Current Time</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {results && (
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">ISO 8601</p>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800">{results.iso}</code>
              <CopyButton text={results.iso} />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">UTC</p>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800">{results.utc}</code>
              <CopyButton text={results.utc} />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Local Time</p>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800">{results.local}</code>
              <CopyButton text={results.local} />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">Relative</p>
            <code className="text-sm font-mono text-blue-800">{results.relative}</code>
          </div>
        </div>
      )}
    </div>
  );
}
