// apps/web/src/components/KakaoLoginButton.tsx
'use client';

import { useKakaoAuth } from '@/hooks/useKakaoAuth';
import Image from 'next/image';
interface KakaoLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * PKCE 적용된 카카오 로그인 버튼
 */
export default function KakaoLoginButton({ children = '카카오로 로그인' }: KakaoLoginButtonProps) {
  const { startKakaoLogin, isKakaoLoginPending: isPending } = useKakaoAuth();

  return (
    <button type="button" onClick={startKakaoLogin} disabled={isPending} className="relative h-12">
      {isPending ? (
        <>
          <div />
          로그인 중...
        </>
      ) : (
        <Image src="/icons/KakaoLoginImage.svg" alt={`${children}`} fill className="" />
      )}
    </button>
  );
}
