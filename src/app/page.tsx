import Link from 'next/link';
import { Code, FileText, Image, Youtube, Palette, ArrowLeftRight, Wrench, Zap, Shield, Globe } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import ToolGrid from '@/components/tools/ToolGrid';
import MainLayout from '@/components/layout/MainLayout';
import { tools } from '@/lib/tools';
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

const features = [
  {
    icon: Zap,
    title: 'Fast & Free',
    description: 'All tools run instantly in your browser at no cost.',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: Shield,
    title: '100% Private',
    description: 'Your data never leaves your browser. Completely client-side.',
    bgColor: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'No installation needed. Works on any device with a browser.',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

export default function HomePage() {
  const popularTools = tools.slice(0, 8);

  return (
    <MainLayout showTopBanner showBottomBanner>
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Free Online Tools
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          100+ free tools for developers, designers, and everyone. Fast, private, and works in your browser.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <SearchBar placeholder="Search for tools..." className="w-full" />
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center gap-8 text-sm text-gray-500">
          <span>{tools.length}+ Tools</span>
          <span>{categories.length} Categories</span>
          <span>100% Free</span>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
          >
            <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Popular Tools */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Tools</h2>
          <Link
            href="/tools"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            View all tools
            <ArrowLeftRight className="w-4 h-4" />
          </Link>
        </div>
        <ToolGrid tools={popularTools} columns={4} />
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <Link
                key={category.id}
                href={`/tools/${category.slug}`}
                className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="p-3 bg-blue-50 rounded-lg">
                  {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.toolCount} tools</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About Love Web Tools
        </h2>
        <p className="text-gray-600 mb-4">
          Love Web Tools is a collection of free online tools designed to help developers, designers, and everyday users
          accomplish common tasks quickly and easily. Our tools run entirely in your browser, ensuring your data
          stays private and secure.
        </p>
        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
          Why Choose Love Web Tools?
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li><strong>100% Free:</strong> All tools are completely free to use with no hidden costs.</li>
          <li><strong>Privacy First:</strong> Your data never leaves your browser. Everything is processed locally.</li>
          <li><strong>No Registration:</strong> Start using tools immediately without creating an account.</li>
          <li><strong>Mobile Friendly:</strong> Works perfectly on desktop, tablet, and mobile devices.</li>
          <li><strong>Regular Updates:</strong> New tools are added regularly based on user feedback.</li>
        </ul>
      </section>
    </MainLayout>
  );
}
