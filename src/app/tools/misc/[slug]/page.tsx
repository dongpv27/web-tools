import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FaqSection from '@/components/seo/FaqSection';
import { SeoContent } from '@/components/seo/SeoContent';
import RelatedTools from '@/components/tools/RelatedTools';
import ToolRenderer from '@/components/tools/ToolRenderer';
import { getToolBySlug, getRelatedTools, tools } from '@/lib/tools';
import { getCategoryBySlug } from '@/lib/categories';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools
    .filter((tool) => tool.category === 'misc')
    .map((tool) => ({
      slug: tool.slug,
    }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  return {
    title: `${tool.name} - Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    openGraph: {
      title: `${tool.name} - Free Online Tool`,
      description: tool.shortDescription,
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryBySlug(tool.category);
  const relatedTools = getRelatedTools(tool.id);

  const breadcrumbItems = [
    { label: 'Tools', href: '/tools' },
    { label: category?.name || 'Miscellaneous', href: `/tools/${tool.category}` },
    { label: tool.name },
  ];

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{tool.name}</h1>
      <p className="text-gray-600 mb-8">{tool.description}</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <ToolRenderer slug={tool.slug} />
      </div>

      <SeoContent.WhatIs
        name={tool.name}
        description={`${tool.name} is a free online tool that ${tool.shortDescription.toLowerCase()}. This tool processes your data entirely in your browser, ensuring your privacy and security. No data is ever sent to any server.`}
      />

      <SeoContent.WhyUse
        benefits={[
          '100% free with no hidden costs or limitations',
          'Your data stays private - all processing happens in your browser',
          'No registration or installation required',
          'Works on any device - desktop, tablet, or mobile',
          'Fast and instant results',
        ]}
      />

      <SeoContent.HowToUse
        steps={tool.howToUse || [
          'Enter your input',
          'Click the action button',
          'View the result',
        ]}
      />

      {tool.faq && <FaqSection items={tool.faq} />}
      <RelatedTools tools={relatedTools} />
    </div>
  );
}
