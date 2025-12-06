/* tools/eslint-config/index.cjs  ───── 공통 ESLint preset */

const path = require('path');

module.exports = {
  /* 이 파일은 서브-preset이므로 root=false */
  root: false,

  /* TypeScript AST 파서 지정 */
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // 모노레포 루트의 tsconfig.json 을 지정해야 타입-기반 룰이 동작
    project: [path.resolve(__dirname, '../../tsconfig.json')],
    tsconfigRootDir: path.resolve(__dirname, '../../'),
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint'],

  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'next',
    'next/core-web-vitals',
    'prettier',
  ],

  rules: {
    /* React 17+ 는 import React 불필요 */
    'react/react-in-jsx-scope': 'off',
    /* .tsx 파일만 JSX 허용 */
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    /* App Router 프로젝트이므로 pages 전용 규칙 끔 */
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/return-await': 'off',
  },
};
