import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FaqSection from '@/components/seo/FaqSection';
import { SeoContent } from '@/components/seo/SeoContent';
import RelatedTools from '@/components/tools/RelatedTools';
import RecentTools from '@/components/tools/RecentTools';
import CtaBlock from '@/components/seo/CtaBlock';
import ToolRenderer from '@/components/tools/ToolRenderer';
import ExampleOutput from '@/components/tools/ExampleOutput';
import MainLayout from '@/components/layout/MainLayout';
import { getToolBySlug, getRelatedTools, tools } from '@/lib/tools';
import { getCategoryById } from '@/lib/categories';
import { getPostsMentioningTool } from '@/lib/blog';
import {
  absoluteUrl,
  SITE_NAME,
  TWITTER_HANDLE,
  toolOgImage,
  trimMetaDescription,
} from '@/lib/site';
import { generateIntro, generateBenefits, generateHowToUse } from '@/lib/seo-templates';

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

  const pageTitle = tool.seoTitle || `${tool.name} - Free Online Tool`;
  const canonical = `/${tool.slug}`;
  const category = getCategoryById(tool.category);
  const ogImage = toolOgImage(tool.name, category?.name);

  const metaDescription = trimMetaDescription(tool.description);
  const socialDescription = trimMetaDescription(tool.shortDescription || tool.description);

  return {
    title: pageTitle,
    description: metaDescription,
    keywords: tool.keywords.join(', '),
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description: socialDescription,
      type: 'website',
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: socialDescription,
      site: TWITTER_HANDLE,
      images: [ogImage],
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryById(tool.category);
  const relatedTools = getRelatedTools(tool.id);

  // Breadcrumb component prepends "Home" automatically — don't add it here
  // or the JSON-LD ends up with duplicate position-1/2 entries.
  const breadcrumbItems = [
    { label: category?.name || 'Tools', href: category ? `/tools/${category.slug}` : '/tools' },
    { label: tool.name },
  ];

  const categoryAppMap: Record<string, string> = {
    dev: 'DeveloperApplication',
    text: 'UtilitiesApplication',
    image: 'MultimediaApplication',
    video: 'MultimediaApplication',
    color: 'DesignApplication',
    converter: 'UtilitiesApplication',
    office: 'BusinessApplication',
    misc: 'UtilitiesApplication',
  };

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(`/${tool.slug}`),
    applicationCategory: categoryAppMap[tool.category] || 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    inLanguage: 'en',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
  };

  // Blog posts that mention this tool — surfaced as "Related reading".
  const relatedPosts = getPostsMentioningTool(tool.slug);

  // Sidebar content with popular tools (same as home page)
  const popularTools = tools.slice(0, 8);
  const sidebarContent = (
    <div className="space-y-6">
      <RecentTools currentSlug={tool.slug} />
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Popular Tools</h3>
        <div className="space-y-2">
          {popularTools.map((popularTool) => (
            <a
              key={popularTool.id}
              href={`/${popularTool.slug}`}
              className="block text-sm text-gray-600 hover:text-blue-600 hover:underline py-1"
            >
              {popularTool.name}
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
      showMobileAnchor
      sidebarContent={sidebarContent}
    >
      <Breadcrumb items={breadcrumbItems} />

      {/* Tool Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{tool.seoTitle || tool.name}</h1>
      <p className="text-gray-600 mb-8">{tool.description}</p>

      {/* Tool Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <Suspense fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>}>
          <ToolRenderer slug={tool.slug} />
        </Suspense>

        {/* Example Output */}
        {tool.exampleOutput && (
          <ExampleOutput
            input={tool.exampleOutput.input}
            output={tool.exampleOutput.output}
            description={tool.exampleOutput.description}
            textClassName={tool.category === 'text' ? 'text-gray-100' : 'text-green-400'}
          />
        )}
      </div>

      {/* SEO Content — when tool.seoContent isn't provided, fall back to
          deterministic per-tool generators (varied across the 178 tools to
          avoid site-wide duplicate copy). */}
      <SeoContent.WhatIs name={tool.name} description={generateIntro(tool)} />

      <SeoContent.WhyUse benefits={generateBenefits(tool)} />

      <SeoContent.HowToUse steps={generateHowToUse(tool)} />

      {tool.seoContent?.examples?.length ? (
        <SeoContent.Examples examples={tool.seoContent.examples} />
      ) : null}

      {tool.seoContent?.useCases?.length ? (
        <SeoContent.UseCases items={tool.seoContent.useCases} />
      ) : null}

      {tool.seoContent?.troubleshooting?.length ? (
        <SeoContent.Troubleshooting items={tool.seoContent.troubleshooting} />
      ) : null}

      {/* FAQ Section */}
      {tool.faq && <FaqSection items={tool.faq} />}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <RelatedTools tools={relatedTools} title="Try these related tools" />
      )}

      {/* Related Reading — pulls blog posts that link to this tool. Builds
          the Tool ← Blog inbound link graph (better SEO + onward navigation). */}
      {relatedPosts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related reading</h2>
          <ul className="space-y-2">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <a
                  href={`/blog/${post.slug}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                >
                  <p className="font-semibold text-gray-900">{post.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA — explore more in the same category + all tools */}
      <CtaBlock
        title={`Explore more ${category?.name || 'tools'}`}
        description={`Discover other free, privacy-first tools in ${category?.name || 'our collection'}.`}
        links={[
          ...(category ? [{ label: `All ${category.name}`, href: `/tools/${category.slug}` }] : []),
          { label: 'Browse all tools', href: '/tools' },
        ]}
      />
    </MainLayout>
  );
}
