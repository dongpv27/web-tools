// Replace generic single-word alt attributes ("Original", "Preview",
// "Converted", etc.) on <img> tags in tool client files with descriptive
// alts that explain the image's role. Skips matches inside source-code
// strings used by Markdown converters.
//
// Run: node scripts/fix-image-alts.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('src/components/tool-clients');

// Map literal alt text → replacement. Single source of truth.
const REPLACEMENTS = [
  ['Original', 'Original uploaded image preview'],
  ['Preview', 'Uploaded image preview'],
  ['Converted', 'Converted image result'],
  ['Converted PNG', 'Image converted to PNG'],
  ['Compressed', 'Compressed image preview'],
  ['Blurred', 'Blurred image preview'],
  ['Grayscale', 'Grayscale image preview'],
  ['Pixelated', 'Pixelated image preview'],
  ['Flipped', 'Flipped image preview'],
  ['Rotated', 'Rotated image preview'],
  ['Resized', 'Resized image preview'],
  ['Watermark', 'Watermark image to overlay on video'],
  ['Thumbnail', 'Generated video thumbnail'],
  ['Screenshot', 'Captured video frame'],
  ['Extracted frame', 'Extracted video frame'],
  ['Pick a color', 'Image to pick a color from — click anywhere to sample'],
];

function fileShouldSkip(content, lineNum) {
  // Skip alt= inside markdown converter regex strings (HtmlToMarkdownClient,
  // MarkdownToHtmlClient): those replace patterns, not actual <img> elements.
  const lines = content.split('\n');
  const line = lines[lineNum - 1] || '';
  if (/\.replace\(/.test(line) && /alt=/.test(line)) return true;
  return false;
}

let totalReplacements = 0;
const filesChanged = new Set();

for (const fname of fs.readdirSync(DIR)) {
  if (!fname.endsWith('.tsx')) continue;
  const fp = path.join(DIR, fname);
  let src = fs.readFileSync(fp, 'utf8');
  let changed = false;

  for (const [from, to] of REPLACEMENTS) {
    // Only replace when alt is exactly the literal (within double quotes)
    // and not part of a longer phrase.
    const re = new RegExp(`alt="${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    src = src.replace(re, (match, ...args) => {
      // args is [offset, string]
      const offset = args[args.length - 2];
      const lineNum = src.slice(0, offset).split('\n').length;
      if (fileShouldSkip(src, lineNum)) return match;
      totalReplacements++;
      changed = true;
      return `alt="${to}"`;
    });
  }

  if (changed) {
    fs.writeFileSync(fp, src);
    filesChanged.add(fname);
  }
}

console.log(`Replaced ${totalReplacements} alt attributes in ${filesChanged.size} files.`);
console.log('Files changed:');
for (const f of filesChanged) console.log('  - ' + f);
