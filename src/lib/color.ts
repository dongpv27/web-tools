// Shared hex parsing for color tools. Accepts both #RRGGBB and the #RGB
// shorthand (e.g. "#fff" → {255,255,255}), with or without the leading "#".
// Returns null for anything malformed so callers can show a validation error.
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.trim().replace(/^#/, '');
  // Expand 3-digit shorthand: "abc" → "aabbcc".
  const full = cleaned.length === 3
    ? cleaned.replace(/./g, (c) => c + c)
    : cleaned;
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
