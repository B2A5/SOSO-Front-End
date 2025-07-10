// apps/web/src/app/auth/page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import KakaoLoginButton from '@/components/buttons/KakaoLoginButton';
import { useAuthStore } from '@/stores/authStore';
import { Route } from 'next';

const ERROR_MESSAGES: Record<string, string> = {
  kakao_login_failed: '카카오 로그인에 실패했습니다. 다시 시도해주세요.',
  session_expired: '세션이 만료되었습니다. 다시 로그인해주세요.',
  access_denied: '로그인이 취소되었습니다.',
  no_authorization_code: '인가 코드를 받지 못했습니다. 다시 시도해주세요.',
  missing_code_verifier: '보안 검증에 실패했습니다. 다시 시도해주세요.',
  pkce_generation_failed: 'PKCE 생성에 실패했습니다. 브라우저를 새로고침 후 시도해주세요.',
  invalid_request: '잘못된 요청입니다. 다시 시도해주세요.',
  kakao_auth_error: '카카오 인증 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const errorCode = params.get('error');
  const returnUrl = params.get('returnUrl');
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;

  useEffect(() => {
    if (isAuthenticated) {
      const to = returnUrl ? decodeURIComponent(returnUrl) : '/main';
      router.push(to as Route<string>);
    }
  }, [isAuthenticated, returnUrl, router]);

  return (
    <div>
      <h1>로그인</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <KakaoLoginButton />
    </div>
  );
}
