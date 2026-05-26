import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { parseMultipleUploads } from '../_lib/upload';
import { fileResponse, tryConvert } from '../_lib/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const upload = await parseMultipleUploads(req, { fieldName: 'files', minFiles: 2 });
  if (upload instanceof NextResponse) return upload;
  const { files, fields } = upload;

  // Sheets from different workbooks may collide on name (e.g. each file has a
  // "Sheet1"). Browsers can't disambiguate, so we always prefix with the
  // source filename. Allow opting out via `prefixSheetNames=false`.
  const prefixSheetNames = fields.prefixSheetNames !== 'false';

  return await tryConvert('merge-excel', async () => {
    for (const f of files) {
      if (!/\.(xlsx|xls|ods|csv)$/i.test(f.filename)) {
        return NextResponse.json(
          { error: `Unsupported file: ${f.filename}` },
          { status: 400 },
        );
      }
    }

    const merged = XLSX.utils.book_new();
    const usedNames = new Set<string>();
    const safeName = (raw: string) => {
      // Excel sheet name limit is 31 chars and forbids \ / ? * [ ]
      let name = raw.replace(/[\\\/?*[\]]/g, '_').slice(0, 31);
      if (!name) name = 'Sheet';
      let candidate = name;
      let i = 2;
      while (usedNames.has(candidate)) {
        const suffix = `_${i}`;
        candidate = name.slice(0, 31 - suffix.length) + suffix;
        i++;
      }
      usedNames.add(candidate);
      return candidate;
    };

    for (const f of files) {
      let wb: XLSX.WorkBook;
      try {
        wb = XLSX.read(f.bytes, { type: 'buffer', cellDates: true });
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to read "${f.filename}": ${(err as Error).message}` },
          { status: 400 },
        );
      }
      const fileBase = f.filename.replace(/\.[^/.]+$/, '');
      for (const name of wb.SheetNames) {
        const sheet = wb.Sheets[name];
        const proposed = prefixSheetNames ? `${fileBase}_${name}` : name;
        XLSX.utils.book_append_sheet(merged, sheet, safeName(proposed));
      }
    }

    const out = XLSX.write(merged, { type: 'buffer', bookType: 'xlsx' });
    return fileResponse(
      Buffer.isBuffer(out) ? out : Buffer.from(out),
      'merged.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  });
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'merge-excel',
    method: 'POST',
    fields: {
      files: 'required — 2+ Excel/CSV files',
      prefixSheetNames: 'optional — "false" to keep original sheet names (may collide)',
    },
    limits: { maxBytesTotal: 25 * 1024 * 1024, maxDuration: 60 },
  });
}
