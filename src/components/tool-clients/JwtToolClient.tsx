'use client';

import JwtEncoderTab from './JwtEncoderTab';
import JwtDecoderTab from './JwtDecoderTab';

export type Algorithm = 'HS256' | 'RS256' | 'ES256';

interface JwtToolClientProps {
  slug?: string;
}

export default function JwtToolClient({ slug }: JwtToolClientProps) {
  // Render the appropriate component based on slug
  // Each tool is now independent without shared state
  if (slug === 'jwt-decoder') {
    return <JwtDecoderTab slug={slug} />;
  }

  // Default to encoder for jwt-encoder or any other slug
  return <JwtEncoderTab slug={slug} />;
}
