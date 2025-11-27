import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  getGetCurrentUserQueryKey,
} from '@/generated/api/endpoints/users/users';
import { ApiError } from '@/lib/api-error';
import type { UserResponse } from '@/generated/api/models';
import { useToast } from './ui/useToast';
import { useLogout } from './useLogout';

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

  console.log('[useAuth] isAuth:', !!query.data, 'user:', query.data);

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
 * 인증 가드 Hook (기존 코드 호환성 유지)
 *
 * ## 반환값
 * - `authed`: 인증 여부 (boolean)
 * - `guard(fn)`: 인증된 경우에만 fn 실행, 아니면 토스트 표시
 * - `ensureAuthed()`: 인증 여부 체크, false면 토스트 표시
 *
 * ## 레거시 호환
 * 기존 코드에서 사용하던 guard/ensureAuthed 패턴을 유지합니다.
 * 내부적으로는 새로운 useAuth()를 사용하여 SSR 최적화를 활용합니다.
 *
 */
export function useAuthGuard(
  options: { onUnauthed?: () => void } = {},
) {
  const { isAuth } = useAuth();
  const toast = useToast();

  // 비로그인 기본 처리: 토스트 표시 (기존 동작 유지)
  // 옵션으로 커스텀 동작 지정 가능 (예: 리다이렉트)
  const onUnauthed =
    options.onUnauthed ??
    (() => toast('로그인이 필요합니다.', 'error'));

  /**
   * 인증된 경우에만 함수 실행
   * @param fn - 실행할 함수
   */
  const guard = (fn: () => void | Promise<void>) => {
    if (!isAuth) {
      onUnauthed();
      return;
    }
    return fn();
  };

  /**
   * 인증 여부 확인 (조기 리턴 패턴에 사용)
   * @returns 인증 여부
   */
  const ensureAuthed = () => {
    if (!isAuth) {
      onUnauthed();
      return false;
    }
    return true;
  };

  return {
    /** 인증 여부 */
    authed: isAuth,
    /** 인증된 경우에만 fn 실행 */
    guard,
    /** 인증 여부 확인 후 false면 onUnauthed 실행 */
    ensureAuthed,
  };
}
