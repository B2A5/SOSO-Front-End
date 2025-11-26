'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useKakaoLogin } from '@/generated/api/endpoints/auth/auth';
import type { KakaoLoginResponse } from '@/generated/api/models';
import { useToast } from '@/hooks/ui/useToast';
import { useAuth } from '@/hooks/useAuth';
import * as kakaoAuthService from '@/app/(auth)/kakao/service';

/**
 * 카카오 로그인 훅
 * - 카카오 로그인 플로우 관리
 * - 콜백 처리
 * - 성공/실패 라우팅
 */
export function useKakaoAuth() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { login } = useAuth();

  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
  const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;

  /**
   * 카카오 로그인 API 뮤테이션
   */
  const { mutate: kakaoLogin, isPending } = useKakaoLogin({
    mutation: {
      retry: 0,
      onSuccess: handleLoginSuccess,
      onError: handleLoginError,
    },
  });

  /**
   * 로그인 성공 처리
   */
  function handleLoginSuccess(data: KakaoLoginResponse) {
    kakaoAuthService.cleanup();

    console.log('카카오 로그인 성공:', data);

    // 신규 유저 → 회원가입 페이지
    if (data.isNewUser) {
      router.push('/signup');
    }
    // 기존 유저 → 메인 페이지
    else if (data.accessToken && data.user) {
      login(data.user);
      router.push('/main');
    }
    // 로그인 정보 오류
    else {
      console.error('로그인 정보가 유효하지 않습니다.', data);
      toast('로그인 정보가 유효하지 않습니다.', 'error');
    }
  }

  /**
   * 로그인 실패 처리
   */
  function handleLoginError(error: unknown) {
    kakaoAuthService.cleanup();

    console.error('카카오 로그인 실패:', error);
    toast('카카오 로그인에 실패했습니다.', 'error');

    // URL 정리
    const cleanUrl =
      window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }

  /**
   * 카카오 콜백 처리
   */
  const handleKakaoCallback = useCallback(
    (code: string, state: string | null) => {
      try {
        // 검증 & 요청 데이터 준비
        const loginRequest = kakaoAuthService.validateCallback({
          code,
          state,
          redirectUri: REDIRECT_URI,
        });

        // API 호출 (isPending이 자동으로 true가 됨)
        kakaoLogin({ data: loginRequest });
      } catch (error) {
        if (error instanceof kakaoAuthService.KakaoAuthError) {
          toast(error.message, 'error');
          console.error(
            '카카오 인증 오류:',
            error.code,
            error.message,
          );
        } else {
          toast('인증 처리 중 오류가 발생했습니다.', 'error');
          console.error('알 수 없는 오류:', error);
        }

        kakaoAuthService.cleanup();
      }
    },
    [kakaoLogin, toast, REDIRECT_URI],
  );

  /**
   * 카카오 로그인 시작
   */
  const startKakaoLogin = useCallback(async () => {
    try {
      console.log('카카오 로그인을 시작합니다...');

      // 인증 URL 생성
      const authUrl = await kakaoAuthService.prepareLogin({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
      });

      // 카카오 로그인 페이지로 이동 (페이지 떠남 - loading 불필요)
      window.location.href = authUrl;
    } catch (error) {
      if (error instanceof kakaoAuthService.KakaoAuthError) {
        toast(error.message, 'error');
        console.error('카카오 로그인 시작 실패:', error.code);
      } else {
        toast('카카오 로그인을 시작할 수 없습니다.', 'error');
        console.error('알 수 없는 오류:', error);
      }
    }
  }, [toast, CLIENT_ID, REDIRECT_URI]);

  /**
   * URL 파라미터 감지 및 콜백 처리
   */
  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    // 카카오에서 에러 반환
    if (error) {
      toast('카카오 로그인 중 오류가 발생했습니다.', 'error');
      console.error('카카오 OAuth 에러:', error);
      return;
    }

    // 정상 콜백 처리
    if (code) {
      handleKakaoCallback(code, state);
    }
  }, [params, handleKakaoCallback, toast]);

  return {
    startKakaoLogin,
    isPending,
  };
}
