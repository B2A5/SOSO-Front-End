// apps/web/src/components/KakaoLoginButton.tsx
'use client';

import { Button } from '@/components/buttons/Button';
import KakaoImage from '@/assets/images/KakaoImage';
import { useKakaoAuth } from '@/hooks/useKakaoAuth';
import kakaoSubsetFont from '@/assets/fonts/KakaoSubsetFont';
import { cn } from '@/utils/cn';

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
      size="lg"
      className={cn(
        kakaoSubsetFont.className,
        '!bg-kakao-100 !text-kakao-200 gap-2 hover:!bg-kakao-100/50',
        className,
      )}
    >
      <KakaoImage className="w-6 h-6" />
      카카오로 로그인
    </Button>
  );
}
