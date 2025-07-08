// apps/web/src/app/auth/kakao/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useKakaoAuth } from '@/hooks/useKakaoAuth';

/**
 * 카카오 로그인 콜백 처리 컴포넌트
 */
function KakaoCallbackHandler() {
  const searchParams = useSearchParams();
  const { handleKakaoCallback } = useKakaoAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // 에러 처리
    if (error) {
      console.error('카카오 로그인 에러:', { error, errorDescription });

      let errorType = 'unknown_error';
      switch (error) {
        case 'access_denied':
          errorType = 'access_denied';
          break;
        case 'invalid_request':
          errorType = 'invalid_request';
          break;
        default:
          errorType = 'kakao_auth_error';
      }

      window.location.href = `/auth?error=${errorType}`;
      return;
    }

    // 인가 코드 검증
    if (!code) {
      console.error('인가 코드가 없습니다.');
      window.location.href = '/auth?error=no_authorization_code';
      return;
    }

    // PKCE code_verifier 확인
    const codeVerifier = sessionStorage.getItem('kakao_code_verifier');
    if (!codeVerifier) {
      console.error('PKCE code_verifier가 없습니다.');
      window.location.href = '/auth?error=missing_code_verifier';
      return;
    }

    // 카카오 로그인 처리
    handleKakaoCallback({ code, state: state || undefined });
  }, [searchParams, handleKakaoCallback]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
        <p className="text-sm text-gray-500 mt-2">PKCE 검증을 포함한 보안 인증 진행 중</p>
      </div>
    </div>
  );
}

/**
 * 카카오 콜백 페이지
 */
export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">페이지 로딩 중...</p>
          </div>
        </div>
      }
    >
      <KakaoCallbackHandler />
    </Suspense>
  );
}
