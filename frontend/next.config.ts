import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep file tracing inside this app; the parent directory contains another lockfile.
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
