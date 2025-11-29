module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals'],
  ignorePatterns: [
    'stylelint.config.js',
    'postcss.config.mjs',
    '**/__tests__/e2e/**',
    'server.mjs',
  ],
  rules: {
    // 기존 규칙
  },
};
