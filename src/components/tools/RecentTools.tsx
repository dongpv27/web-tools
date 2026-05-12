'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { useRecentTools } from '@/lib/analytics';
import { getToolBySlug } from '@/lib/tools';

interface RecentToolsProps {
  /** Slug of the current tool — added to recents on mount. */
  currentSlug?: string;
  /** Optional UI title. */
  title?: string;
  /** Render mode: 'sidebar' for vertical, 'inline' for horizontal pills. */
  variant?: 'sidebar' | 'inline';
}

export default function RecentTools({
  currentSlug,
  title = 'Recently Used',
  variant = 'sidebar',
}: RecentToolsProps) {
  const slugs = useRecentTools(currentSlug);
  const items = slugs
    .filter((s) => s !== currentSlug)
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<ReturnType<typeof getToolBySlug>> => !!t)
    .slice(0, variant === 'inline' ? 8 : 6);

  if (items.length === 0) return null;

  if (variant === 'inline') {
    return (
      <section className="mb-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Clock className="w-4 h-4" /> {title}
        </h2>
        <div className="flex flex-wrap gap-2">
          {items.map((t) => (
            <Link
              key={t.id}
              href={`/${t.slug}`}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:border-blue-400 hover:text-blue-700"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
        <Clock className="w-4 h-4 text-gray-500" /> {title}
      </h3>
      <div className="space-y-2">
        {items.map((t) => (
          <Link
            key={t.id}
            href={`/${t.slug}`}
            className="block text-sm text-gray-600 hover:text-blue-600 hover:underline py-1"
          >
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
