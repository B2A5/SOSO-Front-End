import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import ClientPage from './ClientPage';
import { getGetVotesboardQueryOptions } from '@/generated/api/endpoints/votesboard/votesboard';

/**
 * 투표 게시판 게시글 상세 페이지 (서버 컴포넌트)
 *
 * @description
 * - 서버에서 게시글 데이터를 프리패치
 * - 클라이언트는 구독 및 인터랙션 처리 담당
 */
export default async function VotesBoardDetailPage({
  params,
}: {
  params: { votesboardId: string };
}) {
  const votesboardId = Number(params.votesboardId);
  const queryClient = new QueryClient();

  try {
    const queryOptions = getGetVotesboardQueryOptions(votesboardId);
    await queryClient.fetchQuery(queryOptions);
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
      <ClientPage votesboardId={votesboardId} />
    </HydrationBoundary>
  );
}
