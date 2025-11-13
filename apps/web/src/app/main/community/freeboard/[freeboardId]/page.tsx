import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import type { FreeboardDetailResponse } from '@/generated/api/models';
import {
  getGetFreeboardPostQueryKey,
  getGetFreeboardPostQueryOptions,
} from '@/generated/api/endpoints/freeboard/freeboard';
import FreeboardDetailSkeleton from './components/FreeboardDetailSkeleton';
import { isAxiosError } from 'axios';
import ClientPage from './ClientPage';

/**
 * 자유 게시판 게시글 상세 페이지 (서버 컴포넌트)
 *
 * @description
 * - 서버에서 게시글 데이터를 프리패치하여 클라이언트에 전달
 * - 클라이언트는 구독 및 인터랙션 처리 담당
 */
export default async function Page({
  params,
}: {
  params: { freeboardId: string };
}) {
  const postId = Number(params.freeboardId);
  if (!Number.isFinite(postId)) return <FreeboardDetailSkeleton />;

  const queryClient = new QueryClient();

  try {
    // 서버에서 캐시 채우기 및 에러 처리 (에러를 던지는 fetchQuery 사용)
    const queryOptions = getGetFreeboardPostQueryOptions(postId);
    await queryClient.fetchQuery(queryOptions);
  } catch (error: unknown) {
    let statusCode: number | null = null;
    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? null;
    }

    if (statusCode === 404) notFound();
    return <FreeboardDetailSkeleton />;
  }

  // 캐시에서 꺼내 초기 props로 전달
  const post = queryClient.getQueryData(
    getGetFreeboardPostQueryKey(postId),
  ) as FreeboardDetailResponse | undefined;

  if (!post) return <FreeboardDetailSkeleton />;

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {/* 클라이언트 트리: 구독/인터랙션/핸들러는 여기서 */}
      <ClientPage postId={postId} initialPost={post} />
    </HydrationBoundary>
  );
}
