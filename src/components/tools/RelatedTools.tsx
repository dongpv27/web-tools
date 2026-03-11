import Link from 'next/link';
import { Tool } from '@/lib/tools';
import { ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  tools: Tool[];
  title?: string;
}

export default function RelatedTools({ tools, title = 'Related Tools' }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  // Limit to 4 tools max
  const displayTools = tools.slice(0, 4);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {displayTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/${tool.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
          >
            <span className="font-medium text-gray-800 group-hover:text-blue-600 whitespace-nowrap">
              {tool.name}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
