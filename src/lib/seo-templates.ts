// Deterministic, varied SEO content generators for tools that don't have a
// hand-written `seoContent` block. The same tool always renders the same
// content (so crawlers see a stable page), but different tools draw from
// different rotations of the pool — avoiding site-wide duplicate copy.
//
// All output is purely a function of (tool.id, tool.category, tool.name,
// tool.shortDescription). No randomness at request time.

import type { Tool } from './tools';
import { getCategoryById } from './categories';

// FNV-ish 32-bit string hash. Stable across runtimes, no deps.
function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function pickN<T>(pool: T[], seed: number, n: number): T[] {
  const out: T[] = [];
  const used = new Set<number>();
  let step = 0;
  while (out.length < n && used.size < pool.length) {
    const idx = (seed + step * 17 + 3) % pool.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(pool[idx]);
    }
    step++;
  }
  return out;
}

// Map each tool category to a concrete "how it runs" hint. Lets the generated
// copy mention real technical details rather than generic "in your browser".
const TECH_HINTS: Record<string, string> = {
  dev: 'native browser APIs',
  text: 'JavaScript string processing locally',
  image: 'the HTML Canvas API',
  video: 'FFmpeg compiled to WebAssembly',
  color: 'native CSS color parsers',
  converter: 'pure-JavaScript parsers',
  misc: 'lightweight browser-side code',
  office: 'SheetJS, pdf.js, or OOXML readers',
};

const CATEGORY_LABELS: Record<string, string> = {
  dev: 'developer workflows',
  text: 'text manipulation tasks',
  image: 'image edits',
  video: 'video edits',
  color: 'color work',
  converter: 'data conversions',
  misc: 'everyday utility tasks',
  office: 'office document conversions',
};

const INTRO_TEMPLATES: Array<
  (ctx: { tool: Tool; categoryName: string; categoryLabel: string; tech: string }) => string
> = [
  ({ tool, categoryName, tech }) =>
    `${tool.name} is a fast, browser-based utility for ${tool.shortDescription.toLowerCase()}. Built for anyone who needs a quick ${categoryName.toLowerCase()} result without uploads, signups, or daily limits — the operation runs locally using ${tech}, so your input never reaches a server.`,
  ({ tool, categoryName, tech }) =>
    `${tool.name} packs a focused ${categoryName.toLowerCase()} workflow into a single web page. Paste or drop in your input, adjust the options, and copy the result — everything is processed in your browser via ${tech}, which means no quotas, no API keys, and nothing logged.`,
  ({ tool, tech }) =>
    `Need to ${tool.shortDescription.toLowerCase()} without firing up a desktop app? ${tool.name} handles it instantly using ${tech}. Open the page, do the work, close the tab — no account, no install, no waiting on a backend.`,
  ({ tool, categoryName, categoryLabel }) =>
    `${tool.name} is part of our ${categoryName.toLowerCase()} collection — a single-purpose tool focused entirely on ${categoryLabel}. Useful for quick one-offs as well as repeating chores you don't want to chain across multiple online services.`,
  ({ tool, categoryLabel, tech }) =>
    `Working on ${categoryLabel}? ${tool.name} gives you a clean, distraction-free interface that runs entirely on your device with ${tech}. Once the page is loaded, the tool works offline and stays out of your way.`,
  ({ tool }) =>
    `${tool.name} is the no-friction way to ${tool.shortDescription.toLowerCase()}. Drop your input in, configure the output, and save — all in your browser, all in seconds, all without the privacy concerns of uploading to an unknown backend.`,
];

const BENEFIT_POOL_GENERIC: string[] = [
  '100% free with no hidden costs or daily limits',
  'Your data stays private — all processing happens locally in the browser',
  'No registration, account, or installation required',
  'Works on desktop, tablet, and mobile in any modern browser',
  'Instant results — no waiting on a server or upload progress bar',
  'Works offline after the first page load',
  'No telemetry, no tracking pixels, no third-party scripts',
  'No API keys to manage and no rate limits to monitor',
  'Stable behavior across visits — no surprise version drift',
  'Touch-friendly UI, fine on phones for on-the-go edits',
  'Lightweight page weight that loads quickly even on slow connections',
  'Open-and-go: bookmark the page once and never look for an alternative',
];

const BENEFIT_POOL_BY_CATEGORY: Record<string, string[]> = {
  dev: [
    'Built for developer workflows: copy-friendly output, syntax-aware highlighting where useful',
    'No telemetry on the tokens, payloads, or code you paste in',
    'Works with very large inputs (multi-megabyte JSON, long regex patterns, big tables)',
  ],
  text: [
    'Handles Unicode correctly — emoji, CJK, Arabic, and accented Latin all stay intact',
    'No character or word-count cap on the input',
    'Cleanly handles pasted content with mixed line endings (CRLF, LF, CR)',
  ],
  image: [
    'Your original file is never uploaded — sensitive screenshots stay on your device',
    'Supports PNG, JPG, WebP, GIF, and SVG with consistent quality across formats',
    'Output preserves color profile and metadata except when stripping is explicitly requested',
  ],
  video: [
    'FFmpeg WASM means the same encoder that powers desktop tools, running in your browser',
    'No video upload — clips of any length stay on your local machine',
    'First-load downloads the WASM core once (~30 MB), then subsequent edits are fast',
  ],
  color: [
    'Outputs valid CSS, Tailwind, and design-tool color formats side-by-side',
    'WCAG contrast checks calculated correctly for AA and AAA, both text and large text',
    'Works with any color input format — HEX, RGB, RGBA, HSL, HSLA, named colors',
  ],
  converter: [
    'Strict and lenient parser modes for handling messy real-world data',
    'Round-trips cleanly — convert there and back without losing precision or fidelity',
    'Handles UTF-8 BOM, mixed delimiters, and other edge cases that break simpler converters',
  ],
  misc: [
    'Designed for everyday quick tasks — open the page, get the answer, move on',
    'No upsell to a paid plan: every feature is free forever',
  ],
  office: [
    'No file upload — confidential reports never leave your computer',
    'Auto-detects encoding (UTF-8, Shift_JIS, GBK, Vietnamese) for CSV imports',
    'Built on SheetJS / pdf.js / OOXML — the same libraries used by serious desktop tools',
  ],
};

