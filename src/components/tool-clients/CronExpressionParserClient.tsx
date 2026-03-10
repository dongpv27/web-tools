'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface ParsedCron {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  description: string;
  nextRuns: Date[];
}

export default function CronExpressionParserClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ParsedCron | null>(null);
  const [error, setError] = useState('');

  const parseCron = (expression: string): ParsedCron => {
    const parts = expression.trim().split(/\s+/);

    if (parts.length < 5 || parts.length > 6) {
      throw new Error('Cron expression must have 5 or 6 parts');
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Generate description
    const description = generateDescription(minute, hour, dayOfMonth, month, dayOfWeek);

    // Calculate next runs
    const nextRuns = calculateNextRuns(minute, hour, dayOfMonth, month, dayOfWeek, 5);

    return {
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
      description,
      nextRuns,
    };
  };

  const generateDescription = (
    minute: string,
    hour: string,
    dayOfMonth: string,
    month: string,
    dayOfWeek: string
  ): string => {
    const descriptions: string[] = [];

    // Minute
    if (minute === '*') {
      descriptions.push('every minute');
    } else if (minute.includes('/')) {
      const [, step] = minute.split('/');
      descriptions.push(`every ${step} minute${parseInt(step) > 1 ? 's' : ''}`);
    } else if (minute.includes(',')) {
      descriptions.push(`at minute ${minute.replace(/,/g, ', ')}`);
    } else {
      descriptions.push(`at minute ${minute}`);
    }

    // Hour
    if (hour !== '*') {
      if (hour.includes('/')) {
        const [, step] = hour.split('/');
        descriptions[0] = descriptions[0].replace('every minute', '');
        descriptions.push(`every ${step} hour${parseInt(step) > 1 ? 's' : ''}`);
      } else if (hour.includes(',')) {
        descriptions.push(`at hour ${hour.replace(/,/g, ', ')}`);
      } else {
        descriptions.push(`at hour ${hour}`);
      }
    }

    // Day of month
    if (dayOfMonth !== '*') {
      descriptions.push(`on day ${dayOfMonth} of the month`);
    }

    // Month
    if (month !== '*') {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

      if (month.includes(',')) {
        const months = month.split(',').map(m => monthNames[parseInt(m) - 1]);
        descriptions.push(`in ${months.join(', ')}`);
      } else {
        descriptions.push(`in ${monthNames[parseInt(month) - 1]}`);
      }
    }

    // Day of week
    if (dayOfWeek !== '*') {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      if (dayOfWeek.includes(',')) {
        const days = dayOfWeek.split(',').map(d => dayNames[parseInt(d)]);
        descriptions.push(`on ${days.join(', ')}`);
      } else {
        descriptions.push(`on ${dayNames[parseInt(dayOfWeek)]}`);
      }
    }

    return descriptions.join(', ').replace(/,+/g, ',').trim();
  };

  const calculateNextRuns = (
    minute: string,
    hour: string,
    dayOfMonth: string,
    month: string,
    dayOfWeek: string,
    count: number
  ): Date[] => {
    const runs: Date[] = [];
    let current = new Date();
    current.setSeconds(0);
    current.setMilliseconds(0);
    current.setMinutes(current.getMinutes() + 1); // Start from next minute

    const maxIterations = 366 * 24 * 60; // Max 1 year of minutes
    let iterations = 0;

    while (runs.length < count && iterations < maxIterations) {
      iterations++;

      // Check minute
      if (!matchesCronPart(minute, current.getMinutes(), 0, 59)) {
        current.setMinutes(current.getMinutes() + 1);
        continue;
      }

      // Check hour
      if (!matchesCronPart(hour, current.getHours(), 0, 23)) {
        current.setHours(current.getHours() + 1);
        current.setMinutes(0);
        continue;
      }

      // Check day of month
      if (!matchesCronPart(dayOfMonth, current.getDate(), 1, 31)) {
        current.setDate(current.getDate() + 1);
        current.setHours(0);
        current.setMinutes(0);
        continue;
      }

      // Check month
      if (!matchesCronPart(month, current.getMonth() + 1, 1, 12)) {
        current.setMonth(current.getMonth() + 1);
        current.setDate(1);
        current.setHours(0);
        current.setMinutes(0);
        continue;
      }

      // Check day of week
      if (!matchesCronPart(dayOfWeek, current.getDay(), 0, 6)) {
        current.setDate(current.getDate() + 1);
        current.setHours(0);
        current.setMinutes(0);
        continue;
      }

      runs.push(new Date(current));
      current.setMinutes(current.getMinutes() + 1);
    }

    return runs;
  };

  const matchesCronPart = (part: string, value: number, min: number, max: number): boolean => {
    if (part === '*') return true;

    if (part.includes('/')) {
      const [base, step] = part.split('/');
      const stepNum = parseInt(step);
      if (base === '*') {
        return (value - min) % stepNum === 0;
      }
      return (value - parseInt(base)) % stepNum === 0;
    }

    if (part.includes(',')) {
      return part.split(',').some(p => parseInt(p) === value);
    }

    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      return value >= start && value <= end;
    }

    return parseInt(part) === value;
  };

  const parse = () => {
    setError('');
    setResult(null);

    if (!input.trim()) {
      setError('Please enter a cron expression');
      return;
    }

    try {
      const parsed = parseCron(input);
      setResult(parsed);
    } catch (e) {
      setError(`Invalid cron expression: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  const loadSample = (expression: string) => {
    setInput(expression);
    setError('');
  };

  const samples = [
    { expr: '*/5 * * * *', desc: 'Every 5 minutes' },
    { expr: '0 * * * *', desc: 'Every hour' },
    { expr: '0 0 * * *', desc: 'Every day at midnight' },
    { expr: '0 9 * * 1-5', desc: 'Weekdays at 9 AM' },
    { expr: '0 0 1 * *', desc: 'First day of month' },
  ];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cron Expression
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="* * * * * (minute hour day month weekday)"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>

      {/* Quick Samples */}
      <div>
        <label className="block text-sm text-gray-600 mb-2">Quick Examples:</label>
        <div className="flex flex-wrap gap-2">
          {samples.map(({ expr, desc }) => (
            <button
              key={expr}
              onClick={() => loadSample(expr)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            >
              <code className="mr-1">{expr}</code>
              <span className="text-gray-500">({desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={parse}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Parse Expression
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
      {result && (
        <div className="space-y-4">
          {/* Description */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Schedule:</p>
            <p className="text-lg text-blue-900 capitalize">{result.description}</p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { label: 'Minute', value: result.minute },
              { label: 'Hour', value: result.hour },
              { label: 'Day', value: result.dayOfMonth },
              { label: 'Month', value: result.month },
              { label: 'Weekday', value: result.dayOfWeek },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-mono font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Next Runs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next 5 Runs
            </label>
            <div className="space-y-2">
              {result.nextRuns.map((date, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="font-mono text-sm">
                    {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">Cron Format:</p>
        <code className="block bg-white p-2 rounded border">minute hour day-of-month month day-of-week</code>
        <ul className="mt-2 space-y-1 text-xs">
          <li><code>*</code> - any value</li>
          <li><code>,</code> - value list separator</li>
          <li><code>-</code> - range of values</li>
          <li><code>/</code> - step values</li>
        </ul>
      </div>
    </div>
  );
}
