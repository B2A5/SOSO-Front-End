// apps/web/src/hooks/useAuth.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import { retryFn, retryDelayFn } from '@/utils/query';

/**
 * 인증 상태 관리 훅 (Axios 기반)
 */
export function useAuth() {
  const { user, isAuthenticated, tokens, login, isTokenExpired } = useAuthStore();

  /**
   * 사용자 프로필 조회 쿼리
   */
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated && !isTokenExpired(),
    staleTime: 5 * 60 * 1000, // 5분
    // 401 에러는 재시도하지 않음 (토큰 만료)
    retry: (failureCount: number, error: unknown) => retryFn(failureCount, error),
    retryDelay: (attemptIndex: number) => retryDelayFn(attemptIndex),
  });

  /**
   * 프로필 정보 동기화
   * 로그인 상태가 변경되거나 프로필이 업데이트되면 호출됩니다.
   */
  useEffect(() => {
    if (profile && (!user || user.id !== profile.id)) {
      login(profile, tokens!);
    }
  }, [profile, user, tokens, login]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    refetch,
  };
}
