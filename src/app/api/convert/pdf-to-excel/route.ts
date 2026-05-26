import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { parseUpload, rename } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';
import { extractPdfTables } from '../_lib/pdf-table';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const upload = await parseUpload(req);
  if (upload instanceof NextResponse) return upload;
  const { file } = upload;

  if (!/\.pdf$/i.test(file.filename)) {
    return NextResponse.json({ error: 'Expected a .pdf file.' }, { status: 400 });
  }

  return await tryConvert('pdf-to-excel', async () => {
    const pages = await extractPdfTables(file.bytes);
    const total = pages.reduce((sum, p) => sum + p.rows.length, 0);
    if (total === 0) {
      return NextResponse.json(
        {
          error:
            'PDF contains no extractable text. Scanned/image-only PDFs need OCR — not supported here.',
        },
        { status: 400 },
      );
    }

    const wb = XLSX.utils.book_new();
    for (const { pageNumber, rows } of pages) {
      // Skip blank pages — they create empty sheets that look like bugs.
      if (rows.length === 0) continue;
      const sheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, sheet, `Page ${pageNumber}`);
    }
    const out = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return fileResponse(
      Buffer.isBuffer(out) ? out : Buffer.from(out),
      rename(file.filename, 'xlsx'),
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'pdf-to-excel',
    method: 'POST',
    note: 'Extracts text-layer rows from a PDF and writes one sheet per page. Column detection is heuristic (clusters x-positions) — works well for grid-like tables, less so for free-form layouts.',
    limits: { maxBytes: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
