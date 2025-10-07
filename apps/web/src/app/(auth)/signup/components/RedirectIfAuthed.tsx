// apps/web/src/components/guards/RedirectIfAuthenticated.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface RedirectIfAuthedProps {
  to?: string; // 인증 시 이동할 경로 (기본: /main)
  children?: React.ReactNode;
  className?: string; // 추가적인 클래스
}

export default function RedirectIfAuthed({
  to = '/main',
  children,
  className = '',
}: RedirectIfAuthedProps) {
  // Zustand에서 인증 여부 가져오기
  const isAuth = useAuthStore((s) => s.getIsAuth());
  const router = useRouter();

  // CSR 마운트 완료 전 렌더 차단(깜빡임 방지)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (isAuth) {
      // 이미 로그인되어 있으면 메인으로 보냄
      console.warn(
        '이미 로그인되어 있습니다. 메인 페이지로 이동합니다.',
      );
      router.replace(to);
    }
  }, [mounted, isAuth, router, to]);

  //아직 마운트 전이거나, 리다이렉트 진행 중에는 children 렌더 X
  if (!mounted || isAuth) return null;

  // 비로그인 상태면 하위 콘텐츠 보여줌
  return <div className={className}>{children}</div>;
}
