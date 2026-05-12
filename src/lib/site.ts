export const SITE_URL = 'https://lovewebtools.com';
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
