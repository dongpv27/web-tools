/**
 * Mobile audit: screenshot key tools at 375px (iPhone SE), 768px (iPad portrait),
 * and 1024px (desktop) so we can compare layout breakage.
 *
 * Usage:
 *   npm run dev   (in another terminal)
 *   node scripts/mobile-audit.mjs
 *
 * Output: public/mobile-audit/<slug>-<width>.png
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve('public/mobile-audit');

const TOOLS = [
  'qr-code-generator',
  'random-password-generator',
  'audio-merger',
  'image-compressor',
  'image-resize',
  'background-remover',
  'image-upscaler',
  'image-to-text',
  'audio-converter',
  'audio-trimmer',
];

const VIEWPORTS = [
  { w: 375, h: 812, label: '375' },   // iPhone SE / 12 mini
  { w: 768, h: 1024, label: '768' },  // iPad portrait
  { w: 1024, h: 768, label: '1024' }, // small laptop
];

await fs.mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
    userAgent: vp.w <= 500
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await context.newPage();

  for (const slug of TOOLS) {
    const url = `${BASE_URL}/${slug}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      // Wait for the tool client (dynamic import) to render. Most clients show
      // an input/textarea/button within ~1s.
      await page.waitForSelector('button, input, textarea', { timeout: 6000 }).catch(() => {});
      await page.waitForTimeout(800); // settle animations
      const file = path.join(OUT_DIR, `${slug}-${vp.label}.png`);
      await page.screenshot({ path: file, fullPage: true });
      // Detect horizontal overflow — a strong mobile-break signal.
      const overflow = await page.evaluate(() => {
        return Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      });
      results.push({ slug, viewport: vp.label, ok: true, overflow });
      process.stdout.write(`  ✓ ${slug} @ ${vp.label}${overflow ? ` (overflow ${overflow}px)` : ''}\n`);
    } catch (e) {
      results.push({ slug, viewport: vp.label, ok: false, error: String(e) });
      process.stdout.write(`  ✗ ${slug} @ ${vp.label}: ${(e instanceof Error ? e.message : String(e))}\n`);
    }
  }
  await context.close();
}

await browser.close();

// Summary report
console.log('\n=== Mobile audit summary ===');
const overflows = results.filter((r) => r.ok && r.overflow > 0);
if (overflows.length === 0) {
  console.log('No horizontal overflow detected across tools/viewports.');
} else {
  console.log('Horizontal overflow detected:');
  for (const o of overflows) console.log(`  ${o.slug} @ ${o.viewport}px → ${o.overflow}px overflow`);
}
console.log(`\nScreenshots in: ${OUT_DIR}`);
