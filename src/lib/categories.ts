import { Code, FileText, Image, Youtube, Palette, ArrowLeftRight, Wrench } from 'lucide-react';

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
    slug: 'dev',
    toolCount: 15,
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Text manipulation, formatting, and conversion tools',
    icon: 'FileText',
    slug: 'text',
    toolCount: 12,
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Image conversion, resizing, and optimization tools',
    icon: 'Image',
    slug: 'image',
    toolCount: 10,
  },
  {
    id: 'youtube',
    name: 'YouTube Tools',
    description: 'YouTube thumbnail downloader, video tools, and more',
    icon: 'Youtube',
    slug: 'youtube',
    toolCount: 5,
  },
  {
    id: 'color',
    name: 'Color Tools',
    description: 'Color pickers, converters, and palette generators',
    icon: 'Palette',
    slug: 'color',
    toolCount: 8,
  },
  {
    id: 'converter',
    name: 'Converters',
    description: 'Unit converters, number converters, and more',
    icon: 'ArrowLeftRight',
    slug: 'converter',
    toolCount: 15,
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    description: 'Other useful tools and utilities',
    icon: 'Wrench',
    slug: 'misc',
    toolCount: 10,
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
  Youtube,
  Palette,
  ArrowLeftRight,
  Wrench,
};
