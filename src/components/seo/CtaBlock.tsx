import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface CtaLink {
  label: string;
  href: string;
}

interface CtaBlockProps {
  title: string;
  description?: string;
  links: CtaLink[];
  /** Optional override of the icon shown next to the title. Defaults to <Sparkles />. */
  icon?: React.ReactNode;
}

export default function CtaBlock({ title, description, links, icon }: CtaBlockProps) {
  if (links.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-full bg-blue-100 p-2 text-blue-600">
          {icon ?? <Sparkles className="w-5 h-5" />}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {description && (
        <p className="text-gray-600 mb-5 max-w-2xl">{description}</p>
      )}
      <div className="flex flex-wrap gap-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm font-medium text-gray-800"
          >
            {l.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ))}
      </div>
    </section>
  );
}
