// apps/web/src/hooks/useAuth.ts
'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRefreshToken } from '@/generated/api/endpoints/auth/auth';

/**
 * 앱 마운트 시 인증 상태를 자동 복원하는 훅
 *
 * 동작 방식:
 * 1. Refresh Token(httpOnly 쿠키)이 유효하면 새 Access Token 발급
 * 2. 성공 시: authStore에 토큰 저장
 * 3. 실패 시: Refresh Token 만료 또는 없음 - 로그아웃 상태 유지
 *
 *
 * @returns 인증 복원 상태 (isRestoring, isAuthenticated)
 */
export function useAuthRestore() {
  const { setToken, logout, isLoading, setLoading, getIsAuth } =
    useAuthStore();
  const hasAttempted = useRef(false); // 중복 호출 방지

  const { mutate: refresh, isPending } = useRefreshToken({
    mutation: {
      onSuccess: (data) => {
        const { jwtAccessToken } = data;
        if (jwtAccessToken) {
          setToken(jwtAccessToken);
          console.log('[Auth] 토큰 복원 성공');

          // TODO: 유저 정보 조회 API 구현 후 추가
          // const user = await getCurrentUser();
          // setUser(user);
        }
        setLoading(false);
      },
      onError: (error) => {
        console.log(
          '[Auth] Refresh Token 없음 또는 만료 - 로그인 필요',
          error,
        );
        logout(); // 인증 상태 초기화
        setLoading(false);
      },
    },
  });

  useEffect(() => {
    // 이미 인증 복원을 시도했거나 토큰이 있으면 스킵
    if (hasAttempted.current || getIsAuth()) {
      return;
    }

    hasAttempted.current = true;
    setLoading(true);
    refresh(); // Refresh Token 쿠키로 자동 갱신
  }, [refresh, setLoading, getIsAuth]);

  return {
    /** 인증 복원 중 여부 */
    isRestoring: isLoading || isPending,
    /** 인증 완료 여부 */
    isAuthenticated: getIsAuth(),
  };
}
