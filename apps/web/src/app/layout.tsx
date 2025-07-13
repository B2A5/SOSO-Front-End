// apps/web/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/queryProvider';
import pretendardFont from '@/assets/fonts/PretandardFont';

export const metadata: Metadata = {
  title: 'SoSo – Local Biz Helper',
  description:
    '지역 주민과 함께 만드는 창업 플랫폼',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#4CAF50', //tailwindcss green-500
  //manifest: '/manifest.json',
  keywords: [
    '창업',
    '지역',
    '소상공인',
    '아이디어',
    '투표',
  ],
  authors: [{ name: 'SOSO Team' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SoSo',
  },
  openGraph: {
    title: 'SoSo',
    description:
      '지역 주민과 함께 만드는 창업 플랫폼',
    type: 'website',
    locale: 'ko_KR',
  },
};
// 전역 폰트 설정

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`antialiased ${pretendardFont.className}`}
    >
      <head />
      {/* 다크 모드 배경 지원 */}
      <body className="flex flex-col h-screen bg-gradient-to-br from-neutral-0 to-neutral-100 dark:from-neutral-1000 dark:to-neutral-900">
        <QueryProvider>
          {/*  */}
          <main className="w-full max-w-screen-md md:mx-auto flex-1 overflow-auto">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
