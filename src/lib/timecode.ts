// Shared hh:mm:ss <-> seconds helpers for video tools, so manual time entry
// matches the video player's timecode instead of raw seconds.

// Always zero-padded hh:mm:ss. Fractional seconds are dropped for display.
export function secondsToHMS(total: number): string {
  const t = Math.max(0, total);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  return [h, m, s].map((n) => n.toString().padStart(2, '0')).join(':');
}

// Accepts "ss", "mm:ss" or "hh:mm:ss" (fractional seconds allowed, e.g.
// "1:23.5"). Returns null for malformed input so callers can revert.
export function hmsToSeconds(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parts = trimmed.split(':');
  if (parts.length > 3) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => Number.isNaN(n) || n < 0)) return null;
  let seconds = 0;
  for (const n of nums) seconds = seconds * 60 + n;
  return seconds;
}
