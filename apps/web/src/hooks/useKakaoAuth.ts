// apps/web/src/hooks/useKakaoAuth.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { buildKakaoAuthUrl, requestKakaoToken } from '@/api/kakaoAuth';
import { generatePKCE, generateState } from '@/utils/authUtil';
import { ApiError, isNetworkError } from '@/types/error';
import type { LoginResponse } from '@/types/auth';

/** PKCE + 카카오 로그인 훅 */
export function useKakaoAuth() {
  const router = useRouter();
  const qc = useQueryClient();
  const { login, setLoading } = useAuthStore();

  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  if (!REDIRECT_URI) {
    throw new Error('Kakao redirect URI이 환경 변수에 설정되어 있지 않습니다.');
  }
  const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  if (!KAKAO_API_KEY) {
    throw new Error('Kakao API key이 환경 변수에 설정되어 있지 않습니다.');
  }

  /*
   * 카카오 로그인 콜백 처리 뮤테이션
   * - 인가 코드와 상태 값을 받아서 토큰 교환 요청을 수행합니다
   * - 성공 시 로그인 상태를 업데이트하고 메인 페이지로 리다이렉트합니다
   */
  const mutation = useMutation<LoginResponse, unknown, { code: string; state?: string }>({
    mutationFn: async ({ code, state }) => {
      // state 및 PKCE 검증
      const saved = sessionStorage.getItem('kakao_oauth_state');
      if (state && saved !== state) throw new Error('잘못된 STATE 값 입니다.');
      const verifier = sessionStorage.getItem('kakao_code_verifier');
      if (!verifier) throw new Error('PKCE code_verifier가 없습니다.');

      setLoading(true);

      // 인가 코드+ PKCE code_verifier로 백엔드에 토큰 요청
      return requestKakaoToken({
        code,
        codeVerifier: verifier,
        redirectUri: REDIRECT_URI,
        state,
      });
    },
    onSuccess(data) {
      // 로그인 성공 처리
      login(data.user, data.tokens);
      qc.setQueryData(['auth', 'profile'], data.user);

      // 세션 정리
      sessionStorage.removeItem('kakao_oauth_state');
      sessionStorage.removeItem('kakao_code_verifier');

      // 메인 페이지로 이동
      router.push('/main');
    },
    onError(err) {
      console.error('카카오 로그인 실패:', err);
      setLoading(false);

      // 세션 정리
      sessionStorage.removeItem('kakao_oauth_state');
      sessionStorage.removeItem('kakao_code_verifier');

      // 에러 구분
      let type = 'kakao_login_failed';
      if (err instanceof ApiError) {
        if (err.isAuthError()) type = 'auth_failed';
        else if (err.isServerError()) type = 'server_error';
      } else if (isNetworkError(err)) {
        type = 'network_error';
      }
      router.push(`/auth?error=${type}`);
    },
  });

  const startKakaoLogin = useCallback(async () => {
    try {
      // PKCE 생성
      const { codeVerifier, codeChallenge } = await generatePKCE();
      const state = generateState();

      // 2) 세션에 PKCE/state 저장
      sessionStorage.setItem('kakao_code_verifier', codeVerifier);
      sessionStorage.setItem('kakao_oauth_state', state);

      // 3) 인가 URL 생성 (같은 REDIRECT_URI 사용)
      const url = buildKakaoAuthUrl({
        clientId: KAKAO_API_KEY,
        redirectUri: REDIRECT_URI,
        codeChallenge,
        state,
      });

      // 4) 카카오 로그인 페이지로 이동
      window.location.href = url;
    } catch {
      router.push('/auth?error=pkce_failed');
    }
  }, [router, REDIRECT_URI]);

  return {
    startKakaoLogin,
    handleKakaoCallback: mutation.mutate,
    isKakaoLoginPending: mutation.isPending,
    kakaoLoginError: mutation.error,
  };
}
