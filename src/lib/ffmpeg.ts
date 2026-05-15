'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<void> | null = null;
let currentProgressHandler: ((event: { progress: number; time: number }) => void) | null = null;

export interface FFmpegProgress {
  ratio: number;
  time: number;
}

function setProgressHandler(instance: FFmpeg, onProgress?: (progress: number) => void) {
  if (currentProgressHandler) {
    instance.off('progress', currentProgressHandler);
    currentProgressHandler = null;
  }
  if (onProgress) {
    currentProgressHandler = ({ progress }) => {
      onProgress(Math.max(0, Math.min(1, progress)));
    };
    instance.on('progress', currentProgressHandler);
  }
}

export async function getFFmpeg(
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) {
    setProgressHandler(ffmpeg, onProgress);
    return ffmpeg;
  }

  if (loadPromise) {
    await loadPromise;
    if (ffmpeg && ffmpeg.loaded) {
      setProgressHandler(ffmpeg, onProgress);
      return ffmpeg;
    }
  }

  ffmpeg = new FFmpeg();
  setProgressHandler(ffmpeg, onProgress);

  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg]', message);
  });

  loadPromise = (async () => {
    const coreBaseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    // Served from /public so the worker is same-origin and its relative
    // imports resolve. Must be absolute because @ffmpeg/ffmpeg resolves it
    // against import.meta.url of a Turbopack chunk, which can be file://.
    // Setting classWorkerURL also bypasses @ffmpeg/ffmpeg's internal bundled
    // worker, whose dynamic import() Turbopack can't handle.
    const classWorkerURL = `${window.location.origin}/ffmpeg/worker.js`;
    await ffmpeg!.load({
      coreURL: await toBlobURL(`${coreBaseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${coreBaseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      classWorkerURL,
    });
  })();

  await loadPromise;
  loadPromise = null;

  return ffmpeg!;
}

export async function loadVideoFile(
  ffmpeg: FFmpeg,
  file: File,
  inputName: string = 'input'
): Promise<void> {
  await ffmpeg.writeFile(inputName, await fetchFile(file));
}

// FFmpeg `drawtext` filter requires a real TTF font inside the WASM
// filesystem (FreeType can't parse WOFF/WOFF2). The @ffmpeg/core build
// does not bundle one. We fetch TTFs on demand and cache by URL.
const DEFAULT_FONT_URL =
  'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/roboto/static/Roboto-Regular.ttf';
const FALLBACK_FONT_URL =
  'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io@main/fonts/NotoSans/full/ttf/NotoSans-Regular.ttf';

const loadedFonts = new Map<string, string>(); // url -> in-FS path

function looksLikeTTF(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 4) return false;
  const sig = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  // 0x00010000 (TrueType), 0x4F54544F "OTTO" (OpenType/CFF),
  // 0x74727565 "true" (Apple), 0x74746366 "ttcf" (collection).
  return sig === 0x00010000 || sig === 0x4f54544f || sig === 0x74727565 || sig === 0x74746366;
}

async function writeFontFromUrl(ffmpeg: FFmpeg, url: string): Promise<string> {
  const cached = loadedFonts.get(url);
  if (cached) return cached;
  const buf = await fetchFile(url);
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf as ArrayBuffer);
  if (!looksLikeTTF(bytes)) {
    throw new Error(`Fetched font is not a TTF (${url}). Got ${bytes.byteLength} bytes.`);
  }
  // Filename derived from URL so different fonts don't clobber each other.
  const path = `font-${loadedFonts.size}.ttf`;
  await ffmpeg.writeFile(path, bytes);
  loadedFonts.set(url, path);
  return path;
}

/**
 * Load a font into FFmpeg's virtual FS and return its path, ready for use
 * with `drawtext=fontfile=...`. Caches by URL across calls.
 *
 * @param ffmpeg  FFmpeg instance.
 * @param url     Optional TTF URL. Defaults to Roboto. Must be a TTF/OTF —
 *                WOFF/WOFF2 will fail the signature check.
 */
export async function ensureFont(ffmpeg: FFmpeg, url?: string): Promise<string> {
  const primary = url ?? DEFAULT_FONT_URL;
  try {
    return await writeFontFromUrl(ffmpeg, primary);
  } catch (primaryErr) {
    // Fall back to Noto Sans (only when the caller didn't ask for a
    // specific font). If a specific font was requested and failed, surface
    // the error so the user knows.
    if (url && url !== DEFAULT_FONT_URL) throw primaryErr;
    try {
      return await writeFontFromUrl(ffmpeg, FALLBACK_FONT_URL);
    } catch (fallbackErr) {
      throw new Error(
        `Failed to load a TTF font for drawtext. ${
          primaryErr instanceof Error ? primaryErr.message : String(primaryErr)
        } | fallback: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`,
      );
    }
  }
}

/**
 * Escape a user-supplied string for use inside an FFmpeg `drawtext` filter's
 * `text='...'` argument. Per FFmpeg docs the characters that need escaping
 * inside the single-quoted value are `\`, `'`, `:`, `%`, and `,`.
 */
export function escapeDrawtext(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/%/g, '\\%')
    .replace(/,/g, '\\,');
}

export async function readOutputFile(
  ffmpeg: FFmpeg,
  outputName: string
): Promise<Uint8Array<ArrayBuffer>> {
  const data = await ffmpeg.readFile(outputName);
  if (data instanceof Uint8Array) {
    // Create a new ArrayBuffer and copy the data to ensure proper typing
    const buffer = new ArrayBuffer(data.byteLength);
    const result = new Uint8Array(buffer);
    result.set(data);
    return result;
  }
  return new TextEncoder().encode(data as string) as Uint8Array<ArrayBuffer>;
}

export function unloadFFmpeg(): void {
  if (ffmpeg) {
    try {
      ffmpeg.terminate();
    } catch (e) {
      console.error('Error terminating FFmpeg:', e);
    }
    ffmpeg = null;
    loadPromise = null;
  }
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 100MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` };
  }

  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/mpeg',
    'video/3gpp',
    'video/3gpp2',
    'video/x-m4v',
  ];

  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|ogg|mov|avi|mkv|mpeg|mpg|3gp|m4v)$/i)) {
    return { valid: false, error: 'Please upload a valid video file (MP4, WebM, MOV, AVI, MKV, etc.)' };
  }

  return { valid: true };
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
