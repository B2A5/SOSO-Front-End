'use client';

import { useState } from 'react';
import { useOverlay } from '@/hooks/ui/useOverlay';
import { SortHeader } from '../components/SortHeader';
import { SORT_OPTIONS } from '../constants/sortOptions';
import { SortValue } from '@/types/options.types';
import { PillChipsTab } from '@/components/tabs/PillChipsTab';
import { CATEGORIES } from '../constants/categories';
import { VOTE_STATES, VoteState } from '../constants/votesOptions';
import { VotePostSummaryResponse } from '@/generated/api/models';
import FloatingCategoryMenu from '@/components/buttons/FloatingCategoryMenu';
import CommunityPostList from '../components/CommunityPostList';
import { VoteBoardCard } from './components/VoteBoardCard';
import {
  getVotePostsByCursor,
  getGetVotePostsByCursorQueryKey,
} from '@/generated/api/endpoints/voteboard/voteboard';
import { useInfiniteQuery } from '@tanstack/react-query';
import FloatingButton from '@/components/buttons/FloatingButton';
/**
 * 투표 게시판 클라이언트 메인 페이지
 *
 * @description
 * - [전체/진행중/완료] 상태 탭 제공
 * - 상태별 투표 게시글 목록 표시
 * - 정렬 옵션 제공
 *
 */

export default function VotesboardClientPage() {
  const [sortOption, setSortOption] = useState<SortValue>('LATEST');
  const [voteState, setVoteState] = useState<VoteState>(null);
  const { open } = useOverlay();
  // 무한스크롤 데이터 페칭
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: getGetVotePostsByCursorQueryKey({
      status: voteState ?? undefined,
      sort: sortOption,
    }),
    queryFn: ({ pageParam, signal }) =>
      getVotePostsByCursor(
        {
          status: voteState ?? undefined,
          sort: sortOption,
          cursor: pageParam,
          size: 10,
        },
        signal,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
  const allVotePosts: VotePostSummaryResponse[] =
    data?.pages.flatMap((page) => page.posts ?? []) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const handleFloatingButtonClick = () => {
    open(
      ({ close }) => (
        <FloatingCategoryMenu
          route="votesboard"
          categories={CATEGORIES}
          onClose={() => close(null, { duration: 200 })}
        />
      ),
      {
        backdrop: true,
        closeOnBackdrop: true,
      },
    );
  };

  return (
    <main className="w-full h-full flex flex-col">
      <PillChipsTab<VoteState>
        chips={VOTE_STATES}
        showAll
        activeValue={voteState}
        onChange={setVoteState}
        ariaLabel="투표 상태 선택 필터"
      />
      {/* 필터 헤더 */}
      <SortHeader
        totalCount={totalCount}
        sortOptions={SORT_OPTIONS}
        currentValue={sortOption}
        onFilterChange={setSortOption}
      />

      <CommunityPostList<VotePostSummaryResponse>
        items={allVotePosts}
        hasNextPage={hasNextPage || false}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        initialLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        storageKey="votesboard-post-list-scroll"
        getItemKey={(post, index) => post.id ?? `post-${index}`}
        renderItem={(post) => <VoteBoardCard post={post} />}
      />

      {/* TODO: FloatingButton 추가 */}
      <FloatingButton onClick={handleFloatingButtonClick} />
    </main>
  );
}
