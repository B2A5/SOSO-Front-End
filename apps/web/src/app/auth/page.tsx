// apps/web/src/app/auth/page.tsx
'use client';

import KakaoLoginButton from './components/KakaoLoginButton';
import LogoImage from '@/assets/images/LogoImage';
import { Button } from '@/components/buttons/Button';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  return (
    <div className="p-layout h-full">
      <div className="flex flex-col justify-between py-[30px] h-full">
        <div className="my-8">
          <LogoImage />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <KakaoLoginButton className="w-full" />
            <Button
              size="lg"
              className="w-full bg-black"
              onClick={() => router.push('/auth/signup')}
            >
              애플로 로그인
            </Button>
          </div>
          <p className="text-center text-neutral-500">
            전화번호로 시작하기
          </p>
        </div>
      </div>
    </div>
  );
}
