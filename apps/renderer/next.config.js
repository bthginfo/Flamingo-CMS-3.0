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
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.vercel-storage.com' },
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
    ];
  },
};

module.exports = nextConfig;
