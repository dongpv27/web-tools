/**
 * Client-side helper for POSTing a file to one of the /api/convert/* routes.
 * Returns a Blob + filename suggested by the server's Content-Disposition,
 * or throws an Error with the server-provided message.
 */
export interface ConvertResult {
  blob: Blob;
  filename: string;
  mimeType: string;
}

export interface ConvertOptions {
  /** Extra string fields to send alongside the file (form fields). */
  fields?: Record<string, string | number | boolean>;
  /** Custom file form-field name (default: "file"). */
  fileFieldName?: string;
  /** Abort signal for cancellation. */
  signal?: AbortSignal;
}

const parseContentDispositionFilename = (header: string | null, fallback: string): string => {
  if (!header) return fallback;
  // RFC 5987: filename*=UTF-8''encoded
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star) {
    try {
      return decodeURIComponent(star[1]);
    } catch {
      // fall through
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain ? plain[1] : fallback;
};

export async function callConvert(
  endpoint: string,
  file: File | Blob,
  fileName: string,
  opts: ConvertOptions = {},
): Promise<ConvertResult> {
  const form = new FormData();
  const fieldName = opts.fileFieldName ?? 'file';
  form.append(fieldName, file, fileName);
  if (opts.fields) {
    for (const [k, v] of Object.entries(opts.fields)) {
      form.append(k, String(v));
    }
  }

  const res = await fetch(`/api/convert/${endpoint}`, {
    method: 'POST',
    body: form,
    signal: opts.signal,
  });

  const contentType = res.headers.get('content-type') ?? '';

  if (!res.ok) {
    // Server replies JSON for known errors; fall back to text for unexpected.
    if (contentType.includes('application/json')) {
      const data: { error?: string } = await res.json().catch(() => ({}));
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed (${res.status})`);
  }

  const blob = await res.blob();
  const filename = parseContentDispositionFilename(
    res.headers.get('content-disposition'),
    fileName,
  );
  return { blob, filename, mimeType: contentType || blob.type };
}

/**
 * Multi-file variant — used by merge-* endpoints that take N files under the
 * same field name (default "files"). Returns the merged Blob + filename.
 */
export async function callConvertMulti(
  endpoint: string,
  files: { file: File | Blob; name: string }[],
  opts: ConvertOptions = {},
): Promise<ConvertResult> {
  const form = new FormData();
  const fieldName = opts.fileFieldName ?? 'files';
  for (const f of files) form.append(fieldName, f.file, f.name);
  if (opts.fields) {
    for (const [k, v] of Object.entries(opts.fields)) {
      form.append(k, String(v));
    }
  }

  const res = await fetch(`/api/convert/${endpoint}`, {
    method: 'POST',
    body: form,
    signal: opts.signal,
  });

  const contentType = res.headers.get('content-type') ?? '';
  if (!res.ok) {
    if (contentType.includes('application/json')) {
      const data: { error?: string } = await res.json().catch(() => ({}));
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed (${res.status})`);
  }

  const blob = await res.blob();
  const filename = parseContentDispositionFilename(
    res.headers.get('content-disposition'),
    'merged',
  );
  return { blob, filename, mimeType: contentType || blob.type };
}

/** Trigger a browser download for a Blob without leaking the object URL. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
