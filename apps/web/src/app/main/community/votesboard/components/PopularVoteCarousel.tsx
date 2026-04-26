'use client';

import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  getPollsByCursor,
  getGetPollsByCursorQueryKey,
} from '@/generated/api/endpoints/poll/poll';
import { VoteSection } from './VoteSection';
import type { PollSummary } from '@/generated/api/models';

// 마우스 드래그 훅
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
    if (ref.current) ref.current.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const dist = x - startX.current;
    ref.current.scrollLeft = scrollLeft.current - dist;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (ref.current) ref.current.style.cursor = 'grab';
  }, []);

  return {
    ref,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave: onMouseUp,
  };
}

function VoteCardSkeleton() {
  return (
    <div className="min-w-[80vw] sm:min-w-[45vw] rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse h-72" />
  );
}

interface VoteCardProps {
  poll: PollSummary;
}

function VoteCard({ poll }: VoteCardProps) {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col rounded-2xl  overflow-hidden">
      {/* VoteSection 영역: 남은 공간 채움 */}
      <div className="flex-1 overflow-hidden p-4">
        <VoteSection
          pollId={poll.postId}
          title={poll.title}
          voteInfo={poll.voteInfo}
          options={poll.voteOptions}
          hasVoted={poll.hasVoted}
          mode="card"
        />
      </div>
      {/* 버튼: 항상 하단 고정 */}
      <div className="px-4 pb-4">
        <button
          onClick={() =>
            router.push(`/main/community/votesboard/${poll.postId}`)
          }
          className="w-full h-12 rounded-xl border border-neutral-100 dark:border-neutral-600 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          해당 게시물 보러가기
        </button>
      </div>
    </div>
  );
}

export function PopularVoteCarousel() {
  const [dismissed, setDismissed] = useState(false);
  const drag = useDragScroll();

  const { data, isLoading } = useQuery({
    queryKey: getGetPollsByCursorQueryKey({
      status: 'IN_PROGRESS',
      sort: 'LIKE',
      size: 3,
    }),
    queryFn: ({ signal }) =>
      getPollsByCursor(
        { status: 'IN_PROGRESS', sort: 'LIKE', size: 3 },
        signal,
      ),
  });

  const polls = data?.posts ?? [];

  if (dismissed) return null;
  if (!isLoading && polls.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4 border border-neutral-100 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-sm font-semibold text-soso-600">
          실시간 인기 투표
        </span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="인기 투표 캐러셀 닫기"
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1 -mr-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* 카드 트랙: h-105로 모든 카드 동일 높이 */}
      <div
        ref={drag.ref}
        onMouseDown={drag.onMouseDown}
        onMouseMove={drag.onMouseMove}
        onMouseUp={drag.onMouseUp}
        onMouseLeave={drag.onMouseLeave}
        className="flex items-stretch gap-3 px-4 pb-3 h-105 overflow-x-auto snap-x snap-mandatory select-none"
        style={{ scrollbarWidth: 'none', cursor: 'grab' }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <VoteCardSkeleton key={i} />
            ))
          : polls.map((poll) => (
              <div
                key={poll.postId}
                className="snap-center shrink-0 w-[80vw] sm:w-[45vw] h-full"
              >
                <VoteCard poll={poll} />
              </div>
            ))}
      </div>
    </div>
  );
}
