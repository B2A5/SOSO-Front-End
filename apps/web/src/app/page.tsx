// apps/web/src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LogoImage from '@/assets/images/LogoImage';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } =
    useAuth();

  useEffect(() => {
    if (isLoading) {
      // 아직 인증 상태 체크 중
      return;
    }

    if (isAuthenticated) {
      // 로그인 되어 있으면 메인 페이지로
      router.replace('/main');
    } else {
      // 로그인 안 되어 있으면 로그인 페이지로
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // 인증 체크 중일 때 간단한 로딩
  return (
    <div className="flex items-center justify-center">
      <LogoImage />
    </div>
  );
}
