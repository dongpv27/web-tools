import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Code, FileText, Image, Youtube, Palette, ArrowLeftRight, Wrench, FileSpreadsheet } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FaqSection from '@/components/seo/FaqSection';
import ToolGrid from '@/components/tools/ToolGrid';
import { getToolsByCategory } from '@/lib/tools';
import { categories, getCategoryBySlug } from '@/lib/categories';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Image,
  Youtube,
  Palette,
  ArrowLeftRight,
  Wrench,
  FileSpreadsheet,
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

  return {
    title: `${category.name} - Free Online Tools`,
    description: category.description,
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

  const categoryFaqs = [
    {
      question: `What are ${category.name.toLowerCase()}?`,
      answer: `${category.name} are online tools designed to help you with ${category.description.toLowerCase()}. All tools are free and run entirely in your browser.`,
    },
    {
      question: `Are these ${category.name.toLowerCase()} free to use?`,
      answer: `Yes, all ${category.name.toLowerCase()} on WebTools are completely free to use with no hidden costs or limitations.`,
    },
    {
      question: `Is my data safe when using these tools?`,
      answer: 'Absolutely! All processing happens in your browser. Your data is never sent to any server, ensuring complete privacy and security.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          {Icon && <Icon className="w-8 h-8 text-blue-600" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600">{category.toolCount} tools available</p>
        </div>
      </div>

      <p className="text-gray-600 mb-8 max-w-3xl">
        {category.description}
      </p>

      {/* Tools Grid */}
      {categoryTools.length > 0 ? (
        <ToolGrid tools={categoryTools} columns={3} />
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-4">No tools available in this category yet.</p>
          <p className="text-sm text-gray-400">Check back soon for new tools!</p>
        </div>
      )}

      {/* FAQ Section */}
      <FaqSection items={categoryFaqs} />
    </div>
  );
}
