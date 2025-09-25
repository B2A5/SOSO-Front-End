// 루트 ESLint configuration

// .eslintrc.cjs
module.exports = {
  root: true,
  ignorePatterns: [
    '.eslintrc.cjs',
    'commitlint.config.cjs',
    'apps/docs/**',
    'apps/docs',
    '**/apps/docs/**',
  ],
  extends: ['./tools/eslint-config/index.cjs'],
  plugins: ['@typescript-eslint'],
};