// "How to use" step patterns. Picked by tool category so the verb (upload /
// paste / configure) matches the actual interface.
const HOW_PATTERNS_BY_CATEGORY: Record<string, ((tool: Tool) => string[])[]> = {
  image: [
    (t) => [
      'Drop your image into the upload area, or click to select a file',
      `Set the ${t.name.toLowerCase()} options to match your target output`,
      'Wait for the in-browser processing to complete (usually under a second)',
      'Download the result, or run it again with different settings',
    ],
    (t) => [
      `Upload one or more images to ${t.name}`,
      'Adjust the output dimensions, quality, or format',
      'Click the action button — processing happens client-side using Canvas',
      'Save each result individually or download all at once',
    ],
  ],
  video: [
    () => [
      'Drag a video file into the upload area, or click to browse',
      'Wait briefly for FFmpeg WebAssembly to load on the first run',
      'Configure the output (format, quality, trim points, or text overlay)',
      'Click the action button and download the result when processing completes',
    ],
  ],
  office: [
    (t) => [
      `Upload your file to ${t.name}`,
      'Preview a small portion of the parsed content to confirm the import worked',
      'Adjust any output options (encoding, sheet selection, output format)',
      'Download the converted file, ready to open in the target application',
    ],
  ],
  text: [
    (t) => [
      'Paste your text into the input area',
      `${t.name} processes the input as you type — no Convert button needed`,
      'Use the output below or copy to clipboard with one click',
    ],
    () => [
      'Paste or type your text into the input area',
      'Tweak any available options to match the result you want',
      'Copy the output from the bottom panel or download it as a file',
    ],
  ],
  dev: [
    (t) => [
      `Paste your input into the ${t.name.toLowerCase()} area`,
      'Configure the options if the defaults don\'t match your case',
      'Click the action button and inspect the result',
      'Copy the output to your clipboard or download as a file',
    ],
    () => [
      'Paste the input you want to process',
      'Adjust any optional flags or formatting settings',
      'Run the conversion — everything happens locally in your browser',
      'Copy the output for use in your project',
    ],
  ],
  converter: [
    (t) => [
      `Paste your source data into ${t.name}, or upload a file`,
      'Confirm the parsed preview looks correct',
      'Click Convert to produce the output in the new format',
      'Copy the result or download as a file ready for the consuming system',
    ],
  ],
  color: [
    (t) => [
      `Pick a color or paste a value into ${t.name}`,
      'The tool computes all related representations automatically',
      'Copy the format you need (HEX, RGB, HSL, Tailwind class, CSS variable)',
    ],
  ],
  misc: [
    (t) => [
      `Enter your input or settings in ${t.name}`,
      'Run the action — the result appears immediately',
      'Copy the output or run again with new inputs',
    ],
  ],
};

// Convenience: take 'a' or 'an' to match the next word's initial sound.
function categoryFor(tool: Tool): { name: string; label: string } {
  const cat = getCategoryById(tool.category);
  return {
    name: cat?.name || 'Web Tools',
    label: CATEGORY_LABELS[tool.category] || 'this kind of work',
  };
}

export function generateIntro(tool: Tool): string {
  // Hand-written intro always wins.
  if (tool.seoContent?.intro) return tool.seoContent.intro;

  const seed = hashString(tool.id);
  const { name: categoryName, label: categoryLabel } = categoryFor(tool);
  const tech = TECH_HINTS[tool.category] || 'browser-native code';
  const tpl = INTRO_TEMPLATES[seed % INTRO_TEMPLATES.length];
  return tpl({ tool, categoryName, categoryLabel, tech });
}

export function generateBenefits(tool: Tool): string[] {
  const seed = hashString(tool.id + ':benefits');
  // 3 generic + 2 category-specific = mix between same site-wide promises
  // and copy specific enough to feel hand-written.
  const generic = pickN(BENEFIT_POOL_GENERIC, seed, 3);
  const catPool = BENEFIT_POOL_BY_CATEGORY[tool.category] || [];
  const specific = pickN(catPool, seed, Math.min(2, catPool.length));
  return [...generic, ...specific];
}

export function generateHowToUse(tool: Tool): string[] {
  // Hand-written howToUse from the registry always wins.
  if (tool.howToUse && tool.howToUse.length > 0) return tool.howToUse;

  const seed = hashString(tool.id + ':howto');
  const patterns = HOW_PATTERNS_BY_CATEGORY[tool.category];
  if (patterns && patterns.length > 0) {
    return patterns[seed % patterns.length](tool);
  }
  // Fallback when no category pattern matches.
  return [
    `Open ${tool.name} and enter your input`,
    'Configure the options if needed',
    'Run the action — processing happens in your browser',
    'Copy or download the result',
  ];
}
