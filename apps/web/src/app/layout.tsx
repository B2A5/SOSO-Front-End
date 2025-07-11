// apps/web/app/layout.tsx
import '@styles/globals.css';
import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/queryProvider';
import localFont from 'next/font/local';

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
    title: 'SoSo – Local Biz Helper',
    description:
      '지역 주민과 함께 만드는 창업 플랫폼',
    type: 'website',
    locale: 'ko_KR',
  },
};
const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`antialiased ${pretendard.className}`}
    >
      <head />
      <body className="flex flex-col h-screen">
        <QueryProvider>
          <main className="w-full max-w-[640px] mx-auto flex-1 overflow-auto">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
