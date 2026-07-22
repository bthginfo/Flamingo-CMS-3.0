/** @type {import('next').NextConfig} */
const path = require('path');
const upgradeInsecureRequests = process.env.NODE_ENV === 'production' ? '; upgrade-insecure-requests' : '';

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../..'),
  experimental: {
    // NOTE: lucide-react is intentionally EXCLUDED here. The icon-map.tsx
    // imports the full `icons` record at runtime; Next's optimizePackageImports
    // would rewrite that to per-icon imports and break dynamic icon lookup.
    optimizePackageImports: [
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-slot',
      'embla-carousel-react',
      'embla-carousel-autoplay',
      'sonner',
      'class-variance-authority',
      'tailwind-merge',
    ],
  },
  // Absolute asset prefix so assets load correctly when HTML is served
  // through the marketing site's /demo/* rewrite proxy.
  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL}`
    : undefined,
  transpilePackages: ['@flamingo/db', '@flamingo/schemas', '@flamingo/auth'],
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://www.flamingomedia.online https://flamingomedia.online https://flamingo-cms-3-0.vercel.app http://localhost:*${upgradeInsecureRequests}`,
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
