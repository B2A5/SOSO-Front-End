// apps/web/src/hooks/useKakaoAuth.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { buildKakaoAuthUrl, requestKakaoToken } from '@/api/kakaoAuth';
import { generatePKCE } from '@/utils/pkce';
import { ApiError, isNetworkError } from '@/types/error';
import type { LoginResponse } from '@/types/auth';

/** CSRF 방지용 랜덤 state 생성 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/** PKCE + 카카오 로그인 훅 */
export function useKakaoAuth() {
  const router = useRouter();
  const qc = useQueryClient();
  const { login, setLoading } = useAuthStore();

  const mutation = useMutation<LoginResponse, unknown, { code: string; state?: string }>({
    mutationFn: async ({ code, state }) => {
      const saved = sessionStorage.getItem('kakao_oauth_state');
      if (state && saved !== state) throw new Error('Invalid state');
      const verifier = sessionStorage.getItem('kakao_code_verifier');
      if (!verifier) throw new Error('Missing PKCE verifier');
      setLoading(true);
      return requestKakaoToken({
        code,
        codeVerifier: verifier,
        redirectUri: `${window.location.origin}/auth/kakao/callback`,
        state,
      });
    },
    onSuccess(data) {
      login(data.user, data.tokens);
      qc.setQueryData(['auth', 'profile'], data.user);
      sessionStorage.removeItem('kakao_oauth_state');
      sessionStorage.removeItem('kakao_code_verifier');
      router.push('/main');
    },
    onError(err) {
      console.error('카카오 로그인 실패:', err);
      setLoading(false);
      sessionStorage.removeItem('kakao_oauth_state');
      sessionStorage.removeItem('kakao_code_verifier');
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
      const { codeVerifier, codeChallenge } = await generatePKCE();
      const state = generateState();
      sessionStorage.setItem('kakao_code_verifier', codeVerifier);
      sessionStorage.setItem('kakao_oauth_state', state);
      const url = buildKakaoAuthUrl({
        clientId: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
        redirectUri: `${window.location.origin}/auth/kakao`,
        codeChallenge,
        state,
      });
      window.location.href = url;
    } catch {
      router.push('/auth?error=pkce_failed');
    }
  }, [router]);

  return {
    startKakaoLogin,
    handleKakaoCallback: mutation.mutate,
    // 여기서 pending 상태를 사용합니다
    isKakaoLoginPending: mutation.isPending,
    kakaoLoginError: mutation.error,
  };
}
