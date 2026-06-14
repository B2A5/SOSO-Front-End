import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  getGetCurrentUserQueryKey,
} from '@/generated/api/endpoints/users/users';
import { ApiError } from '@/lib/api-error';
import type { UserResponse } from '@/generated/api/models';
import { useLogout } from './useLogout';
import { useOverlay } from './ui/useOverlay';
import React from 'react';
import { LoginRedirectOverlay } from '@/components/LoginRedirectOverlay';

/**
 * 현재 로그인한 사용자 정보를 조회하는 Hook
 *
 * @returns {
 * user: UserResponse | null - 현재 로그인한 사용자 정보 (없으면 null)
 * isAuth: boolean - 인증 여부
 * isLoading: boolean - 로딩 상태
 * isError: boolean - 에러 발생 여부
 * login: (user: UserResponse) => void - 사용자 정보를 캐시에 저장하는 함수
 * logout: () => void - 로그아웃 함수
 * }
 */
export interface UseAuthReturn {
  user: UserResponse | null;
  isAuth: boolean;
  isLoading: boolean;
  isError: boolean;
  login: (user: UserResponse) => void;
  logout: () => void;
}
export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient();
  const { logout, isPending: isLoggingOut } = useLogout();

  const query = useQuery({
    queryKey: getGetCurrentUserQueryKey(),
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (error) {
        if (ApiError.wrap(error).isAuthError()) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 13 * 60 * 1000, // 13분
    throwOnError: false, // 앱 크래시 방지
  });

  /**
   * 유저 정보를 캐시에 저장 (로그인/회원가입 시 사용)
   */
  const login = (user: UserResponse) => {
    queryClient.setQueryData(getGetCurrentUserQueryKey(), user);
  };

  return {
    user: query.data ?? null,
    isAuth: !!query.data,
    isLoading: query.isLoading || isLoggingOut,
    isError: query.isError,
    login,
    logout,
  };
}

/**
 * 인증 상태 복원 Hook (기존 코드 호환성 유지)
 *
 * useAuth()의 래퍼로, 기존 코드에서 사용하던 인터페이스를 유지합니다.
 */
export function useAuthRestore() {
  const { user, isAuth, isLoading } = useAuth();

  return {
    isRestoring: isLoading,
    isAuthenticated: isAuth,
    user,
  };
}

/**
 * 행동 단위 인증 가드 Hook (HOF 패턴)
 *
 * - 인증된 상태: 넘겨준 액션(fn)을 그대로 실행
 * - 비인증 상태: 로그인 리다이렉트 오버레이를 띄우고, 액션은 실행하지 않음
 */
export function useAuthGuard() {
  // 현재 로그인 여부
  const { isAuth } = useAuth();
  // 전역 오버레이 제어 훅
  const { open } = useOverlay();

  /**
   * 내부 헬퍼: "지금 로그인 되어 있는지" 확인하는 함수
   *
   * - 로그인 X:
   *   - LoginRedirectOverlay 오버레이를 띄움
   *   - false 반환
   * - 로그인 O:
   *   - true 반환
   */
  const ensureAuthed = async () => {
    if (!isAuth) {
      // 오버레이 스택에 로그인 리다이렉트 모달 추가
      await open<boolean>(
        // renderer: close 함수를 받아서 오버레이 컴포넌트를 렌더링
        ({ close }) =>
          React.createElement(LoginRedirectOverlay, { close }),
        {
          blockScroll: true,
          closeOnBackdrop: true,
        },
      );
      return false;
    }
    return true;
  };

  /**
   * 고차함수(HOF) 패턴
   *
   * - 인자: fn: 실제로 실행하고 싶은 액션(함수)
   * - 반환: 로그인 체크가 래핑된 새 함수
   **/
  const requireAuth =
    // Args: 원래 함수가 받을 인자 타입들
    <Args extends unknown[]>(
        fn: (...args: Args) => void | Promise<void>,
      ) =>
      async (...args: Args) => {
        if (!(await ensureAuthed())) return;
        return fn(...args);
      };

  return {
    authed: isAuth,
    requireAuth,
  };
}
