// apps/web/src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LogoImage from '@/assets/images/LogoImage';
import Button from '@/components/buttons/Button';

export default function HomePage() {
  const router = useRouter();
  const { isAuth, isLoading } = useAuth();
  const [ready, setReady] = useState(false);

  // 클라이언트 쿠키 확인
  if (typeof window !== 'undefined') {
    console.log('[HomePage] 🍪 document.cookie:', document.cookie);
  }

  console.log(
    'HomePage 렌더링 - isAuth:',
    isAuth,
    'isLoading:',
    isLoading,
  );

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  const handleStart = () => {
    router.replace(isAuth ? '/main' : '/login');
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between pt-40">
      <h1 className="text-2xl font-semibold animate-fadeIn text-neutral-900 dark:text-neutral-100">
        {ready ? '소소에 오신 것을 환영합니다' : ''}
      </h1>
      <div className="w-full h-full p-layout flex animate-fadeIn flex-col items-center justify-between space-y-4">
        <div className="my-20 flex-1 flex items-center justify-center">
          <LogoImage />
        </div>

        <div className="w-full space-y-4 flex flex-col items-center">
          <p className="text-neutral-600 animate-pulse dark:text-neutral-400 text-sm">
            {ready ? '일상의 소소한 순간들을 기록해보세요' : ' '}
          </p>
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
    </div>
  );
}
