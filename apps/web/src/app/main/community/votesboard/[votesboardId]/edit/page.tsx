// apps/web/src/app/main/community/votesboard/[votesboardId]/edit/page.tsx
'use client';

import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { useGetVotesboard } from '@/generated/api/endpoints/votesboard/votesboard';
import { VoteboardFormSkeleton } from '../../components/VoteBoardForm.Skeleton';
import { VoteboardForm } from '../../components/VoteboardForm';

/**
 * 투표 글 수정 페이지
 *
 * @description
 * 기존 투표 게시글을 수정하는 페이지입니다.
 * URL 파라미터에서 투표 게시글 ID를 받아 상세 데이터를 로딩하고,
 * VoteboardForm 컴포넌트를 통해 수정 UI를 제공합니다.
 *
 * @remarks
 * - 게시글 데이터 로딩 중에는 VoteboardFormSkeleton을 표시합니다.
 * - 로딩 완료 후 VoteboardForm에 voteId와 initialData를 전달합니다.
 */

export default function VoteboardEditPage() {
  const params = useParams();
  const voteId = Number(params.votesboardId);

  // 투표 게시글 상세 데이터 조회
  const { data, isLoading, error } = useGetVotesboard(voteId);

  if (!isLoading && (!data || error)) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Header>
        <Header.Left>
          <Header.CancelButton />
        </Header.Left>
        <Header.Center>투표 글 수정</Header.Center>
      </Header>

      <main className="flex-1 w-full overflow-hidden p-layout">
        {isLoading ? (
          <VoteboardFormSkeleton />
        ) : (
          <VoteboardForm voteboardId={voteId} initialData={data} />
        )}
      </main>
    </div>
  );
}
