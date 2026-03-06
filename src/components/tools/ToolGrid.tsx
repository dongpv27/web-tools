import ToolCard from './ToolCard';
import { Tool } from '@/lib/tools';

interface ToolGridProps {
  tools: Tool[];
  columns?: 2 | 3 | 4;
}

export default function ToolGrid({ tools, columns = 3 }: ToolGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols[columns]}`}>
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
  );
}
