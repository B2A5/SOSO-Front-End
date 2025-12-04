import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import {
  getFreeboardPostsByCursor,
  getGetFreeboardPostsByCursorQueryKey,
} from '@/generated/api/endpoints/freeboard/freeboard';
import ClientPage from './ClientPage';

/**
 * 자유 게시판 메인 페이지 (서버 컴포넌트)
 *
 * @description
 * - 전체 카테고리
 * - 최신순 정렬
 * - 10개 게시글 프리패치
 */

export default async function FreeboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: getGetFreeboardPostsByCursorQueryKey({
      category: undefined,
      sort: 'LATEST',
    }),
    queryFn: async ({ signal }) =>
      getFreeboardPostsByCursor(
        { category: undefined, sort: 'LATEST', size: 10 },
        signal,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
