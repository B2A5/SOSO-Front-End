// apps/web/src/components/KakaoLoginButton.tsx
'use client';

import { Button } from '@/components/buttons/Button';
import KakaoImage from '@/assets/images/KakaoImage';
import { useKakaoAuth } from '@/hooks/useKakaoAuth';
import kakaoSubsetFont from '@/assets/fonts/KakaoSubsetFont';
import { twMerge } from 'tailwind-merge';

// PKCE 카카오 로그인 전용 버튼
export default function KakaoLoginButton({
  className,
}: {
  className: string;
}) {
  const { startKakaoLogin, isKakaoLoginPending } = useKakaoAuth();

  return (
    <Button
      onClick={startKakaoLogin}
      isLoading={isKakaoLoginPending}
      loadingText="로그인 중…"
      size="lg"
      startIcon={<KakaoImage className="mr-2" />}
      className={twMerge(
        kakaoSubsetFont.className,
        '!bg-kakao-100 !text-kakao-200',
        className,
      )}
      disabled={isKakaoLoginPending}
    >
      카카오로 로그인
    </Button>
  );
}
