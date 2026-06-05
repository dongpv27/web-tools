import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Code, FileText, Image, Palette, ArrowLeftRight, Wrench, FileSpreadsheet, Video } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FaqSection from '@/components/seo/FaqSection';
import ToolGrid from '@/components/tools/ToolGrid';
import MainLayout from '@/components/layout/MainLayout';
import CtaBlock from '@/components/seo/CtaBlock';
import { getToolsByCategory } from '@/lib/tools';
import { categories, getCategoryBySlug } from '@/lib/categories';
import {
  absoluteUrl,
  SITE_NAME,
  TWITTER_HANDLE,
  toolOgImage,
  trimMetaDescription,
} from '@/lib/site';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Image,
  Palette,
  ArrowLeftRight,
  Wrench,
  FileSpreadsheet,
  Video,
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.category);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const canonical = `/tools/${category.slug}`;
  const title = `${category.name} - Free Online Tools`;
  const ogImage = toolOgImage(category.name, 'Category');

  const metaDescription = trimMetaDescription(category.description);

  return {
    title,
    description: metaDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: metaDescription,
      type: 'website',
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: category.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      site: TWITTER_HANDLE,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.category);

  if (!category) {
    notFound();
  }

  const categoryTools = getToolsByCategory(category.id);
  const Icon = iconMap[category.icon];

  const breadcrumbItems = [
    { label: 'Tools', href: '/tools' },
    { label: category.name },
  ];

  const featuredTools = categoryTools.slice(0, 4);
  const categoryLow = category.name.toLowerCase();

  const categoryFaqs = [
    {
      question: `What are ${categoryLow}?`,
      answer: `${category.name} are online tools designed to help you with ${category.description.toLowerCase()} All tools are free and run entirely in your browser, so your data never leaves your device.`,
    },
    {
      question: `Are these ${categoryLow} free to use?`,
      answer: `Yes, every tool in our ${categoryLow} collection is completely free with no signup, no hidden costs, and no usage limits.`,
    },
    {
      question: `Is my data safe when using these tools?`,
      answer: 'All processing happens locally in your browser. We do not upload, store, or transmit any of your input — there are no servers involved in the actual processing.',
    },
    {
      question: `Do I need to install anything?`,
      answer: `No installation required. Open the tool in any modern browser on desktop or mobile and start using it instantly.`,
    },
    {
      question: `Can I use these ${categoryLow} on mobile?`,
      answer: 'Yes — every tool is responsive and works on phones and tablets in addition to desktop browsers.',
    },
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.name,
    description: category.description,
    numberOfItems: categoryTools.length,
    itemListElement: categoryTools.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/${t.slug}`),
      name: t.name,
      description: t.shortDescription,
    })),
  };

  return (
    <MainLayout showTopBanner showMobileAnchor>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-cyan-50 rounded-xl">
          {Icon && <Icon className="w-8 h-8 text-cyan-600" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600">{category.toolCount} tools available</p>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        {category.description}
      </p>

      {/* Long-form intro (200+ words, SEO depth + visitor context).
          Same container width as the short description above — rows stack
          full width within the page's max-w-7xl container. */}
      <section className="text-sm text-gray-600 leading-relaxed space-y-4 mb-8">
        {category.longDescription.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      {/* Featured tools */}
      {featuredTools.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured in {category.name}</h2>
          <ToolGrid tools={featuredTools} columns={4} />
        </section>
      )}

      {/* All tools in category */}
      {categoryTools.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All {category.name}</h2>
          <ToolGrid tools={categoryTools} columns={3} />
        </section>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-4">No tools available in this category yet.</p>
          <p className="text-sm text-gray-400">Check back soon for new tools!</p>
        </div>
      )}

      {/* FAQ Section */}
      <FaqSection items={categoryFaqs} />

      {/* CTA */}
      <CtaBlock
        title="Looking for something else?"
        description="Browse the full library or pick another category."
        links={[
          { label: 'All tools', href: '/tools' },
          { label: 'Homepage', href: '/' },
        ]}
      />
    </MainLayout>
  );
}
