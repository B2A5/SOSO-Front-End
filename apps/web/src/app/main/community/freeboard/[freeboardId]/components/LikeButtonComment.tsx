'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthGuard } from '@/hooks/useAuth';
import { useToast } from '@/hooks/ui/useToast';
import { formatCappedCount } from '@/utils/formatCount';
import { getGetFreeboardCommentsByCursorQueryKey } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';
import { useToggleFreeboardCommentLike } from '@/generated/api/endpoints/freeboard-comment-like/freeboard-comment-like';
import { clampCount } from '@/utils/clampCount';

interface LikeButtonCommentProps {
  postId: number;
  commentId: number;
  initialLiked: boolean;
  initialLikeCount: number;
}

/**
 * 댓글 좋아요 버튼
 *
 * 전략:
 * - 낙관적 토글(로컬 UI 먼저 반영) → 실패 시 스냅샷으로 롤백 → 성공 시 서버 절대값으로 보정
 * - 마지막엔 관련 쿼리 invalidate로 캐시/화면 동기화
 */
export default function LikeButtonComment({
  postId,
  commentId,
  initialLiked,
  initialLikeCount,
}: LikeButtonCommentProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { guard } = useAuthGuard();

  // UI 전용 상태(부모 props와 동기화됨)
  const [liked, setLiked] = useState(!!initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => setLiked(!!initialLiked), [initialLiked]);
  useEffect(() => setLikeCount(initialLikeCount), [initialLikeCount]);

  // 이 게시글의 댓글 목록 쿼리 키 (취소/무효화에 사용)
  const commentListKey =
    getGetFreeboardCommentsByCursorQueryKey(postId);

  const toggleLike = useToggleFreeboardCommentLike({
    mutation: {
      mutationKey: ['toggleCommentLike', postId, commentId],

      onMutate: async () => {
        // (1) 진행 중/예정인 refetch 취소 → 낙관 업데이트 보존
        await queryClient.cancelQueries({ queryKey: commentListKey });

        // (2) 롤백용 스냅샷
        const snapshot = {
          prevLiked: liked,
          prevLikeCount: likeCount,
        };

        // (3) 낙관적 토글 + 카운트 보정
        setLiked((prev) => {
          const next = !prev;
          const delta = next ? 1 : -1;
          setLikeCount((count) => clampCount(count + delta));
          return next;
        });

        // (4) 스냅샷 전달
        return { snapshot };
      },

      onError: (_error, _variables, onMutateResult) => {
        // 실패 시 스냅샷으로 롤백
        const snap = onMutateResult?.snapshot;
        if (snap) {
          setLiked(snap.prevLiked);
          setLikeCount(snap.prevLikeCount);
        }
        toast('댓글 좋아요 처리 중 오류가 발생했습니다.', 'error');
      },

      onSuccess: () => {
        toast('좋아요가 반영되었습니다.', 'success');
      },

      onSettled: () => {
        // 성공/실패와 무관하게 최종적으로 서버 상태와 동기화
        queryClient.invalidateQueries({
          queryKey: commentListKey,
        });
      },
    },
  });

  // 클릭 시: 가드 통과 후, 중복 요청 방지 & 뮤테이션 트리거
  const handleToggleLike = () =>
    guard(() => {
      if (toggleLike.isPending) return;
      toggleLike.mutate({ freeboardId: postId, commentId });
    });

  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={handleToggleLike}
      className="flex items-center gap-1.5"
      disabled={toggleLike.isPending}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
    >
      <ThumbsUp
        className={`inline w-4 h-4 text-neutral-200 transition-colors ${
          liked ? 'fill-soso-600 text-soso-600' : 'fill-transparent'
        }`}
      />
      <span className="text-neutral-500 text-input2">
        {formatCappedCount(likeCount)}
      </span>
    </button>
  );
}
