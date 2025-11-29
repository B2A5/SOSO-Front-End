/* packages/eslint-config/library.cjs  ───── React 라이브러리용 ESLint preset */

const path = require('path');

module.exports = {
  root: false,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [path.resolve(__dirname, '../../tsconfig.json')],
    tsconfigRootDir: path.resolve(__dirname, '../../'),
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint'],

  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],

  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/return-await': 'off',
    // 라이브러리에서는 devDependencies import 허용
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
  },
};
