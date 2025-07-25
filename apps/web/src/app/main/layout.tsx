// apps/web/app/main/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}
/**
 * 메인 레이아웃 컴포넌트
 * 하단 네비게이션과 메인 콘텐츠 영역을 관리
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-auto pb-16">{children}</main>

      {/* 하단 네비게이션 */}
      <Navigation currentPath={pathname} />
    </div>
  );
}
