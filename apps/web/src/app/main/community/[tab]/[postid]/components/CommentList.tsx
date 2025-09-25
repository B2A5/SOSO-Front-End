'use client';

import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Comment } from '@/types/comment.types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { mockGetCommentsByCursor } from './mock/comment.mock';
import CommentItem from './CommentItem';

interface CommentListProps {
  postId: number;
}

/**
 * 댓글 리스트를 무한 스크롤로 렌더링하는 컴포넌트입니다.
 * - 커서 기반 페이지네이션 방식 사용
 * - mock API 기반 데이터 사용
 *
 * @param {number} postId - 댓글을 불러올 게시글 ID
 */
export default function CommentList({ postId }: CommentListProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ['comments', postId],
      queryFn: ({ pageParam }) =>
        mockGetCommentsByCursor({
          postId,
          cursor: pageParam,
          size: 10,
        }),
      initialPageParam: '1',
      getNextPageParam: (lastPage) =>
        lastPage.nextCursor.hasNext
          ? lastPage.nextCursor.cursor
          : undefined,
    });

  // Intersection Observer로 무한스크롤 트리거 설정
  useInfiniteScroll({
    targetRef: observerRef,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetching,
    threshold: 0.3,
  });

  const allComments: Comment[] =
    data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <section className="pt-6 space-y-4">
      {allComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {/* Intersection Observer용 타겟 */}
      <div ref={observerRef} className="h-4" />

      {/* 로딩 상태 표시 */}
      {isFetching && (
        <p className="text-center text-sm text-neutral-500">
          댓글 불러오는 중...
        </p>
      )}
    </section>
  );
}
