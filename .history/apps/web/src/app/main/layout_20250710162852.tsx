// apps/web/app/main/layout.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Navigation } from '@/components/Navigation';
import { useAuthStore } from '@/stores/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
}
/**
 * 메인 레이아웃 컴포넌트
 * 하단 네비게이션과 메인 콘텐츠 영역을 관리
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {  logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      logout();

      // 2) React Query 캐시 초기화 (optional)
      queryClient.clear();

      // 3) sessionStorage에 남아있는 PKCE/state 제거
      sessionStorage.removeItem('kakao_oauth_state');
      sessionStorage.removeItem('kakao_code_verifier');
      router.replace('/auth');
    } catch (e) {
      console.error('로그아웃 실패', e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header>
        <span>안녕하세요, 님</span>
      </header>
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-auto pb-16">
        {children}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          로그아웃
        </button>
      </main>

      {/* 하단 네비게이션 */}
      <Navigation currentPath={pathname} />
    </div>
  );
}
