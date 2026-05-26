import { NextRequest, NextResponse } from 'next/server';
import { parseUpload, rename } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';
import { extractPdfTables } from '../_lib/pdf-table';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const escapeCell = (cell: string, delim: string): string => {
  const needsQuote = cell.includes(delim) || cell.includes('"') || /[\r\n]/.test(cell);
  if (!needsQuote) return cell;
  return `"${cell.replace(/"/g, '""')}"`;
};

export async function POST(req: NextRequest) {
  const upload = await parseUpload(req);
  if (upload instanceof NextResponse) return upload;
  const { file, fields } = upload;

  if (!/\.pdf$/i.test(file.filename)) {
    return NextResponse.json({ error: 'Expected a .pdf file.' }, { status: 400 });
  }

  const delimiter = fields.delimiter || ',';
  const includeBom = fields.includeBom !== 'false';
  const pageSeparator = fields.pageSeparator ?? '';

  return await tryConvert('pdf-to-csv', async () => {
    const pages = await extractPdfTables(file.bytes);
    if (pages.every((p) => p.rows.length === 0)) {
      return NextResponse.json(
        {
          error:
            'PDF contains no extractable text. Scanned/image-only PDFs need OCR — not supported here.',
        },
        { status: 400 },
      );
    }

    const lines: string[] = [];
    for (let i = 0; i < pages.length; i++) {
      const { rows } = pages[i];
      if (rows.length === 0) continue;
      for (const row of rows) {
        lines.push(row.map((c) => escapeCell(c, delimiter)).join(delimiter));
      }
      if (pageSeparator && i < pages.length - 1) {
        lines.push(pageSeparator);
      }
    }

    const body = (includeBom ? '﻿' : '') + lines.join('\n');
    return fileResponse(
      Buffer.from(body, 'utf-8'),
      rename(file.filename, 'csv'),
      'text/csv; charset=utf-8',
    );
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'pdf-to-csv',
    method: 'POST',
    fields: {
      file: 'required — .pdf',
      delimiter: 'optional — default ","',
      includeBom: 'optional — "false" to omit UTF-8 BOM',
      pageSeparator: 'optional — text inserted between pages (default: none)',
    },
    limits: { maxBytes: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
