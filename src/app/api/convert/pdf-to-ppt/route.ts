import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';
import { pdfjsLib, standardFontDataUrl, cMapUrl } from '../_lib/pdfjs';
import { parseUpload, rename } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// PPTX-safe text: strip the XML 1.0 disallowed control characters (anything
// in U+0000 to U+001F except tab/LF/CR). PowerPoint refuses to open a deck
// containing these; PptxGenJS doesn't filter them itself.
const CONTROL_CHARS = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]', 'g');
const sanitize = (s: string): string => s.replace(CONTROL_CHARS, '');

export async function POST(req: NextRequest) {
  const upload = await parseUpload(req);
  if (upload instanceof NextResponse) return upload;
  const { file } = upload;

  if (!/\.pdf$/i.test(file.filename)) {
    return NextResponse.json({ error: 'Expected a .pdf file.' }, { status: 400 });
  }

  return await tryConvert('pdf-to-ppt', async () => {
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(file.bytes),
      verbosity: 0 as unknown as number,
      standardFontDataUrl,
      cMapUrl,
      cMapPacked: true,
    }).promise;

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

    let madeSlides = 0;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = content.items
        .map((raw) => {
          const it = raw as { str?: unknown; transform?: number[] };
          if (typeof it.str !== 'string' || !Array.isArray(it.transform)) return null;
          return {
            str: it.str,
            y: it.transform[5],
            size: Math.sqrt(it.transform[0] ** 2 + it.transform[1] ** 2),
          };
        })
        .filter((x): x is { str: string; y: number; size: number } => x !== null);

      if (items.length === 0) continue;

      items.sort((a, b) => b.y - a.y);

      // Heuristic title: largest text in the top 20% of the page.
      const maxY = items[0].y;
      const minY = items[items.length - 1].y;
      const topZone = maxY - (maxY - minY) * 0.2;
      const titleCandidates = items.filter((it) => it.y >= topZone);
      titleCandidates.sort((a, b) => b.size - a.size || b.y - a.y);
      const title = sanitize(titleCandidates[0]?.str.trim() ?? `Page ${i}`);

      // Body: every other line, grouped by Y proximity into one line per row.
      const bodyLines: string[] = [];
      let currentY: number | null = null;
      let currentText = '';
      let titleSkipped = false;
      for (const it of items) {
        if (!titleSkipped && it.str.trim() === title) {
          titleSkipped = true;
          continue;
        }
        if (currentY === null || Math.abs(it.y - currentY) > 2) {
          if (currentText.trim()) bodyLines.push(currentText.trim());
          currentText = it.str;
          currentY = it.y;
        } else {
          currentText += ' ' + it.str;
        }
      }
      if (currentText.trim()) bodyLines.push(currentText.trim());

      const slide = pptx.addSlide();
      slide.addText(title, {
        x: 0.5,
        y: 0.4,
        w: 12.3,
        h: 0.8,
        fontSize: 28,
        bold: true,
        color: '1f2937',
      });
      if (bodyLines.length > 0) {
        slide.addText(
          bodyLines.map((t) => ({ text: sanitize(t), options: { breakLine: true } })),
          {
            x: 0.5,
            y: 1.4,
            w: 12.3,
            h: 5.8,
            fontSize: 14,
            color: '374151',
            valign: 'top',
          },
        );
      }
      madeSlides++;
    }

    if (madeSlides === 0) {
      return NextResponse.json(
        {
          error:
            'PDF contains no extractable text. Scanned/image-only PDFs need OCR — not supported here.',
        },
        { status: 400 },
      );
    }

    // pptxgenjs typings declare Promise<string> for outputType 'nodebuffer'
    // but the runtime actually returns Buffer — cast quiets TS.
    const buf = (await pptx.write({ outputType: 'nodebuffer' })) as unknown as Buffer;
    return fileResponse(
      buf,
      rename(file.filename, 'pptx'),
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    );
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'pdf-to-ppt',
    method: 'POST',
    note: 'Creates one slide per PDF page. Title = largest text in the top of the page; body = the rest. Images/layout not preserved.',
    limits: { maxBytes: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
