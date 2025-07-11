// apps/web/src/app/auth/AuthClient.tsx
'use client';

import { useEffect } from 'react';
import {
  useSearchParams,
  useRouter,
} from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import KakaoLoginButton from './components/KakaoLoginButton';
import LogoImage from '@/components/images/LogoImage';
import type { Route } from 'next';

const MSG: Record<string, string> = {
  kakao_login_failed:
    '카카오 로그인에 실패했습니다. 다시 시도해주세요.',
  session_expired:
    '세션이 만료되었습니다. 다시 로그인해주세요.',
  /* …중략… */
};

export default function LoginContents() {
  const router = useRouter();
  const params = useSearchParams();
  const isAuth = useAuthStore(
    (s) => s.isAuthenticated,
  );

  const errorCode = params.get('error');
  const returnUrl = params.get('returnUrl');
  const errorMsg = errorCode
    ? MSG[errorCode]
    : null;

  useEffect(() => {
    if (isAuth) {
      router.push(
        (returnUrl
          ? decodeURIComponent(returnUrl)
          : '/signup') as Route,
      );
    }
  }, [isAuth, returnUrl, router]);

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-lg">
        소소에 오신 것을 환영합니다!
      </p>
      <LogoImage />
      {errorMsg && (
        <p className="mt-4 text-red-600">
          {errorMsg}
        </p>
      )}
      <KakaoLoginButton />
    </div>
  );
}
