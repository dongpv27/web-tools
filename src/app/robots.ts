import type { MetadataRoute } from 'next';
import { SITE_URL, IS_INDEXABLE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Non-production (`*.vercel.app`) deployments: block all crawling so the
  // preview/no-domain URLs never get indexed.
  if (!IS_INDEXABLE) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
