/** apps/web/.stylelintrc.mjs */
/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    '@stylistic/stylelint-config',
    'stylelint-config-tailwindcss',
  ],
  rules: {
    // 네이밍 컨벤션 — camelCase/BEM 허용
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'selector-class-pattern': null,
    'value-keyword-case': null,

    // 색상 표기법
    'color-hex-length': null,
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'alpha-value-notation': null,

    // 포맷팅 (globals.css 기존 스타일 유지)
    'rule-empty-line-before': null,
    'comment-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'custom-property-empty-line-before': null,
    '@stylistic/string-quotes': null,
    '@stylistic/declaration-colon-newline-after': null,

    // 벤더 프리픽스 / 단위
    'property-no-vendor-prefix': null,
    'length-zero-no-unit': null,
  },
};
