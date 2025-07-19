// apps/web/src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LogoImage from '@/assets/images/LogoImage';
import Button from '@/components/buttons/Button';

export default function HomePage() {
  const router = useRouter();
  // 사용자 인증 상태를 가져옵니다.
  const { isAuth, isLoading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  const handleStart = () => {
    router.replace(isAuth ? '/main' : '/auth');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold animate-fadeIn text-neutral-900 dark:text-neutral-100">
        {ready ? '소소에 오신 것을 환영합니다' : ''}
      </h1>
      <div className="animate-fadeIn flex flex-col items-center  space-y-4">
        <div className="my-20">
          <LogoImage />
        </div>

        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            {ready ? '일상의 소소한 순간들을 기록해보세요' : ' '}
          </p>
        </div>
        {ready && (
          <Button
            onClick={handleStart}
            variant="filled"
            className="w-full"
          >
            소소 시작하기
          </Button>
        )}
      </div>
    </div>
  );
}
