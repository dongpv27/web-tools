import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { parseUpload, rename } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Allow longer than the Vercel Hobby 10s default for large workbooks. On Hobby
// this still caps at 10s — upgrade plan to fluid compute for full effect.
export const maxDuration = 60;

interface SheetOptions {
  /** Index of sheet to convert when single-sheet output requested (default: 0) */
  sheetIndex?: number;
  /** When true, returns a ZIP containing one CSV per sheet. */
  allSheets?: boolean;
  /** Field separator (default: ","). */
  delimiter?: string;
  /** Whether to prepend a UTF-8 BOM so Excel opens the CSV in the right encoding. */
  includeBom?: boolean;
}

function readOpts(fields: Record<string, string>): SheetOptions {
  return {
    sheetIndex: fields.sheetIndex ? Number(fields.sheetIndex) : 0,
    allSheets: fields.allSheets === 'true',
    delimiter: fields.delimiter || ',',
    includeBom: fields.includeBom !== 'false',
  };
}

export async function POST(req: NextRequest) {
  const upload = await parseUpload(req);
  if (upload instanceof NextResponse) return upload;
  const { file, fields } = upload;
  const opts = readOpts(fields);

  return await tryConvert('excel-to-csv', async () => {
    // SheetJS auto-detects xlsx, xls, ods, csv. cellDates: true emits Date objects
    // so date columns aren't dumped as Excel serial numbers in the CSV.
    const wb = XLSX.read(file.bytes, { type: 'buffer', cellDates: true });
    if (wb.SheetNames.length === 0) {
      return NextResponse.json(
        { error: 'No sheets found in the workbook.' },
        { status: 400 },
      );
    }

    const bom = '﻿';

    if (opts.allSheets && wb.SheetNames.length > 1) {
      // Bundle each sheet as its own CSV inside a ZIP so a multi-sheet workbook
      // round-trips cleanly without losing any tabs.
      const zip = new JSZip();
      for (const name of wb.SheetNames) {
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name], { FS: opts.delimiter });
        const body = opts.includeBom ? bom + csv : csv;
        zip.file(`${name.replace(/[^\w.\-]+/g, '_')}.csv`, body);
      }
      const zipBytes = await zip.generateAsync({ type: 'nodebuffer' });
      return fileResponse(zipBytes, rename(file.filename, 'zip'), 'application/zip');
    }

    const idx = Math.min(Math.max(opts.sheetIndex ?? 0, 0), wb.SheetNames.length - 1);
    const sheet = wb.Sheets[wb.SheetNames[idx]];
    const csv = XLSX.utils.sheet_to_csv(sheet, { FS: opts.delimiter });
    const body = opts.includeBom ? bom + csv : csv;

    return fileResponse(
      Buffer.from(body, 'utf-8'),
      rename(file.filename, 'csv'),
      'text/csv; charset=utf-8',
    );
  });
}

// Lightweight GET to make the endpoint self-documenting + verifies the route
// is wired up after deploy (visit /api/convert/excel-to-csv in a browser).
export async function GET() {
  return NextResponse.json({
    endpoint: 'excel-to-csv',
    method: 'POST',
    contentType: 'multipart/form-data',
    fields: {
      file: 'required — .xlsx, .xls, .ods, or .csv',
      sheetIndex: 'optional — 0-based sheet index when not exporting all sheets',
      allSheets: 'optional — "true" to receive a ZIP of CSVs',
      delimiter: 'optional — default ","',
      includeBom: 'optional — "false" to omit the UTF-8 BOM',
    },
    limits: { maxBytes: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
