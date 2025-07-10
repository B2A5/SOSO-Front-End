// apps/web/tailwind.config.js
const tailwindConfig = {
  content: [
    './src/**/*.{ts,tsx}', // 앱 소스
    '../../packages/ui/**/*', // 공유 패키지 예시
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        // ...필요한 사이즈 추가
      },
      colors: {
        green: {
          0: '#F2FEF5',
          100: '#B2F7C1',
          200: '#6FED8B',
          300: '#5DE189',
          400: '#57DC88',
          500: '#49D386',
          600: '#2FC182',
          700: '#1FAA77',
          800: '#19825C',
          900: '#115F43',
          1000: '#093324',
        },
        neutral: {
          0: '#F1F1F1',
          100: '#E1E1E1',
          200: '#CDCDCD',
          300: '#B8B8B8',
          400: '#A1A1A1',
          500: '#8D8D8D',
          600: '#767676',
          700: '#606060',
          800: '#4C4C4C',
          900: '#373737',
          1000: '#1A1A1A',
        },
      },
    },
  },
};
export default tailwindConfig;
