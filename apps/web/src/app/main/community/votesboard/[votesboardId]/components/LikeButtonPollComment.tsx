'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthGuard } from '@/hooks/useAuth';
import { useToast } from '@/hooks/ui/useToast';
import { formatCappedCount } from '@/utils/formatCount';
import { getGetPollCommentsByCursorQueryKey } from '@/generated/api/endpoints/poll-comment/poll-comment';
import { useTogglePollCommentLike } from '@/generated/api/endpoints/poll-comment-like/poll-comment-like';
import { clampCount } from '@/utils/clampCount';

interface LikeButtonPollCommentProps {
  pollId: number;
  commentId: number;
  initialLiked: boolean;
  initialLikeCount: number;
}

export default function LikeButtonPollComment({
  pollId,
  commentId,
  initialLiked,
  initialLikeCount,
}: LikeButtonPollCommentProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { requireAuth } = useAuthGuard();

  const [liked, setLiked] = useState(!!initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => setLiked(!!initialLiked), [initialLiked]);
  useEffect(() => setLikeCount(initialLikeCount), [initialLikeCount]);

  const commentListKey = getGetPollCommentsByCursorQueryKey(pollId);

  const toggleLike = useTogglePollCommentLike({
    mutation: {
      mutationKey: ['togglePollCommentLike', pollId, commentId],

      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: commentListKey });

        const snapshot = {
          prevLiked: liked,
          prevLikeCount: likeCount,
        };

        setLiked((prev) => {
          const next = !prev;
          const delta = next ? 1 : -1;
          setLikeCount((count) => clampCount(count + delta));
          return next;
        });

        return { snapshot };
      },

      onError: (_error, _variables, onMutateResult) => {
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
        queryClient.invalidateQueries({ queryKey: commentListKey });
      },
    },
  });

  const handleToggleLike = () => {
    if (toggleLike.isPending) return;
    toggleLike.mutate({ pollId, commentId });
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
