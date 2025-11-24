import { useQueryClient } from '@tanstack/react-query';
import { useLogout as useLogoutMutation } from '@/generated/api/endpoints/auth/auth';
import { getGetCurrentUserQueryKey } from '@/generated/api/endpoints/users/users';

/**
 * 로그아웃 Hook
 *
 * ## 반환값
 * - `logout`: 로그아웃 함수
 * - `isPending`: 로그아웃 진행 중 여부
 *
 * ## 사용 예시
 * ```tsx
 * const { logout, isPending } = useLogout();
 *
 * const handleLogout = async () => {
 *   logout();
 *   // onSuccess에서 자동으로 리다이렉트 처리
 * };
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useLogoutMutation({
    mutation: {
      /**
       * 로그아웃 성공 시
       * - 모든 React Query 캐시 초기화
       * - 유저 정보를 명시적으로 null 설정
       */
      onSuccess: () => {
        queryClient.clear();
        queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
      },

      /**
       * 로그아웃 실패 시에도 클라이언트 상태는 초기화 (안전장치)
       * - 쿠키가 이미 만료되었거나 네트워크 에러일 수 있음
       */
      onError: (error) => {
        console.error('[useLogout] 로그아웃 API 실패:', error);
        queryClient.clear();
        queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
      },
    },
  });

  return {
    logout,
    isPending,
  };
}
