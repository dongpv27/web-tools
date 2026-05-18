import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode "Compiling..." / build indicator badge in the bottom-left.
  // Has no effect on production builds (next build + next start).
  devIndicators: false,
};

export default nextConfig;
