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
  const cookieStore = cookies();

  const accessToken = cookieStore.get('accessToken');
  const queryClient = new QueryClient();

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
