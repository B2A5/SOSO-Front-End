'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/ui/useToast';
import {
  buildKakaoAuthUrl,
  requestKakaoToken,
} from '@/api/kakaoAuth';
import { generatePKCE, generateState } from '@/utils/authUtil';
import { ApiError, isNetworkError } from '@/types/error';
import type { LoginResponse } from '@/types/auth.types';

export function useKakaoAuth() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { setToken, setLoading } = useAuthStore();

  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
  const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;

  // 2) 뮤테이션 정의
  const mutation = useMutation<
    LoginResponse,
    unknown,
    { code: string; state?: string }
  >({
    mutationFn: async ({ code, state }) => {
      const saved = sessionStorage.getItem('kakao_oauth_state');
      if (!saved || saved !== state)
        throw new Error('STATE 검증 실패');
      const verifier = sessionStorage.getItem('kakao_code_verifier');
      if (!verifier) throw new Error('PKCE code_verifier 누락');

      setLoading(true);

      return requestKakaoToken({
        code,
        codeVerifier: verifier,
        redirectUri: REDIRECT_URI,
        state,
      });
    },
    onSuccess(data) {
      // 세션 정리
      sessionStorage.removeItem('kakao_oauth_state');
      sessionStorage.removeItem('kakao_code_verifier');
      setLoading(false);

      if (data.isNewUser) {
        // 신규 유저는 회원가입 페이지로 리다이렉트
        router.push('/auth/signUp');
        // 기존 유저는 로그인 상태로 유지
      } else if (data.accessToken) {
        // 기존 유저는 로그인 처리
        // 지금은 토큰만 저장
        setToken(data.accessToken);
        router.push('/main');
      } else {
        // 로그인 실패 처리
        toast('로그인 정보가 유효하지 않습니다.', 'error');
      }
    },
    onError(err) {
      console.error(err);
      setLoading(false);

      let errorMsg = '';
      if (err instanceof ApiError) {
        if (err.isAuthError()) errorMsg = '인증 실패';
        else if (err.isServerError()) errorMsg = '서버 오류입니다.';
      } else if (isNetworkError(err)) {
        errorMsg = '네트워크 오류입니다.';
      }
      toast('카카오 로그인에 실패했습니다.', 'error');
      throw new Error(`Kakao login error: ${errorMsg}`);
    },
  });

  // 콜백 처리: code 및 state 파라미터 있을 때
  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      toast('카카오 로그인 중 에러가 발생했습니다.', 'error');
      return;
    }
    if (code && mutation.isIdle) {
      mutation.mutate({ code, state: state ?? undefined });
    }
  }, [params, mutation, toast]);

  // 3) 로그인 시작 버튼
  const startKakaoLogin = async () => {
    try {
      const { codeVerifier, codeChallenge } = await generatePKCE();
      const state = generateState();
      sessionStorage.setItem('kakao_code_verifier', codeVerifier);
      sessionStorage.setItem('kakao_oauth_state', state);

      const url = buildKakaoAuthUrl({
        clientId: KAKAO_API_KEY,
        redirectUri: REDIRECT_URI,
        codeChallenge,
        state,
      });
      window.location.href = url;
    } catch {
      toast('PKCE 생성 실패', 'error');
    }
  };

  return {
    startKakaoLogin,
    isPending: mutation.isPending,
  };
}
