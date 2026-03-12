'use client';

import { useState, useEffect } from 'react';
import ToolResult from '@/components/tools/ToolResult';

export default function TimestampConverterClient() {
  const [timestamp, setTimestamp] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [result, setResult] = useState<{
    iso: string;
    utc: string;
    local: string;
    relative: string;
  } | null>(null);
  const [error, setError] = useState('');

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (Math.abs(days) > 0) {
      return days > 0 ? `${days} days from now` : `${Math.abs(days)} days ago`;
    }
    if (Math.abs(hours) > 0) {
      return hours > 0 ? `${hours} hours from now` : `${Math.abs(hours)} hours ago`;
    }
    if (Math.abs(minutes) > 0) {
      return minutes > 0 ? `${minutes} minutes from now` : `${Math.abs(minutes)} minutes ago`;
    }
    return seconds > 0 ? `${seconds} seconds from now` : `${Math.abs(seconds)} seconds ago`;
  };

  const convertTimestamp = () => {
    setError('');
    if (!timestamp.trim()) {
      setError('Please enter a timestamp');
      return;
    }

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) {
      setError('Invalid timestamp format');
      return;
    }

    // Determine if timestamp is likely seconds or milliseconds
    // Unix timestamps > 1e12 (year 2001) are typically seconds
    // Also check if timestamp matches current time more closely as seconds vs milliseconds
    const now = Date.now();
    const isLikelySeconds = ts < 1e12 && Math.abs(now - ts * 1000) > Math.abs(now - ts);
    const ms = isLikelySeconds ? ts * 1000 : ts;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setError('Invalid timestamp');
      return;
    }

    setResult({
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative: formatRelativeTime(ms - now),
    });
  };

  const convertDate = () => {
    setError('');
    if (!dateInput.trim()) {
      setError('Please enter a date');
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError('Invalid date format');
      return;
    }

    setTimestamp(Math.floor(date.getTime() / 1000).toString());
    setResult({
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative: formatRelativeTime(date.getTime() - Date.now()),
    });
  };

  const useCurrentTime = () => {
    const now = Date.now();
    setTimestamp(Math.floor(now / 1000).toString());
    setDateInput(new Date(now).toISOString().slice(0, 16));
    setResult({
      iso: new Date(now).toISOString(),
      utc: new Date(now).toUTCString(),
      local: new Date(now).toLocaleString(),
      relative: 'now',
    });
  };

  const clearAll = () => {
    setTimestamp('');
    setDateInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Current Time:</span>{' '}
          <code className="bg-blue-100 px-2 py-0.5 rounded">{Math.floor(currentTime / 1000)}</code>
          {' '}(Unix timestamp)
        </p>
      </div>

      {/* Timestamp to Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timestamp to Date
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="Enter Unix timestamp (e.g., 1699900000)"
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            onClick={convertTimestamp}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Convert
          </button>
        </div>
      </div>

      {/* Date to Timestamp */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date to Timestamp
        </label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={convertDate}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Convert
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={useCurrentTime}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Use Current Time
        </button>
        <button
          onClick={clearAll}
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

      {/* Result */}
      {result && !error && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Result</h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">ISO 8601</span>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono">{result.iso}</code>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">UTC</span>
              <code className="text-sm font-mono">{result.utc}</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Local</span>
              <code className="text-sm font-mono">{result.local}</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Relative</span>
              <code className="text-sm font-mono">{result.relative}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
