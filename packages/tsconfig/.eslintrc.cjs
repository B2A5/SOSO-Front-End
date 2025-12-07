/* packages/tsconfig/.eslintrc.cjs  ───── TypeScript 설정 패키지의 ESLint 설정 */

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  env: {
    node: true,
  },
  // JSON 파일이므로 ESLint 비활성화
  ignorePatterns: ['*.json'],
};
