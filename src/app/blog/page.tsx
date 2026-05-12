import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import MainLayout from '@/components/layout/MainLayout';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Love Web Tools',
  description: 'Tutorials, comparisons, and developer guides about online tools and web utilities.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog - Love Web Tools',
    description: 'Tutorials, comparisons, and developer guides about online tools and web utilities.',
    type: 'website',
    url: '/blog',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <MainLayout showTopBanner showMobileAnchor>
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Blog</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Tutorials, comparisons, and behind-the-scenes guides on building with our free online tools.
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-2">No posts yet.</p>
          <p className="text-sm text-gray-400">Check back soon — we&apos;re working on the first batch.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {posts.map((p) => (
            <li key={p.slug} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <Link href={`/blog/${p.slug}`} className="block">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{p.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  <time dateTime={p.date}>{p.date}</time>
                  {p.readingTime ? ` · ${p.readingTime} min read` : ''}
                </p>
                <p className="text-gray-600">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </MainLayout>
  );
}
