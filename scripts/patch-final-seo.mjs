// Final session: 11 remaining tools without howToUse — insert after relatedTools.

import fs from 'node:fs';

const FILE = 'src/lib/tools.ts';
let src = fs.readFileSync(FILE, 'utf8');

const DATA = {
  'bcrypt-hash-generator': {
    howTo: ['Type or paste the password', 'Choose salt rounds (10-12 recommended for production)', 'Click Generate — hash appears with embedded salt', 'Copy the hash and store it in your user database'],
    ex: { input: 'P@ssw0rd123! · 10 rounds', output: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', description: 'A bcrypt hash containing the algorithm version, cost factor, salt, and digest in a single string ready to store in a database.' },
    seo: {
      intro: 'Generate bcrypt password hashes entirely in your browser — the industry-standard way to store passwords safely. The cost factor (work factor) is configurable so you can tune the trade-off between security and login latency. Every hash includes a unique salt, so identical passwords produce different hashes.',
      examples: [
        { title: 'Production user signup', body: 'A new user signs up with `P@ssw0rd!` — generate a cost-12 hash on the server and store the full `$2b$12$…` string in the users table.' },
        { title: 'Verify against a stored hash', body: 'Compare a login attempt against the stored hash with the verify mode — only matching plaintext + hash returns true.' },
        { title: 'Benchmark cost factor', body: 'Try costs 10, 11, 12 in the browser to see how long each takes — pick the highest factor that finishes in <500ms on your slowest server.' },
      ],
      useCases: ['Hashing passwords before storing in a user database', 'Generating test fixtures for authentication code', 'Migrating from a weaker hash (MD5/SHA-1) to bcrypt', 'Benchmarking server-appropriate cost factor', 'Generating hashes for CTF / security training exercises'],
      troubleshooting: [
        { problem: 'Hashing takes several seconds', solution: 'Cost factor is too high. Each +1 doubles compute time. 10-12 is standard; 14+ becomes noticeable on every login.' },
        { problem: 'Two hashes of the same password look different', solution: 'That\'s correct — bcrypt uses a random salt per hash. Verification still works because the salt is embedded in the hash string.' },
        { problem: 'Hash starts with `$2a$` instead of `$2b$`', solution: 'Both are valid bcrypt prefixes. `$2b$` is the modern variant; `$2a$` is legacy but still verified by all major libraries.' },
      ],
    },
  },
  'random-string-generator': {
    howTo: ['Pick length and character set (letters, digits, symbols)', 'Set how many strings to generate', 'Click Generate — copy individual or all at once', 'Use the CSPRNG toggle for crypto-grade randomness'],
    ex: { input: 'Length: 16 · uppercase + lowercase + digits · count: 5', output: 'k7Hq2pXmYnRtVwE4\nP9mAj5GcDvNqXh2L\n...', description: 'Five 16-character random strings drawn from the chosen alphabet using the browser\'s crypto.getRandomValues (CSPRNG).' },
    seo: {
      intro: 'Generate random strings of any length and character composition — useful for test data, placeholder values, voucher codes, or one-off passwords. Defaults use the browser\'s CSPRNG (`crypto.getRandomValues`), so the output is cryptographically secure, not predictable.',
      examples: [
        { title: 'Test-data filler', body: 'Generate 100 random 12-character strings to seed a database with realistic-looking user IDs.' },
        { title: 'Voucher codes', body: 'Generate 1,000 uppercase-only 8-character codes for a one-time-use voucher campaign.' },
        { title: 'Quick passwords', body: 'Generate a single 20-character string with letters + digits + symbols as a strong one-off password.' },
      ],
      useCases: ['Seeding databases with realistic test data', 'Generating voucher / coupon codes', 'One-off password generation', 'API placeholder values', 'CTF / training challenge inputs'],
      troubleshooting: [
        { problem: 'Strings look "less random" than expected', solution: 'That\'s confirmation bias — random output often clusters. The CSPRNG is correct. Run a chi-square test if you need statistical proof.' },
        { problem: 'Symbols cause issues when pasted into URLs/CSV', solution: 'Disable symbols and stick to letters+digits. Or URL-encode the output. Some downstream systems can\'t handle special characters.' },
        { problem: 'Need identical output to compare runs', solution: 'Random by definition isn\'t reproducible. Use a seeded PRNG tool if you need deterministic "random" sequences.' },
      ],
    },
  },
  'guid-generator': {
    howTo: ['Choose UUID version (v4 random or v1 timestamp)', 'Set the count (1-1000+)', 'Click Generate — copy individual or all as JSON/CSV', 'Toggle case (upper/lower) and braces format'],
    ex: { input: 'Version: 4 · count: 5', output: 'a3f8d2c1-9e7b-4f5a-8c1d-2b3e4f5a6c7d\n4e9c8b2a-5d1f-4e8b-9c3a-1f2d3e4b5c6a\n...', description: 'Five random v4 GUIDs (UUIDs) generated locally using crypto.randomUUID() — globally unique with vanishingly small collision probability.' },
    seo: {
      intro: 'Generate GUIDs (a.k.a. UUIDs) in your browser — v4 random (default) or v1 timestamp-based. The v4 generator uses `crypto.randomUUID()` for true cryptographic randomness, with collision probability so small that 1 billion GUIDs per second for 100 years still has near-zero collision risk.',
      examples: [
        { title: 'Primary-key seed', body: 'Generate 50 GUIDs for primary keys in a SQL Server table where IDs must be globally unique across servers.' },
        { title: 'Microsoft-style braces', body: 'Toggle braces on for `{a3f8d2c1-…}` format used in Windows registry and .NET configs.' },
        { title: 'Idempotency keys', body: 'Generate a single GUID to use as an idempotency key for a Stripe / payment API call.' },
      ],
      useCases: ['Database primary keys (SQL Server, .NET, Azure)', 'Idempotency keys for API requests', 'Distributed-system unique identifiers', 'Test fixture IDs', 'Registry / config-file unique tokens'],
      troubleshooting: [
        { problem: 'Need exact UUID format with specific case', solution: 'Use the case toggle (default lowercase). Some systems (.NET, COM) prefer uppercase; toggle on if needed.' },
        { problem: 'Bulk-generated GUIDs include duplicates', solution: 'Vanishingly unlikely with v4 (1 in 2^122). If you see duplicates, the generator is broken; the browser\'s native `crypto.randomUUID()` does not produce dupes in practice.' },
        { problem: 'v1 includes the MAC address', solution: 'Modern v1 generators (including this one) use random node IDs, not the real MAC — so you don\'t leak hardware fingerprints.' },
      ],
    },
  },
  'uuid-bulk-generator': {
    howTo: ['Set bulk count (1 - 100,000+)', 'Pick version (v4 random / v1 / v7 time-sortable)', 'Click Generate — download as TXT/CSV/JSON', 'Optional: include sequential index column'],
    ex: { input: 'Count: 10,000 · v4 · CSV format', output: 'uuids.csv — 10,000 rows with index + uuid columns', description: 'Bulk UUID list with optional sequential index, downloadable as TXT, CSV, or JSON for seeding databases or fixtures.' },
    seo: {
      intro: 'Bulk-generate thousands or millions of UUIDs in one go — perfect for seeding databases, creating test fixtures, or pre-generating IDs for offline systems. v4 (random), v1 (timestamp), and v7 (time-sortable monotonic) supported. All generation happens locally with the browser\'s CSPRNG.',
      examples: [
        { title: 'Database seed file', body: 'Generate 100,000 v4 UUIDs as CSV and `LOAD DATA INFILE` them into a MySQL table for performance testing.' },
        { title: 'v7 sortable IDs', body: 'For a time-series table, v7 UUIDs sort by creation time naturally — better index locality than v4.' },
        { title: 'JSON test fixtures', body: 'Generate 1,000 UUIDs as a JSON array to drop straight into a Jest test file.' },
      ],
      useCases: ['Pre-generating IDs for offline / disconnected systems', 'Bulk database seeding (>10K rows)', 'Load-test fixture generation', 'v7 monotonic IDs for time-series tables', 'Reserving ID blocks for distributed services'],
      troubleshooting: [
        { problem: 'Browser tab freezes generating millions', solution: 'Generation runs in a Web Worker — but if you typed an unrealistic count (e.g. 100 million) memory will exhaust. Generate in chunks of 1 million.' },
        { problem: 'v7 UUIDs don\'t look sequential', solution: 'They\'re lexicographically sortable, not visually sequential — only the first 48 bits are time-based. Sort the list to see the order.' },
        { problem: 'CSV download has Windows line endings on Mac', solution: 'Toggle "Unix line endings (LF)" in advanced — default CRLF for Excel compatibility, LF for Unix tools.' },
      ],
    },
  },
  'color-palette-generator': {
    howTo: ['Pick a base colour (or click "random")', 'Choose harmony rule (complementary, triadic, analogous, etc.)', 'Adjust palette size (3-10)', 'Copy as HEX list, CSS variables, Tailwind config, or Figma tokens'],
    ex: { input: 'Base: #2563eb · Harmony: triadic · 5 colours', output: '#2563eb · #eb2563 · #63eb25 · #1e3a8a · #be123c', description: 'Five harmonious colours generated by rotating hue around the colour wheel and adjusting lightness — ready for use in UI, branding, or illustration.' },
    seo: {
      intro: 'Generate a balanced, harmonious colour palette from any base colour using colour-theory rules (complementary, triadic, tetradic, analogous, monochromatic, split-complementary). Export as HEX, CSS custom properties, Tailwind config, or Figma design tokens — instantly drop into your design system.',
      examples: [
        { title: 'Brand palette from a logo colour', body: 'Sample the brand blue from a logo and generate a 5-colour triadic palette for the rest of the site (primary, secondary, accent, neutral, danger).' },
        { title: 'Dark + light mode siblings', body: 'For each generated colour, the tool also gives you a darker and lighter variant — instant dark-mode pairs.' },
        { title: 'Tailwind theme.colors export', body: 'Export the palette as a `tailwind.config.js` snippet you can paste straight into the project.' },
      ],
      useCases: ['Building a brand colour system from one base colour', 'Generating illustration / data-viz palettes', 'Creating Tailwind / design-token configs', 'Quick mood-board palettes for client presentations', 'Accessibility-aware palette exploration (with contrast checks)'],
      troubleshooting: [
        { problem: 'Generated colours look muddy', solution: 'The base colour was already desaturated. Pick a more saturated base, or toggle "boost saturation" so derived colours stay vibrant.' },
        { problem: 'Some pairs fail WCAG contrast', solution: 'Run each pair through the Color Contrast Checker tool. Harmony ≠ accessibility — adjust lightness manually for critical text/background pairs.' },
        { problem: 'Triadic palette looks gaudy', solution: 'Triadic = 120° hue spacing — vivid by design. Try split-complementary or analogous for more subtle palettes.' },
      ],
    },
  },
  'gradient-generator': {
    howTo: ['Pick 2-5 colour stops', 'Choose direction (linear angle / radial / conic)', 'Drag stops on the gradient bar to adjust position', 'Copy as CSS, SVG, or PNG export'],
    ex: { input: '#667eea → #764ba2 · linear 135°', output: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);', description: 'A CSS gradient ready to paste, plus PNG export for use in non-CSS contexts (PowerPoint, social media graphics, hero sections).' },
    seo: {
      intro: 'Build linear, radial, or conic CSS gradients visually — drag colour stops, set angles, preview live, then copy production-ready CSS. Or export as a PNG for use in Figma, slides, or anywhere you can\'t use CSS. Supports up to 5 stops with precise position control.',
      examples: [
        { title: 'Hero-section background', body: 'A 135° linear gradient from indigo to purple becomes the dramatic background of a landing-page hero.' },
        { title: 'Button glow', body: 'A subtle radial gradient at 50% 0% lights a button from the top, mimicking a soft top-down light.' },
        { title: 'Conic loading indicator', body: 'A conic gradient produces a circular hue-wheel loader for a creative spinner.' },
      ],
      useCases: ['Landing-page hero backgrounds', 'Button and card surface treatments', 'Decorative dividers and section breaks', 'Data-visualisation colour scales', 'Avatar / placeholder backgrounds'],
      troubleshooting: [
        { problem: 'Gradient has visible banding', solution: 'Two stops are too close in hue/luminance. Add an intermediate stop, or use a wider colour range. Browser anti-aliasing helps but can\'t hide extreme banding.' },
        { problem: 'Gradient looks different across browsers', solution: 'Modern browsers all support the standard syntax — but old Safari needed `-webkit-` prefix. Enable "vendor prefixes" if you target legacy browsers.' },
        { problem: 'PNG export looks blocky', solution: 'Default export is 1920×1080. Bump to 4K (3840×2160) for hero use, or pick the exact pixel size you need.' },
      ],
    },
  },
  'css-gradient-generator': {
    howTo: ['Pick gradient type (linear / radial / conic)', 'Add colour stops with precise % positions', 'Set angle / shape / origin point', 'Copy CSS — includes vendor prefixes if needed'],
    ex: { input: 'linear · 90° · #ff6b6b 0%, #4ecdc4 100%', output: 'background: linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%);', description: 'Production-ready CSS gradient with browser-prefixed fallbacks for older Safari/iOS if requested.' },
    seo: {
      intro: 'A focused CSS-gradient generator — visual editor for `linear-gradient()`, `radial-gradient()`, and `conic-gradient()` with precise stop positions, angle control, and clean copy-paste CSS output. Optional vendor prefixes for legacy browser support.',
      examples: [
        { title: 'Card surface', body: 'A subtle 180° linear gradient from white to #f7f7f7 gives a card a slight "lifted" feel without using shadows.' },
        { title: 'Animated background', body: 'Generate a 4-stop gradient and animate the `background-position` for the popular "moving gradient" hero effect.' },
        { title: 'Text gradient', body: 'Combine the generated gradient with `background-clip: text; color: transparent;` for gradient-coloured headings.' },
      ],
      useCases: ['Backgrounds for landing pages and dashboards', 'Subtle surface treatments on cards and panels', 'Animated gradient backgrounds', 'Gradient text effects', 'SVG fills for icons and illustrations'],
      troubleshooting: [
        { problem: 'Gradient direction looks "off"', solution: 'CSS angle 0° points UP (12 o\'clock), 90° RIGHT, 180° DOWN — opposite of math convention. The visual preview is the source of truth.' },
        { problem: 'Stops at 50% don\'t look centred', solution: 'CSS distributes evenly only when stops are explicit. Set positions like `0%, 50%, 100%` instead of letting the browser auto-space.' },
        { problem: 'Radial gradient looks elliptical, not circular', solution: 'Default shape is `ellipse` (matches container aspect). Switch to `circle` for a true round gradient regardless of container shape.' },
      ],
    },
  },
  'random-number-generator': {
    howTo: ['Set min and max range', 'Set how many numbers to generate', 'Toggle "unique numbers" if you need no duplicates (e.g. lottery)', 'Choose CSPRNG or seeded mode'],
    ex: { input: 'Range: 1-49 · 6 unique numbers · CSPRNG', output: '7 · 14 · 23 · 31 · 38 · 42', description: 'Six unique random integers in the 1-49 lottery range, generated by crypto.getRandomValues for cryptographic-quality randomness.' },
    seo: {
      intro: 'Generate random numbers in any range — integers or decimals, with or without duplicates, optionally seeded for reproducibility. Uses the browser\'s CSPRNG by default so output is cryptographically secure. Handy for lotteries, raffles, dice simulations, sampling, and test-data generation.',
      examples: [
        { title: 'Lottery picks', body: 'Six unique numbers in 1-49 — exactly what UK National Lottery needs.' },
        { title: 'Statistical sampling', body: 'Pick 100 unique IDs from a range of 1-10,000 for a random sample of survey participants.' },
        { title: 'Dice rolls', body: 'Generate 20 numbers in 1-6 with duplicates allowed to simulate 20 dice rolls.' },
      ],
      useCases: ['Lottery / raffle / giveaway draws', 'Statistical sampling from populations', 'Game simulations (dice, cards, RNG mechanics)', 'A/B test cohort assignment', 'Test-data range generation'],
      troubleshooting: [
        { problem: 'Same number appears twice when "unique" is off', solution: 'That\'s expected — duplicates can occur in random sampling. Toggle "unique numbers" to force no repeats (requires range ≥ count).' },
        { problem: '"Unique" mode fails with error', solution: 'You asked for more unique numbers than the range allows (e.g. 10 unique in 1-5). Widen the range or reduce count.' },
        { problem: 'Need reproducible sequence', solution: 'Switch to seeded mode and enter the same seed — same seed always produces the same sequence (uses xoshiro256** PRNG, not CSPRNG).' },
      ],
    },
  },
  'secure-token-generator': {
    howTo: ['Pick token length (32 / 48 / 64 bytes recommended)', 'Choose encoding (hex / base64 / base64url)', 'Click Generate — token uses crypto.getRandomValues', 'Copy or download for storage'],
    ex: { input: 'Length: 32 bytes · base64url encoding', output: 'k7Hq2pXmYnRtVwE4P9mAj5GcDvNqXh2LkRpVwEsxYmZb', description: 'A 256-bit cryptographic token encoded as URL-safe base64 — suitable for session tokens, API keys, password-reset links.' },
    seo: {
      intro: 'Generate cryptographically secure tokens for session IDs, API keys, password-reset links, CSRF tokens, or webhook signing secrets. Uses `crypto.getRandomValues()` — the same primitive Node.js, Python, and OpenSSL use for security-critical randomness. Output in hex, base64, or URL-safe base64.',
      examples: [
        { title: 'Password-reset link token', body: 'Generate a 32-byte (256-bit) base64url token, store its hash, and email the plaintext as part of the reset URL.' },
        { title: 'Webhook signing secret', body: 'Generate a 48-byte hex token to share with a webhook consumer — use as HMAC-SHA256 key to sign payloads.' },
        { title: 'API key for a service', body: 'A 32-byte base64url token is plenty for an API key — short enough to fit in headers, long enough that brute-force is impossible.' },
      ],
      useCases: ['Session ID generation', 'API key creation', 'Password-reset / email-verification tokens', 'CSRF tokens', 'Webhook / HMAC signing secrets'],
      troubleshooting: [
        { problem: 'Token contains characters like `+` `/` `=` that break URLs', solution: 'Switch to base64url encoding — URL-safe variant uses `-` and `_` instead and omits padding.' },
        { problem: 'Token is shorter than expected', solution: 'Length is in raw bytes; the encoded string is longer (hex = 2x, base64 = ~1.35x). 32 bytes hex = 64 characters; 32 bytes base64 ≈ 43 characters.' },
        { problem: 'Need to use the same token in multiple systems', solution: 'Generate once and copy/distribute. Don\'t regenerate — random output isn\'t reproducible by design.' },
      ],
    },
  },
  'nano-id-generator': {
    howTo: ['Set length (default 21 — same as nanoid lib)', 'Optional: customise alphabet (URL-safe by default)', 'Set count for bulk generation', 'Copy individual or download list'],
    ex: { input: 'Length: 21 · default URL-safe alphabet · count: 5', output: 'V1StGXR8_Z5jdHi6B-myT\nU9XmcF7-bGq3KhrPj2W_a\n...', description: 'Five 21-character Nano IDs — URL-safe, collision-resistant, and shorter than UUIDs for the same uniqueness guarantee.' },
    seo: {
      intro: 'Generate Nano IDs — modern, URL-safe, collision-resistant unique identifiers shorter than UUIDs. A 21-character Nano ID has the same collision odds as a UUID v4 but is 40% shorter and URL-friendly (no `-` separators, no special characters). Drop-in replacement for UUIDs in modern apps.',
      examples: [
        { title: 'Short URL IDs', body: 'Replace `/posts/550e8400-e29b-41d4-a716-446655440000` with `/posts/V1StGXR8_Z5jdHi6B-myT` — same uniqueness, half the length.' },
        { title: 'React component keys', body: 'Generate a list of Nano IDs to use as keys in React lists where you have no natural unique field.' },
        { title: 'Custom alphabet', body: 'For only-digits IDs, pass `0123456789` as alphabet — useful for friendly numeric IDs.' },
      ],
      useCases: ['Short URL slugs / short links', 'Database primary keys (alternative to UUID)', 'React / Vue list keys', 'Document IDs in MongoDB / Firestore', 'Anywhere a short, opaque ID is preferable to UUID'],
      troubleshooting: [
        { problem: 'Two Nano IDs collided in production', solution: 'Vanishingly unlikely at length 21 (similar to UUID v4). If real, you probably shortened to 8-10 chars — bump back to 21 or use the official collision-probability calculator.' },
        { problem: 'Custom alphabet output isn\'t uniformly random', solution: 'Nano ID uses modular bias avoidance under the hood — output is uniformly distributed. Run a frequency test if you suspect otherwise.' },
        { problem: 'Some characters in the URL look strange', solution: 'Default alphabet includes `_` and `-`. Pass a stricter alphabet (alphanumeric only) if your URL system rejects those.' },
      ],
    },
  },
  'slug-generator-advanced': {
    howTo: ['Paste text or a title', 'Choose separator (- / _ / .)', 'Pick rules (lowercase, transliterate accents, strip stopwords)', 'Copy slug — preview shows live as you type'],
    ex: { input: 'Cách Học Tiếng Việt Hiệu Quả 2026!', output: 'cach-hoc-tieng-viet-hieu-qua-2026', description: 'A clean URL slug with Vietnamese accents transliterated, punctuation stripped, and spaces converted to hyphens.' },
    seo: {
      intro: 'Convert any title or sentence into a clean URL slug — lowercase, hyphenated, accent-stripped, and free of special characters. Handles transliteration for Vietnamese, Chinese, Russian, Arabic, and 50+ other scripts so non-Latin titles still become readable Latin slugs. Optional stopword removal keeps slugs short and SEO-friendly.',
      examples: [
        { title: 'Vietnamese blog post', body: '`Cách Học Tiếng Việt Hiệu Quả 2026!` → `cach-hoc-tieng-viet-hieu-qua-2026` — accents removed, ready for the URL.' },
        { title: 'SEO-clean stopword stripping', body: '`The Ultimate Guide to the Best Tools` → `ultimate-guide-best-tools` (stopwords `the` / `to` removed).' },
        { title: 'Product SKU slug', body: '`Air Jordan 1 — Retro High OG 2026` → `air-jordan-1-retro-high-og-2026` for a clean product URL.' },
      ],
      useCases: ['Blog post / article URLs', 'Product / category page URLs', 'Filename normalisation', 'YouTube / podcast episode slugs', 'GitHub Pages / Jekyll permalinks'],
      troubleshooting: [
        { problem: 'CJK characters dropped to empty slug', solution: 'Enable "transliterate CJK" — by default the tool keeps original characters; transliteration converts 你好 → ni-hao.' },
        { problem: 'Slug is too long for URL field', solution: 'Set max length (default 60). Tool truncates at the last separator before the limit so words stay intact.' },
        { problem: 'Hyphens replaced with underscores unexpectedly', solution: 'Check separator setting. Default is `-`; if you switched to `_` once, it persists. Reset to defaults if needed.' },
      ],
    },
  },
};

let updated = 0, skipped = 0;

for (const [id, data] of Object.entries(DATA)) {
  const idRegex = new RegExp(`id: '${id}',`);
  const idMatch = src.match(idRegex);
  if (!idMatch) { console.warn('NOT FOUND:', id); skipped++; continue; }
  const idIdx = idMatch.index;
  let openIdx = src.lastIndexOf('  {\r\n', idIdx);
  if (openIdx < 0) openIdx = src.lastIndexOf('  {\n', idIdx);
  if (openIdx < 0) { console.warn('NO OPEN:', id); skipped++; continue; }
  let depth = 0, closeIdx = -1;
  for (let i = openIdx + 1; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  if (closeIdx < 0) { console.warn('NO CLOSE:', id); skipped++; continue; }
  const block = src.slice(openIdx, closeIdx + 1);
  if (/seoContent\s*:/.test(block)) { skipped++; continue; }
  // Anchor: relatedTools array closer
  const relMatch = block.match(/relatedTools:\s*\[[^\]]*\],\r?\n/);
  if (!relMatch) { console.warn('NO relatedTools:', id); skipped++; continue; }
  const insertAt = openIdx + relMatch.index + relMatch[0].length;

  const ex = data.ex, seo = data.seo, howTo = data.howTo;
  const exampleStr =
`    howToUse: [
${howTo.map(h => `      ${JSON.stringify(h)},`).join('\r\n')}
    ],
    exampleOutput: {
      input: ${JSON.stringify(ex.input)},
      output: ${JSON.stringify(ex.output)},
      description: ${JSON.stringify(ex.description)},
    },
    seoContent: {
      intro: ${JSON.stringify(seo.intro)},
      examples: [
${seo.examples.map(e => `        { title: ${JSON.stringify(e.title)}, body: ${JSON.stringify(e.body)} },`).join('\r\n')}
      ],
      useCases: [
${seo.useCases.map(u => `        ${JSON.stringify(u)},`).join('\r\n')}
      ],
      troubleshooting: [
${seo.troubleshooting.map(t => `        { problem: ${JSON.stringify(t.problem)}, solution: ${JSON.stringify(t.solution)} },`).join('\r\n')}
      ],
    },
`;
  const crlfStr = exampleStr.replace(/\r?\n/g, '\r\n');
  src = src.slice(0, insertAt) + crlfStr + src.slice(insertAt);
  updated++;
}

fs.writeFileSync(FILE, src);
console.log(`Updated: ${updated}, Skipped: ${skipped}`);
