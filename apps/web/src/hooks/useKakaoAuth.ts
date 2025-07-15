'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/ui/useToast';
import { ApiError } from '@/api/error';
import {
  buildKakaoAuthUrl,
  requestKakaoToken,
} from '@/api/kakaoAuth';
import { generatePKCE, generateState } from '@/utils/authUtil';
import {
  saveKakaoAuthData, // NEW
  validateCallbackData, // NEW
  clearKakaoAuthData, // NEW
} from '@/utils/kakaoAuthValidator';
import type { LoginResponse } from '@/types/auth.types';

export function useKakaoAuth() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { setToken, setLoading } = useAuthStore();

  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
  const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;

  // 리엑트 쿼리 뮤테이션 설정
  const mutation = useMutation<
    LoginResponse,
    unknown,
    { code: string; state?: string }
  >({
    mutationFn: async ({ code, state }) => {
      setLoading(true);

      // validator로 state, verifier 검증 및 반환
      const codeVerifier = validateCallbackData({
        stateParam: state,
      });

      console.log('Kakao 토큰 요청:', {
        code,
        codeVerifier,
        redirectUri: REDIRECT_URI,
        state,
      });
      return requestKakaoToken({
        code,
        codeVerifier,
        redirectUri: REDIRECT_URI,
        state,
      });
    },
    onSuccess(data) {
      // 세션 데이터 제거
      clearKakaoAuthData();
      setLoading(false);
      console.log('Kakao 로그인 성공:', data);

      // 신규 유저는 회원가입 이어서
      if (data.isNewUser) {
        router.push('/auth/signup');
      }
      // 기존 유저는 메인 페이지로
      else if (data.accessToken) {
        setToken(data.accessToken);
        router.push('/main');
      }
      // 로그인 정보가 유효하지 않은 경우
      else {
        console.error(
          '로그인 정보가 유효하지 않습니다.(회원가입은 성공함)',
          data,
        );
        toast('로그인 정보가 유효하지 않습니다.', 'error');
      }
    },
    onError(err) {
      setLoading(false);
      console.error(err);
      toast('카카오 로그인에 실패했습니다.', 'error');
      throw new Error(
        '카카오 로그인 실패: ' + ApiError.getErrorMessage(err),
      );
    },
  });

  // 콜백 처리
  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      toast('카카오 로그인 중 에러가 발생했습니다.', 'error');
      console.error(
        '카카오 로그인 URL 파라미터가 잘못되었습니다.',
        error,
      );
      return;
    }
    if (code && mutation.isIdle) {
      mutation.mutate({ code, state: state ?? undefined });
    }
  }, [params, mutation, toast]);

  // 3) 로그인 시작 함수
  const startKakaoLogin = async () => {
    try {
      console.log('카카오 로그인을 시작합니다...');
      const { codeVerifier, codeChallenge } = await generatePKCE();
      const state = generateState();
      // validator로 세션 저장
      saveKakaoAuthData({ verifier: codeVerifier, state });

      const url = buildKakaoAuthUrl({
        clientId: KAKAO_API_KEY,
        redirectUri: REDIRECT_URI,
        codeChallenge,
        state,
      });
      window.location.href = url;
    } catch {
      console.error('PKCE 생성 실패');
    }
  };

  return {
    startKakaoLogin,
    isPending: mutation.isPending,
  };
}
