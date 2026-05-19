import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';

interface ToolScreenshotProps {
  slug: string;
  alt: string;
  /** Aspect ratio class — default 16:10. */
  className?: string;
  /** Set `priority` if this is above the fold (LCP candidate). */
  priority?: boolean;
}

// Build-time check: only render the screenshot block when the file actually
// exists on disk in /public/screenshots/<slug>.png. Avoids broken images for
// tools we haven't captured yet, and avoids a separate registry list.
function screenshotExists(slug: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'public', 'screenshots', `${slug}.png`);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

export default function ToolScreenshot({
  slug,
  alt,
  className = 'aspect-[16/10]',
  priority = false,
}: ToolScreenshotProps) {
  if (!screenshotExists(slug)) return null;

  return (
    <figure className="mb-8">
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm ${className}`}
      >
        <Image
          src={`/screenshots/${slug}.png`}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover object-top"
          priority={priority}
        />
      </div>
      <figcaption className="sr-only">Screenshot of {alt}</figcaption>
    </figure>
  );
}
