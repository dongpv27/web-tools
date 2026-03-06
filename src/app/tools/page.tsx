import { Metadata } from 'next';
import { Code, FileText, Image, Youtube, Palette, ArrowLeftRight, Wrench } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ToolGrid from '@/components/tools/ToolGrid';
import { tools, searchTools } from '@/lib/tools';
import { categories } from '@/lib/categories';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Image,
  Youtube,
  Palette,
  ArrowLeftRight,
  Wrench,
};

export const metadata: Metadata = {
  title: 'All Tools',
  description: 'Browse all free online tools. JSON formatter, Base64 encoder, color picker, and more.',
};

interface ToolsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search || '';
  const filteredTools = searchQuery ? searchTools(searchQuery) : tools;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'All Tools', href: '/tools' }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Tools'}
      </h1>

      <p className="text-gray-600 mb-8">
        {searchQuery
          ? `Found ${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''} matching your search.`
          : `Browse our collection of ${tools.length}+ free online tools.`}
      </p>

      {/* Categories Quick Links */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <a
                key={category.id}
                href={`/tools/${category.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {category.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <ToolGrid tools={filteredTools} columns={3} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tools found matching your search.</p>
          <a
            href="/tools"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all tools
          </a>
        </div>
      )}
    </div>
  );
}
