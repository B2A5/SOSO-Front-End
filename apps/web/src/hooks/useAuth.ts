// apps/web/src/hooks/useAuth.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import { retryFn, retryDelayFn } from '@/utils/query';
import { ApiError } from '@/api/error';

/**
 * 인증 관련 훅
 * - 사용자 프로필 조회 쿼리
 * - 인증 상태 관리
 */
export function useAuth() {
  const {
    user,
    setUser,
    accessToken,
    isAuth,
    isLoading: isAuthLoading,
  } = useAuthStore();

  // 프로필 조회 쿼리
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuth && !!accessToken, // 인증된 상태에서만 호출(엑세스 토큰이 있을 때)
    retry: (count, err) => retryFn(count, err as ApiError),
    retryDelay: retryDelayFn,
  });

  // 프로필이 내려오면 store 에 동기화
  useEffect(() => {
    if (profile && (!user || profile.id !== user.id)) {
      setUser(profile);
    }
  }, [profile, user, setUser]);

  return {
    user,
    isAuth,
    isLoading: isAuthLoading || isProfileLoading,
    error,
    refetch,
  };
}
