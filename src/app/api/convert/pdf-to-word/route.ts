import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } from 'docx';
import { pdfjsLib, standardFontDataUrl, cMapUrl } from '../_lib/pdfjs';
import { parseUpload, rename } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface PageContent {
  /** Logical "lines" reconstructed from text positions. */
  lines: { text: string; size: number }[];
  pageNumber: number;
}

/**
 * Extract text from a PDF page while preserving line structure by grouping
 * items that share a Y coordinate (within a small tolerance). pdf.js returns
 * text in document order which often isn't visual order, so we re-sort by Y
 * (top to bottom), then X (left to right) within each line.
 */
// Loose typing — pdfjs-dist exposes PDFDocumentProxy on the namespace import
// but our helper re-exports the value only. The duck-typed shape we use here
// is small enough that an explicit type isn't worth the import gymnastics.
type PdfDoc = Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>;

async function extractPage(
  pdf: PdfDoc,
  pageNumber: number,
): Promise<PageContent> {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  // Each item.transform is a 6-element 2D affine matrix [a, b, c, d, e, f].
  // e = X (left), f = Y (baseline from bottom). Font size ≈ sqrt(a^2 + b^2).
  type Item = { str: string; x: number; y: number; size: number };
  const items: Item[] = [];
  for (const raw of content.items) {
    const it = raw as { str?: unknown; transform?: number[] };
    if (typeof it.str !== 'string' || !Array.isArray(it.transform)) continue;
    const t = it.transform;
    items.push({
      str: it.str,
      x: t[4],
      y: t[5],
      size: Math.sqrt(t[0] * t[0] + t[1] * t[1]),
    });
  }

  // Sort top→bottom (Y descending in PDF coords), then left→right.
  items.sort((a, b) => (Math.abs(a.y - b.y) > 2 ? b.y - a.y : a.x - b.x));

  // Group consecutive items into lines when Y is within tolerance.
  const lines: { text: string; size: number }[] = [];
  let currentY: number | null = null;
  let currentLine: { parts: string[]; xPositions: number[]; size: number } | null = null;
  for (const it of items) {
    if (currentY === null || Math.abs(it.y - currentY) > 2) {
      if (currentLine) {
        lines.push({
          text: joinLine(currentLine.parts, currentLine.xPositions),
          size: currentLine.size,
        });
      }
      currentLine = { parts: [it.str], xPositions: [it.x], size: it.size };
      currentY = it.y;
    } else {
      currentLine!.parts.push(it.str);
      currentLine!.xPositions.push(it.x);
    }
  }
  if (currentLine) {
    lines.push({
      text: joinLine(currentLine.parts, currentLine.xPositions),
      size: currentLine.size,
    });
  }

  return { lines, pageNumber };
}

// pdf.js often returns each word as a separate item without spaces. Re-insert
// a space when the next item is to the right with a visible gap.
function joinLine(parts: string[], xs: number[]): string {
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === 0) {
      out += p;
      continue;
    }
    const prevX = xs[i - 1];
    const x = xs[i];
    const gap = x - prevX;
    if (!out.endsWith(' ') && !p.startsWith(' ') && gap > 1) out += ' ';
    out += p;
  }
  return out.replace(/[ \t]+/g, ' ').trimEnd();
}

export async function POST(req: NextRequest) {
  const upload = await parseUpload(req);
  if (upload instanceof NextResponse) return upload;
  const { file } = upload;

  if (!/\.pdf$/i.test(file.filename)) {
    return NextResponse.json(
      { error: 'Expected a .pdf file.' },
      { status: 400 },
    );
  }

  return await tryConvert('pdf-to-word', async () => {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(file.bytes),
      // Suppress noisy stdout from pdf.js when warnings hit serverless logs.
      verbosity: 0 as unknown as number,
      // Help pdf.js substitute unembedded standard fonts when the PDF only
      // references them — improves text extraction for some PDFs.
      standardFontDataUrl,
      // Adobe CMaps for CID fonts without ToUnicode — fixes "?" output for
      // Vietnamese/CJK PDFs that ship subsetted fonts without proper Unicode
      // mapping tables.
      cMapUrl,
      cMapPacked: true,
    });
    const pdf = await loadingTask.promise;

    const pages: PageContent[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      pages.push(await extractPage(pdf, i));
    }

    if (pages.every(p => p.lines.length === 0)) {
      return NextResponse.json(
        {
          error:
            'PDF contains no extractable text. Scanned/image-only PDFs need OCR — try a different tool.',
        },
        { status: 400 },
      );
    }

    // Median font size on the first page is our baseline; lines significantly
    // larger become Heading 2 so the output has some structure instead of one
    // wall of paragraphs.
    const baselineSize = medianSize(pages[0]?.lines ?? []);
    const headingThreshold = baselineSize * 1.4;

    const docChildren: (Paragraph | PageBreak)[] = [];
    for (let pi = 0; pi < pages.length; pi++) {
      const { lines } = pages[pi];
      for (const line of lines) {
        if (!line.text.trim()) continue;
        const isHeading = line.size >= headingThreshold;
        // NFC: pdf.js often emits Vietnamese as decomposed base+combining
        // pairs. Word renders those with diacritics floating in wrong spots
        // — NFC collapses to precomposed codepoints (U+1EA0–U+1EF9 etc.).
        const text = line.text.normalize('NFC');
        docChildren.push(
          new Paragraph({
            heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
            children: [new TextRun({ text, bold: isHeading })],
          }),
        );
      }
      if (pi < pages.length - 1) {
        docChildren.push(
          new Paragraph({ children: [new PageBreak()] }),
        );
      }
    }

    const doc = new Document({
      sections: [{ properties: {}, children: docChildren as Paragraph[] }],
    });
    const docxBytes = await Packer.toBuffer(doc);

    return fileResponse(
      docxBytes,
      rename(file.filename, 'docx'),
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });
}

function medianSize(lines: { size: number }[]): number {
  if (lines.length === 0) return 11;
  const sizes = lines.map(l => l.size).sort((a, b) => a - b);
  return sizes[Math.floor(sizes.length / 2)];
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'pdf-to-word',
    method: 'POST',
    note: 'Extracts text-layer content from a PDF and produces a .docx. Headings inferred from font size. Tables/images not preserved. Scanned PDFs need OCR.',
    limits: { maxBytes: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
