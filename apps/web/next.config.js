import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  output: 'standalone',
  // 인증 관련 엔드포인트만 프록시 (쿠키 공유를 위해)
  async rewrites() {
    // HTTPS 환경에서만 프록시 활성화
    // HTTP 개발 환경(CSR only)에서는 프록시 비활성화
    const proxyEnabled =
      process.env.NEXT_PUBLIC_ENABLE_PROXY !== 'false';

    if (!proxyEnabled) {
      console.log(
        '[Next.js] 🚫 프록시 비활성화 - HTTP CSR 전용 모드',
      );
      return [];
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://soso.dreampaste.com';

    console.log('[Next.js] ✅ 프록시 활성화 - HTTPS 전체 기능 모드');
    return [
      // 인증 엔드포인트 (로그인, 토큰 갱신)
      {
        source: '/api/auth/:path*',
        destination: `${apiBaseUrl}/auth/:path*`,
      },
      // 현재 유저 정보 (SSR prefetch)
      {
        source: '/api/users/me',
        destination: `${apiBaseUrl}/users/me`,
      },
      // 자유 게시판
      {
        source: '/api/community/freeboard/:path*',
        destination: `${apiBaseUrl}/community/freeboard/:path*`,
      },
      // 투표 게시판
      {
        source: '/api/community/votesboard/:path*',
        destination: `${apiBaseUrl}/community/votesboard/:path*`,
      },
    ];
  },
  //추후 제거 필요
  images: {
    domains: [
      'picsum.photos',
      'k.kakaocdn.net', // 카카오 로그인 이미지
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'dreampaste-soso-image-storage.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**', // S3 버킷의 모든 경로 허용 (freeboard, voteboard 등)
      },
    ],
  },
  experimental: {
    typedRoutes: false,
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...fileLoaderRule.resourceQuery.not, /url/],
        }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
