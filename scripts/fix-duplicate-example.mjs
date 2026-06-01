// Remove the FIRST exampleOutput block in each of the 11 affected tools
// (the second, richer one was just added — keep that).

import fs from 'node:fs';
const FILE = 'src/lib/tools.ts';
let src = fs.readFileSync(FILE, 'utf8');

const IDS = [
  'bcrypt-hash-generator','random-string-generator','guid-generator','uuid-bulk-generator',
  'color-palette-generator','gradient-generator','css-gradient-generator',
  'random-number-generator','secure-token-generator','nano-id-generator','slug-generator-advanced',
];

let fixed = 0;
for (const id of IDS) {
  const idMatch = src.match(new RegExp(`id: '${id}',`));
  if (!idMatch) continue;
  const idIdx = idMatch.index;
  let openIdx = src.lastIndexOf('  {\r\n', idIdx);
  if (openIdx < 0) openIdx = src.lastIndexOf('  {\n', idIdx);
  let depth = 0, closeIdx = -1;
  for (let i = openIdx + 1; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  const blockStart = openIdx, blockEnd = closeIdx + 1;
  const block = src.slice(blockStart, blockEnd);
  // Find FIRST exampleOutput in this block (the old pre-existing one,
  // which sits before relatedTools). Delete that whole property.
  const firstEx = block.match(/    exampleOutput:\s*\{[\s\S]*?\n    \},\r?\n/);
  if (!firstEx) continue;
  // Make sure there is a SECOND exampleOutput too (our new one) — else skip.
  const afterFirst = block.slice(firstEx.index + firstEx[0].length);
  if (!/exampleOutput:\s*\{/.test(afterFirst)) continue;

  const newBlock = block.slice(0, firstEx.index) + block.slice(firstEx.index + firstEx[0].length);
  src = src.slice(0, blockStart) + newBlock + src.slice(blockEnd);
  fixed++;
}
fs.writeFileSync(FILE, src);
console.log('Fixed:', fixed);
