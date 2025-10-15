'use client';

import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getCommentsByCursor,
  getGetCommentsByCursorQueryKey,
} from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { VirtualList } from '@/components/VirtualList';
import CommentItem from './CommentItem';
import type { FreeboardCommentSummary } from '@/generated/api/models';

interface CommentListProps {
  postId: number;
}

/**
 * 댓글 리스트 (API 기반 + VirtualList + 무한 스크롤)
 * - Orval 자동 생성 API(getCommentsByCursor) 연동
 * - 커서 기반 페이지네이션 + Intersection Observer
 * - TanStack Virtualizer로 성능 최적화
 * @todo 백엔드 댓글 작성자 정보에 userType 필드 추가 필요
 */
export default function CommentList({ postId }: CommentListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: getGetCommentsByCursorQueryKey(postId),
    queryFn: ({ pageParam, signal }) =>
      getCommentsByCursor(
        postId,
        {
          cursor: pageParam,
          size: 10,
          sort: 'LATEST',
        },
        signal,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ? lastPage.nextCursor : undefined,
  });

  // 무한 스크롤 트리거
  useInfiniteScroll({
    targetRef: observerRef,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetching: isFetchingNextPage,
    threshold: 0.4,
    rootRef: scrollRef, // VirtualList 스크롤 영역 내에서 관찰
  });

  const allComments: FreeboardCommentSummary[] =
    data?.pages.flatMap((page) => page.comments ?? []) ?? [];

  if (isError) {
    console.error('댓글 로딩 실패:', error);
    return (
      <p className="text-center text-sm text-red-500 mt-6">
        댓글을 불러오는 중 오류가 발생했습니다.
      </p>
    );
  }

  return (
    <section
      ref={scrollRef}
      className="pt-6 space-y-5 overflow-y-auto max-h-[60vh]"
      aria-label="댓글 목록"
    >
      <VirtualList
        items={allComments}
        parentRef={scrollRef}
        getItemKey={(comment) =>
          comment.commentId ?? `fallback-key-${Math.random()}`
        }
        estimateSize={90} // 댓글 평균 높이 (대략)
        overscan={5}
        storageKey={`comment-scroll-${postId}`}
        renderItem={(comment) => (
          <CommentItem key={comment.commentId} comment={comment} />
        )}
      />

      {/* 무한 스크롤 트리거용 */}
      <div ref={observerRef} className="h-4" />

      {/* 로딩 상태 */}
      {isFetchingNextPage && (
        <p className="text-center text-sm text-neutral-500 py-2">
          댓글 불러오는 중...
        </p>
      )}
    </section>
  );
}
