import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have
          been moved, renamed, or never existed on {SITE_NAME}.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/tools"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse all tools
          </Link>
        </div>
      </div>
    </div>
  );
}
