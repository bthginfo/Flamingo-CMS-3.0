/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Absolute asset prefix so assets load correctly when HTML is served
  // through the marketing site's /demo/* rewrite proxy.
  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL}`
    : undefined,
  transpilePackages: ['@flamingo/db', '@flamingo/schemas', '@flamingo/auth'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://www.flamingomedia.online https://flamingomedia.online https://flamingo-cms-3-0.vercel.app https://*.vercel.app http://localhost:*",
          },
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
