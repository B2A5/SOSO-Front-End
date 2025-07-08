// apps/web/src/components/KakaoLoginButton.tsx
'use client';

import { useKakaoAuth } from '@/hooks/useKakaoAuth';

interface KakaoLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * PKCE 적용된 카카오 로그인 버튼
 */
export default function KakaoLoginButton({ children = '카카오로 로그인' }: KakaoLoginButtonProps) {
  const { startKakaoLogin, isKakaoLoginPending } = useKakaoAuth();

  return (
    <button type="button" onClick={startKakaoLogin} disabled={isKakaoLoginPending}>
      {isKakaoLoginPending ? (
        <>
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
          로그인 중...
        </>
      ) : (
        <>{children}</>
      )}
    </button>
  );
}
