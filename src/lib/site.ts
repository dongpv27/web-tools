// Site URL resolution order:
//   1. NEXT_PUBLIC_SITE_URL  — explicit per-environment override
//   2. VERCEL_PROJECT_PRODUCTION_URL — set by Vercel for the prod alias
//   3. VERCEL_URL — preview/branch deployments
//   4. Hard-coded production fallback (used in `next dev`)
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const prodUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prodUrl) return `https://${prodUrl.replace(/\/+$/, '')}`;
  const previewUrl = process.env.VERCEL_URL;
  if (previewUrl) return `https://${previewUrl.replace(/\/+$/, '')}`;
  return 'https://lovewebtools.com';
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = 'Love Web Tools';
export const SITE_DESCRIPTION =
  'Free online tools for developers, designers, and everyone. JSON formatter, Base64 encoder, image/video/PDF utilities, and 100+ more — all client-side.';
export const SITE_OG_IMAGE = `${SITE_URL}/og`;
export const TWITTER_HANDLE = '@lovewebtools';

export function absoluteUrl(path: string = '/'): string {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

export function toolOgImage(title: string, category?: string): string {
  const params = new URLSearchParams({ title });
  if (category) params.set('category', category);
  return `${SITE_URL}/og?${params.toString()}`;
}

// Trim a string for use in <meta name="description">. Google typically
// truncates around 155–160 chars in SERP, so descriptions longer than that
// lose their CTA tail. Prefer cutting at a sentence/word boundary above 110
// chars to keep the snippet readable; otherwise hard-cut with an ellipsis.
export function trimMetaDescription(input: string, max = 160): string {
  const s = input.trim().replace(/\s+/g, ' ');
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSentence = Math.max(
    cut.lastIndexOf('. '),
    cut.lastIndexOf('! '),
    cut.lastIndexOf('? '),
  );
  if (lastSentence > 110) return s.slice(0, lastSentence + 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 110 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
