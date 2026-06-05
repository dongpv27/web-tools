import { createWorker, PSM, type Worker as TesseractWorker } from 'tesseract.js';

// Languages we ship by default. The 'auto' option loads a combined
// multi-language model that recognises Latin + Vietnamese + Japanese +
// Simplified Chinese + Korean simultaneously — slower and ~30 MB download
// on first use, but works on any image without the user knowing the
// language in advance.
export type OcrLang = 'auto' | 'eng' | 'vie' | 'eng+vie' | 'chi_sim' | 'jpn' | 'kor' | 'fra' | 'spa' | 'deu' | 'rus';

// The language string Tesseract loads when 'auto' is selected. Covers ~95%
// of real-world images we see (Latin alphabets, Vietnamese diacritics, and
// the three major CJK scripts). Each additional language is a separate
// trained-data download, all loaded into one worker.
const AUTO_LANGS = 'eng+vie+jpn+chi_sim+kor';

export interface OcrProgress {
  status: string;      // e.g. 'loading tesseract core', 'recognizing text'
  progress: number;    // 0..1
}

// CJK (Chinese, Japanese, Korean) scripts need different defaults than Latin
// scripts: their characters don't have inter-word spaces, so PSM 3 (auto)
// often segments them as one giant word per line, hurting recognition. PSM 6
// (assume uniform block) consistently produces better CJK output. They also
// benefit from the larger "best" tessdata model — the default "fast" model
// strips a lot of glyph variants that CJK fonts rely on.
const CJK_LANGS = new Set(['jpn', 'chi_sim', 'chi_tra', 'kor']);

function isCjk(lang: string): boolean {
  return lang.split('+').some((l) => CJK_LANGS.has(l));
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
      const cjk = isCjk(lang);
      // Force the full WASM build (Legacy + LSTM combined) by passing
      // `legacyCore: true`. The default tesseract.js v7 picks the
      // LSTM-only WASM variant which is missing Legacy-engine functions
      // like DotProductSSE — those get called for some code paths (CJK,
      // multi-language, certain trained-data files) and crash with
      // "missing function" at runtime. The full build is ~6 MB vs ~3 MB
      // LSTM-only but works for every scenario including CJK + multi-lang.
      const worker = await createWorker(lang, 1, {
        legacyCore: true,
        // Quietly emit progress so we can surface it in the UI.
        logger: (m: { status: string; progress: number }) => {
          onProgress?.({ status: m.status, progress: m.progress ?? 0 });
        },
      });

      const multiLang = lang.includes('+');
      if (cjk && !multiLang) {
        // Single CJK language → treat the page as a uniform dense block of
        // characters (right default for Japanese/Chinese/Korean documents).
        await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK });
      }
      // Multi-language auto mode keeps PSM=AUTO (default) — most users
      // will OCR mixed-content screenshots (UI + body text), not dense CJK
      // documents. AUTO segments UI chrome and prose separately, giving
      ​// better results than SINGLE_BLOCK on real-world screenshots.
      return worker;
    })();
    workerCache.set(key, pending);
  }
  return pending;
}

/**
 * Run OCR on a canvas or image source. Returns the extracted text.
 * Reuses a cached worker per language so subsequent calls are fast.
 *
 * Pass lang='auto' to load a combined multi-language model that recognises
 * Latin / Vietnamese / Japanese / Chinese / Korean in one pass — slower
 * but works on any image without language selection. ~30 MB download on
 * first use, cached afterwards.
 */
export async function ocrImage(
  source: HTMLCanvasElement | HTMLImageElement | Blob,
  lang: OcrLang = 'eng',
  onProgress?: (p: OcrProgress) => void,
): Promise<{ text: string; detectedLang?: OcrLang; detectedScript?: string }> {
  const actualLang: OcrLang = lang === 'auto' ? (AUTO_LANGS as OcrLang) : lang;
  const worker = await getWorker(actualLang, onProgress);
  const result = await worker.recognize(source);
  return {
    text: result.data.text,
    detectedLang: lang === 'auto' ? (AUTO_LANGS as OcrLang) : undefined,
    detectedScript: lang === 'auto' ? 'multi-language' : undefined,
  };
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
    const { text } = await ocrImage(canvas, lang);
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
