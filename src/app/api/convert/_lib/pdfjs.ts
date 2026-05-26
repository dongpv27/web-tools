// Shared pdfjs-dist setup for Node.js serverless routes.
//
// pdf.js refuses to start until GlobalWorkerOptions.workerSrc resolves to
// the worker file (even in Node, where the "worker" runs in-thread). We
// point it at the file inside node_modules using an absolute path anchored
// at the project root — this is stable across local dev and Vercel
// functions, both of which run with cwd == project root and include
// node_modules in the deployment.
//
// `pdfjs-dist` must be in next.config.ts → serverExternalPackages so
// Turbopack/webpack don't bundle it (bundling rewrites internal path
// resolution and breaks the worker import).
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Node's ESM loader requires a file:// URL on Windows (a raw "D:\..." path is
// rejected as an unsupported protocol "d:"). On Linux/macOS the URL form
// works too, so we convert unconditionally.
const workerPath = path.join(
  process.cwd(),
  'node_modules',
  'pdfjs-dist',
  'legacy',
  'build',
  'pdf.worker.mjs',
);
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

// Path to pdfjs-dist's bundled standard PDF fonts. Some PDFs reference these
// fonts without embedding them; pdf.js needs the directory to substitute and
// extract characters correctly. Routes pass this to getDocument().
const standardFontDataUrl =
  pathToFileURL(
    path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'standard_fonts') +
      path.sep,
  ).href;

// Adobe CMap data. Required when a PDF references a CID font without an
// embedded ToUnicode CMap — without this, getTextContent() returns "?" for
// every character outside the font's built-in mapping (very common in
// Vietnamese PDFs produced by older tools). Routes pass cMapUrl + cMapPacked.
const cMapUrl =
  pathToFileURL(
    path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'cmaps') + path.sep,
  ).href;

export { pdfjsLib, standardFontDataUrl, cMapUrl };
