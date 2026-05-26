// Shared pdf.js options for browser-side PDF reading. Without cMapUrl, any
// PDF that uses CID fonts (very common in Vietnamese/CJK documents from older
// tools) returns "?" for every character outside the font's built-in mapping.
// We point pdf.js at jsdelivr's mirror of pdfjs-dist/cmaps so the Adobe CMap
// fallback is available. cMapPacked: true is required because the published
// .bcmap files are binary-packed.
import { version as pdfjsVersion } from 'pdfjs-dist/package.json';

export const pdfjsLoadOptions = {
  cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/cmaps/`,
  cMapPacked: true,
} as const;
