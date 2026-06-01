import { createWorker, type Worker as TesseractWorker } from 'tesseract.js';

// Languages we ship by default. eng + vie covers the two we most often see;
// other scripts auto-download on first use from tessdata CDN.
export type OcrLang = 'eng' | 'vie' | 'eng+vie' | 'chi_sim' | 'jpn' | 'kor' | 'fra' | 'spa' | 'deu' | 'rus';

export interface OcrProgress {
  status: string;      // e.g. 'loading tesseract core', 'recognizing text'
  progress: number;    // 0..1
}

// One shared worker per language across the page life-cycle. Recreating a
// worker per page is the #1 perf trap with tesseract.js — it re-downloads
// the trained data each time.
const workerCache = new Map<string, Promise<TesseractWorker>>();

async function getWorker(lang: OcrLang, onProgress?: (p: OcrProgress) => void): Promise<TesseractWorker> {
  const key = lang;
  let pending = workerCache.get(key);
  if (!pending) {
    pending = (async () => {
      const worker = await createWorker(lang, 1, {
        // Quietly emit progress so we can surface it in the UI.
        logger: (m: { status: string; progress: number }) => {
          onProgress?.({ status: m.status, progress: m.progress ?? 0 });
        },
      });
      return worker;
    })();
    workerCache.set(key, pending);
  }
  return pending;
}

/**
 * Run OCR on a canvas or image source. Returns the extracted text.
 * Reuses a cached worker per language so subsequent calls are fast.
 */
export async function ocrImage(
  source: HTMLCanvasElement | HTMLImageElement | Blob,
  lang: OcrLang = 'eng',
  onProgress?: (p: OcrProgress) => void,
): Promise<string> {
  const worker = await getWorker(lang, onProgress);
  const result = await worker.recognize(source);
  return result.data.text;
}

/**
 * OCR a list of pdfjs pages by rendering each to a hidden canvas. The pdfjs
 * page proxy must support .getViewport() and .render(). Calls back with the
 * extracted text per page so the caller can stream output.
 */
export async function ocrPdfPages(
  pdf: { numPages: number; getPage(n: number): Promise<PdfPageLike> },
  lang: OcrLang = 'eng',
  onPage?: (pageIndex: number, text: string) => void,
  onProgress?: (pageIndex: number, totalPages: number, status: string) => void,
  scale = 2,
): Promise<string[]> {
  const out: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(i, pdf.numPages, 'rendering');
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas 2D context');
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    onProgress?.(i, pdf.numPages, 'ocr');
    const text = await ocrImage(canvas, lang);
    out.push(text);
    onPage?.(i, text);
  }
  return out;
}

// Minimal structural type for a pdfjs page — avoids importing pdfjs types here.
interface PdfPageLike {
  getViewport(opts: { scale: number }): { width: number; height: number };
  render(opts: {
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }): { promise: Promise<void> };
}

/**
 * Heuristic: decide if a PDF page is "scanned" (image-only) by checking how
 * much text pdfjs's getTextContent returned. Pages under ~30 characters are
 * very likely scanned — fall back to OCR.
 */
export function pageLooksScanned(textLength: number, minChars = 30): boolean {
  return textLength < minChars;
}

/**
 * Free the worker pool. Call on hard navigation if you want to release
 * memory; otherwise leave them cached for the page life-cycle.
 */
export async function terminateOcrWorkers(): Promise<void> {
  for (const pending of workerCache.values()) {
    try {
      const w = await pending;
      await w.terminate();
    } catch {
      // Best-effort — ignore termination errors.
    }
  }
  workerCache.clear();
}
