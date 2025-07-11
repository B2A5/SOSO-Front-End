/** apps/web/.stylelintrc.cjs */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss', // 👈 플러그인+규칙 모두 포함
    'stylelint-config-prettier', // (선택) Prettier와 충돌 제거
  ],
  rules: {
    'selector-class-pattern': null,
  },
};
