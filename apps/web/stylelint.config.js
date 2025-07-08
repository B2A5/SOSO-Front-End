module.exports = {
  extends: ['stylelint-config-recommended'],
  rules: {
    // Tailwind의 at-rule을 무시
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'import',
          'tailwind',
          'layer',
          'apply',
          'variants',
          'responsive',
          'screen',
          'theme',
        ],
      },
    ],
  },
};
