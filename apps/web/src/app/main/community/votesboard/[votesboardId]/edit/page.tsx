// apps/web/src/app/main/community/votesboard/[votesboardId]/edit/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { useGetVotePost } from '@/generated/api/endpoints/voteboard/voteboard';
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
 * - 현재 투표 게시글에는 카테고리 스펙이 없으므로,
 *   FreeboardEditPage처럼 카테고리 변경/선택 UI는 제공되지 않습니다.
 *
 * @todo
 * - 백엔드 투표 API에 카테고리 스펙이 추가되면:
 *   1) 상세 응답(VotePostDetailResponse)에 카테고리 필드가 추가되는지 확인하고,
 *   2) VoteboardForm의 기본값 및 UI에 카테고리를 노출/수정할 수 있도록 확장합니다.
 * - 권한이 없거나 게시글이 존재하지 않을 경우 에러 모달 또는 404 처리 추가
 */
export default function VoteboardEditPage() {
  const params = useParams();
  const voteId = Number(params.votesboardId);

  // 투표 게시글 상세 데이터 조회
  const { data, isLoading } = useGetVotePost(voteId);

  return (
    <div className="flex flex-col w-full h-full">
      <Header>
        <Header.Left>
          <Header.CancelButton />
        </Header.Left>
        <Header.Center>투표 글 수정</Header.Center>
      </Header>

      <main className="flex-1 w-full overflow-hidden p-layout">
        {isLoading || !data ? (
          <VoteboardFormSkeleton />
        ) : (
          <VoteboardForm voteId={voteId} initialData={data} />
        )}
      </main>
    </div>
  );
}
