/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@flamingo/db', '@flamingo/schemas', '@flamingo/auth'],
};

module.exports = nextConfig;
