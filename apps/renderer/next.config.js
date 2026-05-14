/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://www.flamingomedia.online https://flamingomedia.online',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://www.flamingomedia.online https://flamingomedia.online http://localhost:3000",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
