// Shared helper for tools that need to extract tabular data from a PDF.
// pdfjs-dist exposes per-item (x, y) coordinates which we cluster into rows
// and columns. Not as accurate as Camelot/Tabula, but good enough for most
// text-layer PDFs without resorting to OCR or a heavy native dep.
import { pdfjsLib, standardFontDataUrl, cMapUrl } from './pdfjs';

interface RawItem {
  str: string;
  x: number;
  y: number;
  width: number;
}

export interface PageTable {
  pageNumber: number;
  rows: string[][];
}

/** Extract a sequence of "tables" (one per page) from a PDF buffer. */
export async function extractPdfTables(bytes: Buffer): Promise<PageTable[]> {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(bytes),
    verbosity: 0 as unknown as number,
    standardFontDataUrl,
    cMapUrl,
    cMapPacked: true,
  }).promise;

  const out: PageTable[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const items: RawItem[] = [];
    for (const raw of content.items) {
      const it = raw as { str?: unknown; transform?: number[]; width?: number };
      if (typeof it.str !== 'string' || !Array.isArray(it.transform)) continue;
      const t = it.transform;
      items.push({
        str: it.str,
        x: t[4],
        y: t[5],
        width: typeof it.width === 'number' ? it.width : 0,
      });
    }
    if (items.length === 0) {
      out.push({ pageNumber: pageNo, rows: [] });
      continue;
    }
    out.push({ pageNumber: pageNo, rows: itemsToRows(items) });
  }
  return out;
}

function itemsToRows(items: RawItem[]): string[][] {
  // Group items into lines by Y coordinate (tolerance: 2 PDF units).
  items.sort((a, b) => (Math.abs(a.y - b.y) > 2 ? b.y - a.y : a.x - b.x));

  type Line = { y: number; items: RawItem[] };
  const lines: Line[] = [];
  for (const it of items) {
    const last = lines[lines.length - 1];
    if (!last || Math.abs(last.y - it.y) > 2) {
      lines.push({ y: it.y, items: [it] });
    } else {
      last.items.push(it);
    }
  }

  // Cluster all X start positions across the document to discover column
  // boundaries. Histogram bucket width is the median item width — small
  // enough to distinguish neighbouring columns, large enough to absorb
  // small jitter between rows.
  const xs = items.map((i) => i.x).sort((a, b) => a - b);
  const widths = items.map((i) => i.width).filter((w) => w > 0).sort((a, b) => a - b);
  const bucketSize = Math.max(8, widths[Math.floor(widths.length / 2)] ?? 12);

  const columns: number[] = [];
  let prev = -Infinity;
  for (const x of xs) {
    if (x - prev > bucketSize) {
      columns.push(x);
      prev = x;
    }
  }
  // Cap absurdly wide tables — most real ones have <30 columns.
  if (columns.length > 30) columns.length = 30;

  const assignColumn = (x: number): number => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < columns.length; i++) {
      const d = Math.abs(columns[i] - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  const rows: string[][] = [];
  for (const line of lines) {
    const cells: string[] = new Array(columns.length).fill('');
    for (const it of line.items) {
      const col = assignColumn(it.x);
      cells[col] = cells[col] ? `${cells[col]} ${it.str}`.replace(/\s+/g, ' ').trim() : it.str.trim();
    }
    // Drop trailing empties so the row width matches actual content.
    while (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}
