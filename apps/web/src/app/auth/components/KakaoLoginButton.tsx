// apps/web/src/components/KakaoLoginButton.tsx
'use client';

import { Button } from '@/components/buttons/Button';
import KakaoImage from '@/components/images/KakaoImage';
import { useKakaoAuth } from '@/hooks/useKakaoAuth';

/** PKCE 카카오 로그인 전용 버튼 – 별도 props 없이 그대로 사용 */
export default function KakaoLoginButton() {
  const { startKakaoLogin, isKakaoLoginPending } =
    useKakaoAuth();

  return (
    <Button
      onClick={startKakaoLogin}
      isLoading={isKakaoLoginPending}
      loadingText="로그인 중…"
      fullWidth
      size="lg"
      startIcon={
        !isKakaoLoginPending && (
          <KakaoImage className="mr-2" />
        )
      }
      className="
       
      "
      disabled={isKakaoLoginPending}
    >
      카카오로 로그인
    </Button>
  );
}
