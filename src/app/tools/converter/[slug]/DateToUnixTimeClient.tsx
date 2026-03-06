'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function DateToUnixTimeClient() {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('00:00');
  const [results, setResults] = useState<{
    seconds: number;
    milliseconds: number;
  } | null>(null);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    setResults(null);

    if (!dateInput) {
      setError('Please select a date');
      return;
    }

    const dateTime = `${dateInput}T${timeInput}:00`;
    const date = new Date(dateTime);

    if (isNaN(date.getTime())) {
      setError('Invalid date');
      return;
    }

    setResults({
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    });
  };

  const setCurrentTime = () => {
    const now = new Date();
    setDateInput(now.toISOString().split('T')[0]);
    setTimeInput(now.toTimeString().slice(0, 5));
    setError('');
  };

  const clear = () => {
    setDateInput('');
    setTimeInput('00:00');
    setResults(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Convert</button>
        <button onClick={setCurrentTime} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Current Time</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {results && (
        <div className="space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Unix Timestamp (seconds)</p>
            <div className="flex items-center justify-between">
              <code className="text-2xl font-mono font-bold text-green-800">{results.seconds}</code>
              <CopyButton text={results.seconds.toString()} />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Unix Timestamp (milliseconds)</p>
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono text-gray-800">{results.milliseconds}</code>
              <CopyButton text={results.milliseconds.toString()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
