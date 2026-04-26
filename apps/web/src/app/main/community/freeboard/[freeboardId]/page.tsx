import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getGetFreeboardPostQueryOptions } from '@/generated/api/endpoints/freeboard/freeboard';
import FreeboardDetailSkeleton from './components/FreeboardDetailSkeleton';
import { isAxiosError } from 'axios';
import ClientPage from './ClientPage';
import { getBlurDataURL } from '@/utils/getBlurDataURL';

/**
 * 자유 게시판 게시글 상세 페이지 (서버 컴포넌트)
 *
 * @description
 * - 서버에서 게시글 데이터를 프리패치
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

  let blurImageUrls: (string | undefined)[] = [];

  try {
    // 서버에서 캐시 채우기 및 에러 처리 (에러를 던지는 fetchQuery 사용)
    const queryOptions = getGetFreeboardPostQueryOptions(postId);
    await queryClient.fetchQuery(queryOptions);

    const post = queryClient.getQueryData(queryOptions.queryKey);

    // 블러 데이터 URL 생성
    const imageUrls = post?.images ?? [];

    blurImageUrls = await Promise.all(
      imageUrls.map((img) => {
        if (!img?.imageUrl) return undefined;

        return getBlurDataURL(img.imageUrl, {
          size: 10,
          blur: 2,
          quality: 40,
        });
      }),
    );
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        notFound();
      }
    }

    throw error;
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientPage postId={postId} blurDataUrls={blurImageUrls} />
    </HydrationBoundary>
  );
}
