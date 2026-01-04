module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals'],
  ignorePatterns: [
    'stylelint.config.js',
    'postcss.config.mjs',
    '**/__tests__/e2e/**',
    'server.mjs',
    'src/generated/**', // Orval로 생성된 API 파일 제외
  ],
  rules: {
    // 기존 규칙
  },
};
