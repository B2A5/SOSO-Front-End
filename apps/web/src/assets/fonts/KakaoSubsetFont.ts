import localFont from 'next/font/local';

const kakaoSubsetFont = localFont({
  src: '../../../public/fonts/KakaoSubset.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-kakao',
});

export default kakaoSubsetFont;
