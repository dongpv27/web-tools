import { NextResponse } from 'next/server';

/**
 * Build a binary file download response. Browsers will trigger a Save dialog
 * when Content-Disposition is set to attachment. Length helps progress UI.
 */
export function fileResponse(
  bytes: Buffer | Uint8Array,
  filename: string,
  mimeType: string,
): NextResponse {
  // Sanitise filename for the Content-Disposition header — both RFC 5987 (UTF-8
  // friendly) and a plain ASCII fallback so legacy clients don't barf.
  const asciiName = filename.replace(/[^\w.\-]+/g, '_');
  const encodedName = encodeURIComponent(filename);

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Content-Length': String(bytes.length),
      'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
      'Cache-Control': 'no-store',
    },
  });
}

/** Convenience for tools that fail mid-pipeline with a user-actionable message. */
export function errorResponse(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Wrap a route body with consistent error handling + logging. */
export async function tryConvert<T>(
  label: string,
  body: () => Promise<T>,
): Promise<T | NextResponse> {
  try {
    return await body();
  } catch (err) {
    console.error(`[api/convert/${label}]`, err);
    const message = err instanceof Error ? err.message : 'Conversion failed.';
    return errorResponse(message, 500);
  }
}
