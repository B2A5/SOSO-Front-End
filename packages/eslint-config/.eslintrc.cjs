/* packages/eslint-config/.eslintrc.cjs  ───── ESLint 설정 패키지 자체의 ESLint 설정 */

module.exports = {
  root: true,
  // JavaScript 파일이므로 TypeScript 파서 사용 안 함
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // 타입 체크 비활성화 (설정 파일은 JS만 사용)
    project: null,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    // Node.js require 허용
    '@typescript-eslint/no-var-requires': 'off',
  },
};
