/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@flamingo/db', '@flamingo/auth'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    const rendererUrl = process.env.RENDERER_URL || 'https://flamingo-renderer.vercel.app';
    return [
      {
        source: '/demo/:path*',
        destination: `${rendererUrl}/demo/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
