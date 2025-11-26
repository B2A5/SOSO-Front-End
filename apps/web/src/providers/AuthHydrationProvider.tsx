import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { getGetCurrentUserQueryKey } from '@/generated/api/endpoints/users/users';
import { getServerCurrentUser } from '@/lib/server-api-client';

/**
 * 인증 정보 Hydration 컴포넌트 (Server Component)
 *
 * - 서버 사이드에서 accessToken 확인
 * - 토큰이 있으면 유저 정보를 SSR Prefetch
 * - HydrationBoundary로 클라이언트에 데이터 전달
 */
export async function AuthHydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 프록시 비활성화 시(HTTP CSR 전용 모드) SSR 인증 불가
  const proxyEnabled =
    process.env.NEXT_PUBLIC_ENABLE_PROXY !== 'false';

  const queryClient = new QueryClient();

  // HTTPS 모드(프록시 활성화)에서만 SSR Prefetch 실행
  if (proxyEnabled) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');

    // 액세스 토큰이 있는 경우에만 유저 정보 서버에서 prefetch
    if (accessToken) {
      await queryClient.prefetchQuery({
        queryKey: getGetCurrentUserQueryKey(),
        queryFn: () => getServerCurrentUser(),
        staleTime: 13 * 60 * 1000, // 13분
      });
    } else {
      // 토큰이 없으면 비로그인 상태로 초기화
      queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
    }
  }
  // HTTP 모드에서는 아무것도 하지 않음 (CSR이 알아서 처리)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
