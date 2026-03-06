'use client';

import { toolComponentMap } from './ToolLoader';

interface ToolRendererProps {
  slug: string;
}

export default function ToolRenderer({ slug }: ToolRendererProps) {
  const ToolComponent = toolComponentMap[slug];

  if (!ToolComponent) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-yellow-800">Tool &quot;{slug}&quot; is coming soon!</p>
        <p className="text-sm text-yellow-600 mt-2">This tool is currently being developed.</p>
      </div>
    );
  }

  return (
    <div className="tool-container">
      <ToolComponent />
    </div>
  );
}
