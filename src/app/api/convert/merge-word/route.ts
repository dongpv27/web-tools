import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } from 'docx';
import { parseMultipleUploads } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ExtractedPara {
  text: string;
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4';
  bullet: boolean;
}

/**
 * Pull paragraphs out of a single .docx file via mammoth's HTML output, then
 * normalise headings + bullet lists into a uniform shape so we can stitch
 * everything together into a fresh, valid docx.
 */
async function extractParagraphs(bytes: Buffer): Promise<ExtractedPara[]> {
  const { value: html } = await mammoth.convertToHtml({ buffer: bytes });
  const paragraphs: ExtractedPara[] = [];
  const blockRe = /<(h[1-4]|p|li)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const inner = m[3];
    const text = stripHtml(inner);
    if (!text) continue;
    if (tag === 'li') {
      paragraphs.push({ text, style: 'normal', bullet: true });
    } else if (tag === 'p') {
      paragraphs.push({ text, style: 'normal', bullet: false });
    } else {
      paragraphs.push({ text, style: tag as ExtractedPara['style'], bullet: false });
    }
  }
  return paragraphs;
}

function stripHtml(html: string): string {
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

const STYLE_TO_HEADING = {
  normal: undefined,
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
} as const;

export async function POST(req: NextRequest) {
  const upload = await parseMultipleUploads(req, { fieldName: 'files', minFiles: 2 });
  if (upload instanceof NextResponse) return upload;
  const { files, fields } = upload;
  const insertPageBreaks = fields.pageBreaks !== 'false';

  return await tryConvert('merge-word', async () => {
    for (const f of files) {
      if (!/\.docx$/i.test(f.filename)) {
        return NextResponse.json(
          { error: `Not a .docx file: ${f.filename}` },
          { status: 400 },
        );
      }
    }

    const allChildren: Paragraph[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      let paras: ExtractedPara[];
      try {
        paras = await extractParagraphs(f.bytes);
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to read "${f.filename}": ${(err as Error).message}` },
          { status: 400 },
        );
      }
      for (const p of paras) {
        allChildren.push(
          new Paragraph({
            heading: STYLE_TO_HEADING[p.style],
            bullet: p.bullet ? { level: 0 } : undefined,
            children: [new TextRun({ text: p.text })],
          }),
        );
      }
      // Page break between documents so the source separation stays visible.
      if (insertPageBreaks && i < files.length - 1) {
        allChildren.push(new Paragraph({ children: [new PageBreak()] }));
      }
    }

    if (allChildren.length === 0) {
      return NextResponse.json({ error: 'All documents are empty.' }, { status: 400 });
    }

    const doc = new Document({
      sections: [{ properties: {}, children: allChildren }],
    });
    const buf = await Packer.toBuffer(doc);
    return fileResponse(
      buf,
      'merged.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'merge-word',
    method: 'POST',
    fields: {
      files: 'required — 2+ .docx files',
      pageBreaks: 'optional — "false" to omit page breaks between documents',
    },
    limits: { maxBytesTotal: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
