import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode "Compiling..." / build indicator badge in the bottom-left.
  // Has no effect on production builds (next build + next start).
  devIndicators: false,

  // Keep these Node-only libraries out of the server bundle so they load from
  // node_modules at runtime. Bundling pdfjs-dist breaks its worker resolution
  // because Turbopack rewrites import.meta.url to "[project]/..." which is
  // not a real path. The other packages here have similar issues (font/binary
  // resources resolved relative to their package root).
  serverExternalPackages: ['pdfjs-dist', 'mammoth', 'docx', 'pptxgenjs', 'pdf-lib'],
};

export default nextConfig;
