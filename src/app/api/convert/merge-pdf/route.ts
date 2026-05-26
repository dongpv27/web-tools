import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { parseMultipleUploads } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const upload = await parseMultipleUploads(req, { fieldName: 'files', minFiles: 2 });
  if (upload instanceof NextResponse) return upload;
  const { files } = upload;

  return await tryConvert('merge-pdf', async () => {
    // Validate each file is a PDF up-front so we can return a clear error
    // instead of a cryptic pdf-lib parse failure later in the loop.
    for (const f of files) {
      if (!/\.pdf$/i.test(f.filename)) {
        return NextResponse.json(
          { error: `Not a PDF: ${f.filename}` },
          { status: 400 },
        );
      }
    }

    const merged = await PDFDocument.create();
    for (const f of files) {
      try {
        const src = await PDFDocument.load(f.bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to read "${f.filename}": ${(err as Error).message}` },
          { status: 400 },
        );
      }
    }

    const out = await merged.save();
    return fileResponse(Buffer.from(out), 'merged.pdf', 'application/pdf');
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'merge-pdf',
    method: 'POST',
    fields: { files: 'required — 2+ PDF files (multipart/form-data, repeated field)' },
    limits: { maxBytesTotal: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
