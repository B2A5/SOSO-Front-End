// apps/web/tailwind.config.js
import plugin from 'tailwindcss/plugin';

const tailwindConfig = {
  content: [
    './src/**/*.{ts,tsx}', // 앱 소스
    '../../packages/ui/**/*', // 공유 패키지 예시
  ],
  plugins: [
    /* ── tap: variant 정의 ──────────────────────── */
    plugin(({ addVariant }) => {
      addVariant('tap', [
        '&:is(:active,[data-pressed="true"])',
      ]);
    }),
  ],
};
export default tailwindConfig;
