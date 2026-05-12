#!/usr/bin/env node
/**
 * One-shot script: walk src/lib/tools.ts and insert a `tags: [...]` line
 * directly after every `keywords: [...]` that has no following `tags:` line.
 *
 * Tags are derived from category + keywords. Existing `tags:` entries are
 * left untouched.
 *
 * Run from repo root:
 *   node scripts/add-tool-tags.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const FILE = path.resolve(HERE, '..', 'src/lib/tools.ts');

const STOPWORDS = new Set([
  'free', 'online', 'tool', 'tools', 'web', 'browser', 'instant', 'fast',
  'easy', 'simple', 'best', 'top', 'the', 'and', 'for', 'with', 'your',
  'from', 'into', 'this', 'that', 'have', 'will', 'can', 'data',
  'text', // category is added explicitly, avoid duplication
]);

const CATEGORY_BASE_TAG = {
  dev: 'developer',
  text: 'text',
  image: 'image',
  video: 'video',
  color: 'color',
  converter: 'converter',
  office: 'office',
  misc: 'utility',
};

function tokenize(str) {
  return str
    .toLowerCase()
    .split(/[\s/_\-,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3 && !STOPWORDS.has(s));
}

function deriveTags(category, keywords) {
  const seen = new Set();
  const out = [];
  const push = (t) => {
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };

  // Always lead with a category tag so same-category tools cluster.
  push(CATEGORY_BASE_TAG[category] || category);

  // Multi-word keywords first (they often capture an exact concept).
  for (const kw of keywords) {
    const norm = kw.toLowerCase().trim();
    if (norm.length >= 3 && norm.length <= 30 && !STOPWORDS.has(norm) && norm.includes(' ')) {
      // skip multi-word — schema engine handles single tokens better
    } else if (!STOPWORDS.has(norm) && norm.length >= 3 && norm.length <= 24 && !/\s/.test(norm)) {
      push(norm);
    }
  }

  // Then split every keyword and add unique parts.
  for (const kw of keywords) {
    for (const part of tokenize(kw)) push(part);
    if (out.length >= 8) break;
  }

  return out.slice(0, 7);
}

const src = fs.readFileSync(FILE, 'utf8');
const lines = src.split('\n');

// Track current tool's category by scanning each block.
let touched = 0;
const outLines = [];
let currentCategory = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  outLines.push(line);

  const catMatch = line.match(/^\s*category:\s*'([^']+)',/);
  if (catMatch) currentCategory = catMatch[1];

  const kwMatch = line.match(/^(\s*)keywords:\s*\[([^\]]*)\],?\s*$/);
  if (!kwMatch) continue;

  // Skip if next non-blank line is already `tags:`.
  let j = i + 1;
  while (j < lines.length && lines[j].trim() === '') j++;
  if (j < lines.length && /^\s*tags:\s*\[/.test(lines[j])) continue;

  const indent = kwMatch[1];
  const rawKeywords = kwMatch[2]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);

  const tags = deriveTags(currentCategory, rawKeywords);
  if (tags.length === 0) continue;

  outLines.push(`${indent}tags: [${tags.map((t) => `'${t}'`).join(', ')}],`);
  touched++;
}

fs.writeFileSync(FILE, outLines.join('\n'));
console.log(`✔ inserted tags on ${touched} tools.`);
