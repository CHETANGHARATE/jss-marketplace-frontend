import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Build-time environment variable defaults.
   * These values are baked into the production bundle during `next build`.
   * They act as a guaranteed fallback even when Vercel dashboard env vars
   * are absent or misconfigured.
   *
   * Priority (highest → lowest):
   *   1. Vercel Dashboard "Environment Variables" (overrides this config)
   *   2. .env.local (local development only — not committed to git)
   *   3. These next.config.ts defaults (production-safe fallback)
   */
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.jsssolutions.in/api/v1",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "https://jss-marketplace.vercel.app",
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'api.jsssolutions.in' },
      { protocol: 'https', hostname: 'jsssolutions.in' },
      { protocol: 'https', hostname: '**.jsssolutions.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

export default nextConfig;
