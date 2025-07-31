// apps/web/src/hooks/useAuth.ts
'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

import type { RefreshResponse } from '@/types/auth.types';
import { refreshToken, getProfile } from '@/api/auth';

/**
 * 인증 관련 훅
 * - 사용자 프로필 조회 쿼리
 * - 인증 상태 관리
 */
export function useAuth() {
  const {
    user,
    setUser,
    setToken,
    accessToken,
    logout,
    isLoading: isAuthLoading,
    getIsAuth,
    setLoading,
  } = useAuthStore();

  // 새로 고침시 인증 상태 복원
  const { mutate: refresh } = useMutation<RefreshResponse, Error>({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      setToken(data.jwtAccessToken);
      setLoading(false);
    },
    onError: (error) => {
      console.error('토큰 갱신 실패:', error);
      logout(); // 갱신 실패 시 로그아웃 처리
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  useEffect(() => {
    setLoading(true);
    refresh();
  }, [setLoading, refresh]);

  // 프로필 조회 쿼리
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => getProfile(),
    enabled: getIsAuth() && !!accessToken, // 인증된 상태에서만 호출(엑세스 토큰이 있을 때)
  });

  // 프로필이 내려오면 store 에 동기화
  useEffect(() => {
    if (profile && (!user || profile.id !== user.id)) {
      setUser(profile);
    }
  }, [profile, user, setUser]);

  return {
    user,
    getIsAuth,
    isLoading: isAuthLoading || isProfileLoading,
    error,
    refetch,
  };
}
