import { NextRequest, NextResponse } from 'next/server';

// Vercel Hobby allows 4.5MB request body by default; Pro raises to 50MB.
// We enforce 25MB here so the same code runs on either plan and surfaces a
// clear error before the runtime kills the request without a useful message.
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export interface UploadedFile {
  /** Original client-side file name */
  filename: string;
  /** MIME type as reported by the browser; trust loosely. */
  mimeType: string;
  /** Raw file bytes */
  bytes: Buffer;
}

export interface ParsedUpload {
  file: UploadedFile;
  /** Any extra string fields submitted with the file (e.g. options). */
  fields: Record<string, string>;
}

export interface ParseOptions {
  /** Form field name that carries the file (default: "file"). */
  fieldName?: string;
  /** Override the global limit for one route. */
  maxBytes?: number;
}

/**
 * Read a multipart/form-data request and pull out the single uploaded file
 * plus any other string fields. Returns a NextResponse on validation failure
 * so route handlers can `return result instanceof NextResponse ? result : ...`.
 */
export async function parseUpload(
  req: NextRequest,
  opts: ParseOptions = {},
): Promise<ParsedUpload | NextResponse> {
  const { fieldName = 'file', maxBytes = MAX_UPLOAD_BYTES } = opts;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid form data. Send the file as multipart/form-data.' },
      { status: 400 },
    );
  }

  const raw = formData.get(fieldName);
  if (!raw || !(raw instanceof File)) {
    return NextResponse.json(
      { error: `Missing file field "${fieldName}".` },
      { status: 400 },
    );
  }

  if (raw.size === 0) {
    return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
  }
  if (raw.size > maxBytes) {
    return NextResponse.json(
      {
        error: `File too large. Max ${Math.round(maxBytes / 1024 / 1024)} MB.`,
      },
      { status: 413 },
    );
  }

  const arrayBuffer = await raw.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);

  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key === fieldName) continue;
    if (typeof value === 'string') fields[key] = value;
  }

  return {
    file: {
      filename: raw.name || 'upload',
      mimeType: raw.type || 'application/octet-stream',
      bytes,
    },
    fields,
  };
}

/** Strip the original extension and append a new one. */
export function rename(filename: string, newExt: string): string {
  const base = filename.replace(/\.[^/.]+$/, '');
  return `${base}.${newExt.replace(/^\./, '')}`;
}

export interface ParsedMultiUpload {
  files: UploadedFile[];
  fields: Record<string, string>;
}

/**
 * Variant of parseUpload that accepts N files under the same field name
 * (browsers send these as repeated entries when using <input multiple>).
 * Enforces a per-batch total cap so a merge of 100 files doesn't OOM.
 */
export async function parseMultipleUploads(
  req: NextRequest,
  opts: { fieldName?: string; maxBytesTotal?: number; minFiles?: number } = {},
): Promise<ParsedMultiUpload | NextResponse> {
  const {
    fieldName = 'files',
    maxBytesTotal = MAX_UPLOAD_BYTES,
    minFiles = 2,
  } = opts;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid form data. Send files as multipart/form-data.' },
      { status: 400 },
    );
  }

  const rawFiles = formData.getAll(fieldName).filter((v): v is File => v instanceof File);
  if (rawFiles.length < minFiles) {
    return NextResponse.json(
      { error: `Please provide at least ${minFiles} files.` },
      { status: 400 },
    );
  }

  const total = rawFiles.reduce((sum, f) => sum + f.size, 0);
  if (total > maxBytesTotal) {
    return NextResponse.json(
      {
        error: `Combined file size too large. Max ${Math.round(maxBytesTotal / 1024 / 1024)} MB across all files.`,
      },
      { status: 413 },
    );
  }

  const files: UploadedFile[] = [];
  for (const f of rawFiles) {
    if (f.size === 0) continue;
    const ab = await f.arrayBuffer();
    files.push({
      filename: f.name || 'upload',
      mimeType: f.type || 'application/octet-stream',
      bytes: Buffer.from(ab),
    });
  }

  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key === fieldName) continue;
    if (typeof value === 'string') fields[key] = value;
  }

  return { files, fields };
}
