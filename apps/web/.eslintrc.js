// apps/web/.eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['stylelint.config.js', 'postcss.config.mjs', 'tailwind.config.js'],
  extends: ['next', 'next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      // 이 패턴에 걸리는 파일은 타입 검사(parserOptions.project) 하지 않음
      files: ['.eslintrc.js', 'stylelint.config.js', 'postcss.config.cjs', 'tailwind.config.js'],
      parserOptions: {
        project: null, // or []
      },
    },
  ],
  rules: {
    // 기존 규칙
  },
};
