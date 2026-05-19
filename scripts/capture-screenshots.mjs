/**
 * Capture screenshots for top tools using Playwright.
 *
 * Prerequisites (one-time setup):
 *   npm install --save-dev playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   # 1. Start dev server in another terminal:
 *   npm run dev
 *
 *   # 2. Run the capture script:
 *   node scripts/capture-screenshots.mjs
 *
 *   # OR target a specific host (e.g. production):
 *   BASE_URL=https://lovewebtools.com node scripts/capture-screenshots.mjs
 *
 * Output: PNG files in /public/screenshots/<slug>.png at 1600×1000 (downscaled
 * by Next/Image to fit any container).
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve('public/screenshots');

// Top 30 tools — focus on ones likely to drive traffic. Same list as Round 3
// SEO enrichment so screenshots and content depth align.
const TOP_TOOLS = [
  // Developer
  'json-formatter',
  'json-validator',
  'json-to-yaml',
  'yaml-to-json',
  'base64-encode',
  'base64-decode',
  'url-encode',
  'url-decode',
  'uuid-generator',
  'timestamp-converter',
  'random-password-generator',
  'regex-tester',
  'jwt-decoder',
  'md5-hash-generator',
  'sha256-hash-generator',
  'html-formatter',
  'css-formatter',
  'sql-formatter',
  // Converters
  'csv-to-json',
  'json-to-csv',
  'qr-code-generator',
  'markdown-to-html',
  // Image
  'image-resize',
  'image-compressor',
  // Text
  'word-counter',
  'text-case-converter',
  'lorem-ipsum',
  // Office
  'excel-to-csv',
  'word-to-pdf',
  'pdf-to-word',
];

async function main() {
  console.log(`Capturing ${TOP_TOOLS.length} tools from ${BASE_URL}`);
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    // Flags that prevent the "Page crashed" issue seen on Windows with the
    // dev server: disable sandbox, give chromium more shared memory, and skip
    // GPU acceleration (headless doesn't need it).
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-features=VizDisplayCompositor',
    ],
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
    // Mark JS-heavy tools (e.g. ffmpeg.wasm) as benign so the browser doesn't
    // think the page is unresponsive while they load.
    bypassCSP: true,
  });
  const page = await context.newPage();

  let ok = 0;
  let fail = 0;

  for (const slug of TOP_TOOLS) {
    const url = `${BASE_URL}/${slug}`;
    const outPath = path.join(OUT_DIR, `${slug}.png`);

    try {
      // `load` is more reliable than `networkidle` for pages with long-running
      // background WASM downloads (ffmpeg, pdfjs worker prefetch, etc.).
      await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
      await page.waitForTimeout(800); // give React hydration a beat

      // Try to find the main tool card region. Falls back to viewport.
      const toolCard = await page.locator('main > div').first();
      const exists = await toolCard.count();

      if (exists > 0) {
        // Hide the breadcrumb, H1, and description above the tool card so the
        // screenshot is just the tool UI itself.
        await page.evaluate(() => {
          document.querySelectorAll('nav[aria-label="Breadcrumb"], main h1, main h1 + p').forEach(
            (el) => ((el).style.display = 'none'),
          );
        });

        await page.waitForTimeout(400); // let layout settle
        await page.screenshot({
          path: outPath,
          clip: {
            x: 0,
            y: 0,
            width: 1600,
            height: 1000,
          },
        });
      } else {
        await page.screenshot({ path: outPath, fullPage: false });
      }

      console.log(`  ✓ ${slug}`);
      ok++;
    } catch (err) {
      console.warn(`  ✗ ${slug} — ${err instanceof Error ? err.message : err}`);
      fail++;
    }
  }

  await browser.close();
  console.log(`\nDone. ${ok} captured, ${fail} failed.`);
  console.log(`Files: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
