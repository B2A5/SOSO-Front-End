// apps/web/src/components/KakaoLoginButton.tsx
'use client';

import { Button } from '@/components/buttons/Button';
import KakaoImage from '@/assets/images/KakaoImage';
import { useKakaoAuth } from '@/hooks/useKakaoAuth';
import kakaoSubsetFont from '@/assets/fonts/KakaoSubsetFont';
import { twMerge } from 'tailwind-merge';

export default function KakaoLoginButton({
  className,
}: {
  className: string;
}) {
  //startKakaoLogin을 호출하여 카카오 로그인 프로세스를 시작합니다.
  const { startKakaoLogin, isPending } = useKakaoAuth();

  return (
    <Button
      onClick={startKakaoLogin}
      isLoading={isPending}
      loadingText="로그인 중…"
      size="lg"
      startIcon={<KakaoImage className="mr-2" />}
      className={twMerge(
        kakaoSubsetFont.className,
        '!bg-kakao-100 !text-kakao-200',
        className,
      )}
    >
      카카오로 로그인
    </Button>
  );
}
