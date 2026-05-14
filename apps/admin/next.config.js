/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: ['@flamingo/db', '@flamingo/schemas', '@flamingo/auth'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.vercel-storage.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://flamingo-cms-3-0.vercel.app https://www.flamingomedia.online https://flamingomedia.online',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://flamingo-cms-3-0.vercel.app https://www.flamingomedia.online https://flamingomedia.online http://localhost:3000",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
