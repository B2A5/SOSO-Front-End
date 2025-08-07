/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  output: 'standalone',
  //추후 제거 필요
  images: {
    domains: ['picsum.photos'],
  },
  experimental: {
    typedRoutes: false,
  },
};

module.exports = nextConfig;
