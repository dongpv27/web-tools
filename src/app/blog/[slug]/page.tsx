import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import MainLayout from '@/components/layout/MainLayout';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { absoluteUrl, SITE_NAME, TWITTER_HANDLE, toolOgImage } from '@/lib/site';

// Minimal markdown subset: ## H2, blank-line paragraphs, "- " bullets,
// inline **bold** and [text](href). Anything more elaborate should switch
// to react-markdown or MDX.
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split by markdown link first, then process bold inside each segment.
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > lastIdx) nodes.push(renderBold(text.slice(lastIdx, m.index), `${keyPrefix}-t${i++}`));
    nodes.push(
      <Link key={`${keyPrefix}-l${i++}`} href={m[2]} className="text-blue-600 hover:underline">
        {m[1]}
      </Link>,
    );
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) nodes.push(renderBold(text.slice(lastIdx), `${keyPrefix}-t${i++}`));
  return nodes;
}

function renderBold(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span key={keyPrefix}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p,
      )}
    </span>
  );
}

function renderMarkdown(src: string): React.ReactNode {
  const blocks = src.split(/\n{2,}/);
  return blocks.map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="mt-8 mb-3 text-2xl font-bold text-gray-900">
          {renderInline(block.slice(3).trim(), `h${i}`)}
        </h2>
      );
    }
    if (/^(- |\d+\. )/.test(block.split('\n')[0])) {
      const ordered = /^\d+\. /.test(block.split('\n')[0]);
      const items = block.split('\n').map((line) => line.replace(/^(- |\d+\. )/, ''));
      const ListTag = ordered ? 'ol' : 'ul';
      return (
        <ListTag
          key={i}
          className={`my-4 ${ordered ? 'list-decimal' : 'list-disc'} list-inside space-y-1 text-gray-700`}
        >
          {items.map((it, j) => (
            <li key={j}>{renderInline(it, `li${i}-${j}`)}</li>
          ))}
        </ListTag>
      );
    }
    return (
      <p key={i} className="my-4 text-gray-700 leading-relaxed">
        {renderInline(block, `p${i}`)}
      </p>
    );
  });
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  const canonical = `/blog/${post.slug}`;
  const ogImage = toolOgImage(post.title, 'Blog');

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      site: TWITTER_HANDLE,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <MainLayout showTopBanner showMobileAnchor>
      <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500">
            <time dateTime={post.date}>{post.date}</time>
            {post.readingTime ? ` · ${post.readingTime} min read` : ''}
          </p>
        </header>
        <div className="prose prose-gray max-w-none">
          {post.body ? renderMarkdown(post.body) : (
            <p className="text-gray-500">Content coming soon.</p>
          )}
        </div>
      </article>
    </MainLayout>
  );
}
