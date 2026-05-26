import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { PDFDocument, rgb } from 'pdf-lib';
import { parseUpload, rename } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';
import { pickDocFamily, embedFamily, pickWeight } from '../_lib/fonts';

// Page geometry: US Letter at 72 DPI. Chosen because pdf-lib's StandardFonts
// metrics are calibrated for this default and the result is broadly accepted.
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 56; // ~0.78 inch

interface Paragraph {
  text: string;
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4';
  /** Inline runs with bold/italic flags so we can pick the right font. */
  runs: { text: string; bold: boolean; italic: boolean }[];
  /** When set, this paragraph is a list item rendered with a bullet. */
  listLevel?: number;
}

// Walk the mammoth-produced HTML and emit a flat list of paragraphs with the
// styling info we need for PDF layout. Sticking to mammoth's HTML output keeps
// docx parsing accurate (handles styles, lists, tables… better than raw OOXML
// walking we did browser-side).
function htmlToParagraphs(html: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Strip script/style for safety; mammoth shouldn't emit them but be defensive.
  const clean = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');

  // We walk top-level block elements. Tables get flattened to row-per-line.
  const blockRegex = /<(h[1-4]|p|li|table)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  let listDepth = 0;

  while ((match = blockRegex.exec(clean)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[3];

    if (tag === 'table') {
      // Flatten each row to a tab-separated line so tables still appear, even
      // if they lose their grid lines. Better than dropping them silently.
      const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let rm: RegExpExecArray | null;
      while ((rm = rowRe.exec(inner)) !== null) {
        const cellRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        const cells: string[] = [];
        let cm: RegExpExecArray | null;
        while ((cm = cellRe.exec(rm[1])) !== null) {
          cells.push(htmlToPlain(cm[1]));
        }
        if (cells.length > 0) {
          paragraphs.push({
            text: cells.join('\t'),
            style: 'normal',
            runs: [{ text: cells.join('\t'), bold: false, italic: false }],
          });
        }
      }
      continue;
    }

    if (tag === 'li') {
      paragraphs.push({
        text: htmlToPlain(inner),
        style: 'normal',
        runs: htmlToRuns(inner),
        listLevel: Math.max(1, listDepth || 1),
      });
      continue;
    }

    // Only h1-h4 map to heading styles; <p> and anything else falls back to
    // 'normal' so the STYLE_SIZE lookup below stays defined.
    const style: Paragraph['style'] =
      tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' ? tag : 'normal';
    paragraphs.push({
      text: htmlToPlain(inner),
      style,
      runs: htmlToRuns(inner),
    });
  }

  return paragraphs;
}

function htmlToPlain(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Split inline content into bold/italic-aware runs. Approximate but covers
// the common case for legible PDF output.
function htmlToRuns(html: string): Paragraph['runs'] {
  const runs: Paragraph['runs'] = [];
  const tokens = html.split(/(<\/?(?:strong|b|em|i)>)/i);
  let bold = false;
  let italic = false;
  for (const tok of tokens) {
    if (/<strong>|<b>/i.test(tok)) bold = true;
    else if (/<\/strong>|<\/b>/i.test(tok)) bold = false;
    else if (/<em>|<i>/i.test(tok)) italic = true;
    else if (/<\/em>|<\/i>/i.test(tok)) italic = false;
    else {
      const text = htmlToPlain(tok);
      if (text) runs.push({ text, bold, italic });
    }
  }
  if (runs.length === 0) {
    const plain = htmlToPlain(html);
    if (plain) runs.push({ text: plain, bold: false, italic: false });
  }
  return runs;
}

const STYLE_SIZE = { normal: 11, h1: 22, h2: 18, h3: 15, h4: 13 } as const;
const STYLE_LEADING = { normal: 16, h1: 28, h2: 24, h3: 20, h4: 18 } as const;
const STYLE_SPACE_BEFORE = { normal: 0, h1: 18, h2: 14, h3: 10, h4: 8 } as const;
const STYLE_SPACE_AFTER = { normal: 6, h1: 8, h2: 6, h3: 4, h4: 4 } as const;

export async function POST(req: NextRequest) {
  const upload = await parseUpload(req);
  if (upload instanceof NextResponse) return upload;
  const { file } = upload;

  if (!/\.docx?$/i.test(file.filename)) {
    return NextResponse.json(
      { error: 'Expected a .docx (or .doc) file.' },
      { status: 400 },
    );
  }

  return await tryConvert('word-to-pdf', async () => {
    // mammoth gives us reasonably faithful HTML from .docx. .doc (binary) is
    // not supported by mammoth; we fall back to raw text for those.
    let paragraphs: Paragraph[];
    try {
      const { value: html } = await mammoth.convertToHtml({ buffer: file.bytes });
      paragraphs = htmlToParagraphs(html);
    } catch {
      const { value: raw } = await mammoth.extractRawText({ buffer: file.bytes });
      paragraphs = raw
        .split(/\n+/)
        .filter(t => t.trim().length > 0)
        .map(text => ({
          text,
          style: 'normal' as const,
          runs: [{ text, bold: false, italic: false }],
        }));
    }

    if (paragraphs.length === 0) {
      return NextResponse.json(
        { error: 'Document is empty.' },
        { status: 400 },
      );
    }

    const pdfDoc = await PDFDocument.create();

    // Detect dominant script across all paragraphs and load the matching font
    // family (CJK variant if any Asian text present, else Be Vietnam Pro for
    // Latin/Vietnamese). One family per doc keeps fonts consistent and limits
    // cold-start cost to a single font download per family.
    const family = pickDocFamily(paragraphs.map(p => p.text));
    const fontSet = await embedFamily(pdfDoc, family);
    const pickFont = (b: boolean, i: boolean) => pickWeight(fontSet, b, i);

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;
    const usableWidth = PAGE_WIDTH - MARGIN * 2;

    const newPage = () => {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    };

    // Be Vietnam Pro is Unicode-complete for Vietnamese; normalise to NFC
    // so decomposed sequences collapse to precomposed codepoints the font
    // ships glyphs for. (pdf-lib has no combining-mark positioning support.)
    const safe = (s: string) => s.normalize('NFC');

    // Wrap a single run's text within the remaining line width. Returns the
    // lines plus a measured width helper for the next caller in the loop.
    const wrap = (text: string, font: import('pdf-lib').PDFFont, size: number, maxWidth: number) => {
      const words = text.split(/(\s+)/);
      const lines: string[] = [];
      let current = '';
      for (const w of words) {
        const candidate = current + w;
        if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
          lines.push(current);
          current = w.trimStart();
        } else {
          current = candidate;
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    for (const p of paragraphs) {
      const size = STYLE_SIZE[p.style];
      const leading = STYLE_LEADING[p.style];

      // Space before
      y -= STYLE_SPACE_BEFORE[p.style];

      const prefix = p.listLevel ? '• ' : '';
      const leftX = MARGIN + (p.listLevel ? 14 : 0);
      const availWidth = usableWidth - (p.listLevel ? 14 : 0);

      // Build a single string per line by concatenating runs; we don't try to
      // mix fonts within a line because pdf-lib doesn't support that natively
      // and the visual cost of bold/italic loss inside long paragraphs is low.
      // Picking the predominant run's style keeps headings bold etc.
      const dominantRun = p.runs.reduce(
        (acc, r) => (r.text.length > acc.text.length ? r : acc),
        p.runs[0] ?? { text: p.text, bold: false, italic: false },
      );
      const font = pickFont(dominantRun.bold || p.style !== 'normal', dominantRun.italic);

      const sourceText = safe(prefix + p.text.replace(/\s+/g, ' ').trim());
      if (!sourceText.trim()) {
        y -= leading * 0.4;
        continue;
      }

      const lines = wrap(sourceText, font, size, availWidth);
      for (const line of lines) {
        if (y - leading < MARGIN) newPage();
        page.drawText(line, {
          x: leftX,
          y: y - size,
          size,
          font,
          color: rgb(0.12, 0.12, 0.12),
        });
        y -= leading;
      }

      y -= STYLE_SPACE_AFTER[p.style];
    }

    const pdfBytes = await pdfDoc.save();
    return fileResponse(
      Buffer.from(pdfBytes),
      rename(file.filename, 'pdf'),
      'application/pdf',
    );
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'word-to-pdf',
    method: 'POST',
    note: 'Best for text-heavy .docx documents. Headings, lists, bold/italic preserved. Tables flattened to tab-separated lines. Images dropped. Non-Latin characters require browser-side fallback (which embeds Be Vietnam Pro).',
    limits: { maxBytes: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
