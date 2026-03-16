'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthGuard } from '@/hooks/useAuth';
import { formatCappedCount } from '@/utils/formatCount';
import { useToast } from '@/hooks/ui/useToast';
import { PollDetailResponse } from '@/generated/api/models';
import { clampCount } from '@/utils/clampCount';
import { getGetPollQueryKey } from '@/generated/api/endpoints/poll/poll';
import { useTogglePollLike } from '@/generated/api/endpoints/poll-like/poll-like';

interface VotesBoardLikeProps {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
}

/**
 * 투표게시글 좋아요 버튼
 *
 * 전략:
 * - 낙관적 토글(로컬 UI 먼저 반영) → 실패 시 스냅샷으로 롤백 → 성공 시 토스트
 * - 마지막엔 관련 쿼리 invalidate로 캐시/화면 동기화
 */
export default function VotesBoardLike({
  postId,
  initialLiked,
  initialLikeCount,
}: VotesBoardLikeProps) {
  const queryClient = useQueryClient();
  const { requireAuth } = useAuthGuard();

  // UI 전용 상태(부모 props와 동기화됨)
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // 부모 값 변경 시 동기화
  useEffect(() => setLiked(initialLiked), [initialLiked]);
  useEffect(() => setLikeCount(initialLikeCount), [initialLikeCount]);

  const pollDetailKey = getGetPollQueryKey(postId);

  const toggleLike = useTogglePollLike({
    mutation: {
      mutationKey: ['togglePostLike', postId],

      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: pollDetailKey,
        });

        const snapshot = {
          prevLiked: liked,
          prevLikeCount: likeCount,
          prevPost:
            queryClient.getQueryData<PollDetailResponse>(
              pollDetailKey,
            ),
        };

        setLiked((prev) => {
          const next = !prev;
          const delta = next ? 1 : -1;
          setLikeCount((count) => clampCount(count + delta));
          return next;
        });

        // 쿼리 캐시 동기화
        queryClient.setQueryData<PollDetailResponse>(
          pollDetailKey,
          (old) => {
            if (!old) return old;
            const nextLiked = !(old.isLiked ?? false);
            const nextCount = clampCount(
              old.likeCount + (nextLiked ? 1 : -1),
            );
            return {
              ...old,
              isLiked: nextLiked,
              likeCount: nextCount,
            };
          },
        );

        return { snapshot };
      },

      onError: (_error, _variables, onMutateResult) => {
        // 실패 시 스냅샷으로 UI 롤백
        const snap = onMutateResult?.snapshot;
        if (snap) {
          setLiked(snap.prevLiked);
          setLikeCount(snap.prevLikeCount);
          if (snap.prevPost) {
            queryClient.setQueryData(pollDetailKey, snap.prevPost);
          }
        }
      },

      onSettled: () => {
        // 성공/실패와 무관하게 최종적으로 서버 상태와 동기화
        queryClient.invalidateQueries({
          queryKey: pollDetailKey,
        });
      },
    },
  });

  // 중복 요청 방지 & 뮤테이션 트리거
  const handleToggleLike = () => {
    if (toggleLike.isPending) return;
    toggleLike.mutate({ pollId: postId });
  };

  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={requireAuth(handleToggleLike)}
      className="flex items-center gap-1.5"
      disabled={toggleLike.isPending}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
    >
      <Heart
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
