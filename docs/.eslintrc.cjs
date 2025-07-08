// File: docs/.eslintrc.cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist/', 'node_modules/'],
  overrides: [
    {
      files: ['*.mjs', '*.config.js', '*.config.mjs', '*.cjs'],
      parserOptions: { project: null },
    },
  ],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    // 필요 규칙
  },
};
