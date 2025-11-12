import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import type { FreeboardDetailResponse } from '@/generated/api/models';

import {
  getGetPostQueryOptions,
  getGetPostQueryKey,
} from '@/generated/api/endpoints/freeboard/freeboard';

import FreeboardDetail from './components/FreeboardDetail';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import FreeboardDetailSkeleton from './components/FreeboardDetailSkeleton';

import { isAxiosError } from 'axios';

export default async function Page({
  params,
}: {
  params: { freeboardId: string };
}) {
  const postId = Number(params.freeboardId);
  if (!Number.isFinite(postId)) return <FreeboardDetailSkeleton />;

  const queryClient = new QueryClient();

  try {
    // 서버에서 캐시 채우기 및 에러 처리 ( 에러를 던지는 fetchQuery 사용)
    const queryOptions = getGetPostQueryOptions(postId);
    await queryClient.fetchQuery(queryOptions);
  } catch (error: unknown) {
    let statusCode: number | null = null;
    if (isAxiosError(error)) {
      statusCode = error.response?.status ?? null;
    }

    if (statusCode === 404) notFound();
    return <FreeboardDetailSkeleton />;
  }

  // 캐시에서 동일 키로 데이터 꺼내서 prop으로 전달
  const post = queryClient.getQueryData(
    getGetPostQueryKey(postId),
  ) as FreeboardDetailResponse | undefined;

  if (!post) return <FreeboardDetailSkeleton />;

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="space-y-6">
        <FreeboardDetail initialPost={post} />

        <section className="px-5 pb-6">
          <CommentList postId={postId} />
          <div className="fixed bottom-16 left-0 right-0 z-50 px-5 py-3">
            <CommentInput postId={postId} />
          </div>
        </section>

        {/* safe-area 보정 */}
        <div className="fixed inset-x-0 bottom-16 z-50 bg-transparent">
          <div className="backdrop-blur-[2px] bg-white/90 w-full h-full absolute top-0 z-[-1]" />
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </main>
    </HydrationBoundary>
  );
}
