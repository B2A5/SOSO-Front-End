const path = require('path');

module.exports = {
  root: true,
  extends: [require.resolve('@soso/eslint-config/library.cjs')],
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'dist',
    '*.config.ts',
    '*.config.js',
    '*.config.mjs',
    '.eslintrc.*',
  ],
};
