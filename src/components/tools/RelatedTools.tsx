import ToolCard from './ToolCard';
import { Tool } from '@/lib/tools';

interface RelatedToolsProps {
  tools: Tool[];
  title?: string;
}

export default function RelatedTools({ tools, title = 'Related Tools' }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            name={tool.name}
            description={tool.shortDescription}
            category={tool.category}
            slug={tool.slug}
            icon={tool.icon}
          />
        ))}
      </div>
    </section>
  );
}
