import { Code, FileText, Image, Palette, ArrowLeftRight, Wrench, FileSpreadsheet, Video } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  toolCount: number;
}

export const categories: Category[] = [
  {
    id: 'dev',
    name: 'Developer Tools',
    description: 'Tools for developers: JSON, Base64, encoding, and more',
    icon: 'Code',
    slug: 'developer-tools',
    toolCount: 35,
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Text manipulation, formatting, and conversion tools',
    icon: 'FileText',
    slug: 'text',
    toolCount: 24,
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Image conversion, resizing, and optimization tools',
    icon: 'Image',
    slug: 'image',
    toolCount: 28,
  },
  {
    id: 'video',
    name: 'Video Tools',
    description: 'Free online video editing tools. Convert, compress, trim, and edit videos directly in your browser.',
    icon: 'Video',
    slug: 'video-tools',
    toolCount: 21,
  },
  {
    id: 'color',
    name: 'Color Tools',
    description: 'Color pickers, converters, and palette generators',
    icon: 'Palette',
    slug: 'color',
    toolCount: 13,
  },
  {
    id: 'converter',
    name: 'Converters',
    description: 'Unit converters, number converters, and more',
    icon: 'ArrowLeftRight',
    slug: 'converter',
    toolCount: 17,
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    description: 'Other useful tools and utilities',
    icon: 'Wrench',
    slug: 'misc',
    toolCount: 13,
  },
  {
    id: 'office',
    name: 'Office Tools',
    description: 'Word, Excel, PowerPoint, and PDF tools for document processing',
    icon: 'FileSpreadsheet',
    slug: 'office',
    toolCount: 27,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Image,
  Palette,
  ArrowLeftRight,
  Wrench,
  FileSpreadsheet,
  Video,
};
