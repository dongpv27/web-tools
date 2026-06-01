'use client';

import { useState } from 'react';

interface ParsedCron {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  description: string;
  nextRuns: Date[];
}

// Sensible cross-region default list. Falls back gracefully if Intl rejects
// a name (older browsers).
const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Moscow',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok', 'Asia/Ho_Chi_Minh', 'Asia/Singapore',
  'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Auckland',
];

// ─── Cron field matching ───────────────────────────────────────────────────
// Expands a cron field expression into the exact set of integers it matches
// within [min,max]. Supports: `*`, `N`, `N-M`, `N,M,O`, `*/k`, `N-M/k`.
function expandField(field: string, min: number, max: number): Set<number> {
  const out = new Set<number>();
  for (const token of field.split(',')) {
    let stepStr = '';
    let rangeStr = token;
    if (token.includes('/')) {
      const [r, s] = token.split('/');
      rangeStr = r;
      stepStr = s;
    }
    const step = stepStr ? parseInt(stepStr, 10) : 1;
    if (!Number.isFinite(step) || step < 1) continue;

    let lo: number;
    let hi: number;
    if (rangeStr === '*') {
      lo = min; hi = max;
    } else if (rangeStr.includes('-')) {
      const [a, b] = rangeStr.split('-').map(Number);
      lo = a; hi = b;
    } else {
      const v = parseInt(rangeStr, 10);
      // Bare number with step (e.g. "5/10") = "5, 5+10, 5+20…" up to max.
      lo = v; hi = stepStr ? max : v;
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) continue;
    for (let n = lo; n <= hi; n += step) {
      if (n >= min && n <= max) out.add(n);
    }
  }
  return out;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function CronExpressionParserClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ParsedCron | null>(null);
  const [error, setError] = useState('');
  const [timezone, setTimezone] = useState<string>(
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'UTC'
  );

  const parseCron = (expression: string, tz: string): ParsedCron => {
    const parts = expression.trim().split(/\s+/);
    if (parts.length < 5 || parts.length > 6) {
      throw new Error('Cron expression must have 5 or 6 parts');
    }
    // Accept the optional 6th seconds field but discard it for matching.
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts.length === 6 ? parts.slice(1) : parts;

    // Validate field expansion early so bad input fails fast.
    expandField(minute, 0, 59);
    expandField(hour, 0, 23);
    expandField(dayOfMonth, 1, 31);
    expandField(month, 1, 12);
    expandField(dayOfWeek, 0, 6);

    return {
      minute, hour, dayOfMonth, month, dayOfWeek,
      description: describe(minute, hour, dayOfMonth, month, dayOfWeek),
      nextRuns: nextRuns(minute, hour, dayOfMonth, month, dayOfWeek, 5, tz),
    };
  };

  // ─── Human-readable description ──────────────────────────────────────────
  const describe = (m: string, h: string, dom: string, mo: string, dow: string): string => {
    const parts: string[] = [];
    if (m === '*') parts.push('every minute');
    else if (m.startsWith('*/')) parts.push(`every ${m.slice(2)} minute(s)`);
    else parts.push(`at minute ${m}`);

    if (h !== '*') {
      if (h.startsWith('*/')) parts.push(`every ${h.slice(2)} hour(s)`);
      else parts.push(`at hour ${h}`);
    }

    if (dom !== '*') parts.push(`on day ${dom} of the month`);

    if (mo !== '*') {
      const names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const list = mo.split(',').map((x) => names[parseInt(x, 10) - 1] || x).join(', ');
      parts.push(`in ${list}`);
    }

    if (dow !== '*') {
      const names = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const list = dow.split(',').map((x) => names[parseInt(x, 10)] || x).join(', ');
      parts.push(`on ${list}`);
    }
    return parts.join(', ');
  };

  // ─── Next-run calculator ─────────────────────────────────────────────────
  // Walks forward minute-by-minute (capped at 1 year) checking each field.
  // Uses the SELECTED timezone so the calendar fields match user expectations.
  // DOM/DOW OR rule: if BOTH are restricted, a tick matches when either does.
  const nextRuns = (
    minute: string, hour: string, dom: string, month: string, dow: string,
    count: number, tz: string,
  ): Date[] => {
    const minSet = expandField(minute, 0, 59);
    const hourSet = expandField(hour, 0, 23);
    const domSet = expandField(dom, 1, 31);
    const monSet = expandField(month, 1, 12);
    const dowSet = expandField(dow, 0, 6);
    const domRestricted = dom !== '*';
    const dowRestricted = dow !== '*';

    const runs: Date[] = [];
    let cursor = new Date();
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    const max = 366 * 24 * 60;
    let i = 0;
    while (runs.length < count && i < max) {
      i++;
      const fields = breakdownInTz(cursor, tz);
      // Field-by-field check.
      if (!minSet.has(fields.minute)) { cursor = addMinutes(cursor, 1); continue; }
      if (!hourSet.has(fields.hour)) { cursor = addMinutes(cursor, 1); continue; }
      if (!monSet.has(fields.month)) { cursor = addMinutes(cursor, 1); continue; }

      // DOM/DOW OR semantics per POSIX cron spec.
      let dayMatch: boolean;
      if (domRestricted && dowRestricted) dayMatch = domSet.has(fields.dayOfMonth) || dowSet.has(fields.dayOfWeek);
      else if (domRestricted) dayMatch = domSet.has(fields.dayOfMonth);
      else if (dowRestricted) dayMatch = dowSet.has(fields.dayOfWeek);
      else dayMatch = true;
      if (!dayMatch) { cursor = addMinutes(cursor, 1); continue; }

      runs.push(new Date(cursor));
      cursor = addMinutes(cursor, 1);
    }
    return runs;
  };

  const parse = () => {
    setError('');
    setResult(null);
    if (!input.trim()) {
      setError('Please enter a cron expression');
      return;
    }
    try {
      setResult(parseCron(input, timezone));
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
    { expr: '0 12 1,15 * 1', desc: '1st/15th of month OR every Monday at noon' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cron Expression</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="* * * * * (minute hour day month weekday)"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>

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

      <div className="flex items-end gap-2 flex-wrap">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Timezone for next runs</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <button onClick={parse} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Parse Expression
        </button>
        <button onClick={clearAll} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
          Clear
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Schedule:</p>
            <p className="text-lg text-blue-900">{result.description}</p>
            {result.dayOfMonth !== '*' && result.dayOfWeek !== '*' && (
              <p className="text-xs text-blue-700 mt-1">
                Note: when both day-of-month and day-of-week are set, POSIX cron runs the job when <strong>either</strong> matches.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            {[
              { label: 'Minute', value: result.minute },
              { label: 'Hour', value: result.hour },
              { label: 'Day', value: result.dayOfMonth },
              { label: 'Month', value: result.month },
              { label: 'Weekday', value: result.dayOfWeek },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-mono font-medium break-all">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next 5 Runs <span className="text-xs text-gray-500 font-normal">({timezone})</span>
            </label>
            <div className="space-y-2">
              {result.nextRuns.map((date, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-gray-600">{formatInTz(date, timezone, 'date')}</span>
                  <span className="font-mono text-sm">{formatInTz(date, timezone, 'time')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">Cron Format:</p>
        <code className="block bg-white p-2 rounded border">minute hour day-of-month month day-of-week</code>
        <ul className="mt-2 space-y-1 text-xs">
          <li><code>*</code> any value</li>
          <li><code>,</code> value list separator (e.g. <code>1,15,30</code>)</li>
          <li><code>-</code> range of values (e.g. <code>1-5</code>)</li>
          <li><code>/</code> step values (e.g. <code>*/15</code> or <code>0-30/5</code>)</li>
        </ul>
      </div>
    </div>
  );
}

// ─── TZ helpers ───────────────────────────────────────────────────────────
// Add minutes to a Date, returning a new Date. Pure helper to keep the next-run
// loop readable.
function addMinutes(d: Date, n: number): Date {
  const out = new Date(d);
  out.setMinutes(out.getMinutes() + n);
  return out;
}

// Break a timestamp into calendar fields as they appear in the given timezone.
// Uses Intl.DateTimeFormat with formatToParts which is the reliable way to do
// TZ-aware calendar math in pure JS.
function breakdownInTz(d: Date, tz: string): {
  year: number; month: number; dayOfMonth: number; hour: number; minute: number; dayOfWeek: number;
} {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short',
    hour12: false,
  });
  const parts: Record<string, string> = {};
  for (const p of f.formatToParts(d)) parts[p.type] = p.value;
  const dowMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: parseInt(parts.year, 10),
    month: parseInt(parts.month, 10),
    dayOfMonth: parseInt(parts.day, 10),
    // "24:00" → coerce to 0 to match cron's 0-23 range.
    hour: parseInt(parts.hour, 10) % 24,
    minute: parseInt(parts.minute, 10),
    dayOfWeek: dowMap[parts.weekday] ?? 0,
  };
}

function formatInTz(d: Date, tz: string, mode: 'date' | 'time'): string {
  return new Intl.DateTimeFormat('en-US', mode === 'date'
    ? { timeZone: tz, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    : { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }
  ).format(d);
}
