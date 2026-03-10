import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FaqSection from '@/components/seo/FaqSection';
import { SeoContent } from '@/components/seo/SeoContent';
import RelatedTools from '@/components/tools/RelatedTools';
import ToolRenderer from '@/components/tools/ToolRenderer';
import MainLayout from '@/components/layout/MainLayout';
import { getToolBySlug, getRelatedTools, tools } from '@/lib/tools';
import { getCategoryBySlug } from '@/lib/categories';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
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
    { label: 'Home', href: '/' },
    { label: category?.name || 'Tools', href: `/tools/${tool.category}` },
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

  // Sidebar content with related tools
  const sidebarContent = (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Related Tools</h3>
        <div className="space-y-3">
          {relatedTools.slice(0, 5).map((relatedTool) => (
            <a
              key={relatedTool.id}
              href={`/${relatedTool.slug}`}
              className="block text-sm text-gray-600 hover:text-blue-600 hover:underline"
            >
              {relatedTool.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout
      showSidebar
      showTopBanner
      showBottomBanner
      sidebarContent={sidebarContent}
    >
      <Breadcrumb items={breadcrumbItems} />

      {/* Tool Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{tool.name}</h1>
      <p className="text-gray-600 mb-8">{tool.description}</p>

      {/* Tool Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>}>
          <ToolRenderer slug={tool.slug} />
        </Suspense>
      </div>

      {/* SEO Content */}
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
          `Enter your input in the ${tool.name.toLowerCase()} above`,
          'Click the action button to process',
          'View the result in the output area',
          'Use the copy button to copy the result to your clipboard',
        ]}
      />

      {/* FAQ Section */}
      {tool.faq && <FaqSection items={tool.faq} />}

      {/* Related Tools - Full width at bottom */}
      <div className="lg:hidden">
        <RelatedTools tools={relatedTools} />
      </div>
    </MainLayout>
  );
}
