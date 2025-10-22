'use client';

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getCommentsByCursor,
  getGetCommentsByCursorQueryKey,
} from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';
import type { FreeboardCommentSummary } from '@/generated/api/models';
import { InfiniteScroll } from '@/components/infiniteScrolls/InfiniteScroll';
import CommentItem from './CommentItem';
import Skeleton from '@/components/loadings/Skeleton';
import { cn } from '@/utils/cn';
import { formatCappedCount } from '@/utils/formatCount';

interface CommentListProps {
  postId: number;
}

/**
 * 댓글 리스트
 * TODO: 백엔드 댓글 총 개수 제공 시 헤더에 추가 예정
 */
export default function CommentList({ postId }: CommentListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: getGetCommentsByCursorQueryKey(postId),
    queryFn: ({ pageParam, signal }) =>
      getCommentsByCursor(
        postId,
        { cursor: pageParam, size: 10, sort: 'LATEST' },
        signal,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ? lastPage.nextCursor : undefined,
  });

  // 페이지 단위로 내려오는 comments를
  // 1. 모두 합치고(flatten)
  // 2. key로 쓸 수 있도록 commentId가 확실한 항목만 남김
  // 3. data가 바뀔 때에만 재계산(성능)
  const comments = useMemo<
    Array<FreeboardCommentSummary & { commentId: number }>
  >(() => {
    const allPages = data?.pages ?? [];
    const allComments = allPages.flatMap(
      (page) => page.comments ?? [],
    );

    return allComments.filter(
      (
        comment,
      ): comment is FreeboardCommentSummary & { commentId: number } =>
        typeof comment.commentId === 'number',
    );
  }, [data]);

  return (
    <section aria-label="댓글 섹션" className="flex-1">
      <h2 id="comments-heading" className="sr-only">
        댓글
      </h2>
      <p className="pb-2" aria-live="polite">
        댓글
        <span className="text-soso-600 pl-1 font-medium">
          {formatCappedCount(comments.length)}
        </span>
        개
      </p>

      <div
        role="region"
        aria-labelledby="comments-heading"
        aria-busy={isFetchingNextPage || isLoading}
      >
        <InfiniteScroll
          items={comments}
          hasNextPage={!!hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          initialLoading={isLoading}
          error={error as Error | null}
          className={cn(
            'max-h-[60vh] overflow-y-auto overflow-x-hidden',
            '[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]',
          )}
        >
          <InfiniteScroll.Skeleton
            skeletonCount={3}
            className="min-h-[60vh]"
          >
            <div aria-hidden="true">
              <Skeleton className="w-full h-24 rounded-lg mb-4" />
            </div>
          </InfiniteScroll.Skeleton>

          <InfiniteScroll.Error>
            <div role="alert" className="py-4 text-center">
              <p className="text-sm text-red-500">
                댓글을 불러오는 중 문제가 발생했습니다.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 rounded-md px-3 py-1 text-sm border"
                aria-label="댓글 다시 불러오기"
              >
                다시 시도
              </button>
            </div>
          </InfiniteScroll.Error>

          <InfiniteScroll.Empty>
            <div className="py-10 text-center text-neutral-500">
              <p>댓글이 없습니다.</p>
            </div>
          </InfiniteScroll.Empty>

          <InfiniteScroll.Contents
            virtualScroll={{
              enabled: true,
              estimateSize: 110,
              overscan: 3,
            }}
            scrollStore={{
              enabled: true,
              storageKey: `comment-scroll-${postId}`,
              resetScroll: false,
            }}
            getItemKey={(
              comment: FreeboardCommentSummary & {
                commentId: number;
              },
            ) => comment.commentId}
            renderItem={(comment) => (
              <CommentItem comment={comment} />
            )}
            gap={8}
            threshold={0.6}
          >
            <InfiniteScroll.Trigger
              loadingText="댓글을 불러오는 중…"
              notMoreText="모든 댓글을 확인했습니다."
            />
          </InfiniteScroll.Contents>
        </InfiniteScroll>
      </div>
    </section>
  );
}
