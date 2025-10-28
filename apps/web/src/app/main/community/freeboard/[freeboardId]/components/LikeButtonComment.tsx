// apps/web/src/app/main/community/freeboard/[freeboardId]/components/LikeButtonComment.tsx
'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuthRestore } from '@/hooks/useAuth';
import { useToggleCommentLike } from '@/generated/api/endpoints/freeboard-comment-like/freeboard-comment-like';
import { getGetCommentsByCursorQueryKey } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

interface LikeButtonCommentProps {
  postId: number;
  commentId: number;
  isLiked: boolean;
  likeCount: number;
  icon?: React.ElementType;
}

export default function LikeButtonComment({
  postId,
  commentId,
  isLiked,
  likeCount,
  icon: Icon = ThumbsUp,
}: LikeButtonCommentProps) {
  const { isRestoring, isAuthenticated } = useAuthRestore();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { guard } = useAuthGuard({
    onUnauthed: () => toast('로그인이 필요합니다.', 'error'),
  });

  const [liked, setLiked] = useState<boolean>(!!isLiked);
  const [count, setCount] = useState<number>(likeCount);

  useEffect(() => setLiked(!!isLiked), [isLiked]);
  useEffect(() => setCount(likeCount), [likeCount]);

  const toggle = useToggleCommentLike();

  const handleClick = () =>
    guard(() => {
      if (toggle.isPending) return;

      toggle.mutate(
        { freeboardId: postId, commentId },
        {
          onSuccess: (data) => {
            if (typeof data === 'boolean') {
              const next = data;
              setLiked(next);
              setCount((c) => Math.max(0, c + (next ? 1 : -1)));
            } else if (data && typeof data === 'object') {
              const d = data as {
                isLiked?: boolean;
                likeCount?: number;
              };
              if (typeof d.isLiked === 'boolean') setLiked(d.isLiked);
              if (typeof d.likeCount === 'number')
                setCount(d.likeCount);
            }
          },
          onError: () => {
            toast(
              '댓글 좋아요 처리 중 오류가 발생했습니다.',
              'error',
            );
          },
          onSettled: () => {
            queryClient.invalidateQueries({
              queryKey: getGetCommentsByCursorQueryKey(postId),
            });
          },
        },
      );
    });

  if (isRestoring) {
    return (
      <button
        className="flex items-center gap-1.5 opacity-60 cursor-wait"
        disabled
        aria-label="좋아요 로딩 중"
      >
        <Icon className="inline w-4 h-4 text-neutral-200" />
        <span className="text-neutral-500 text-input2">{count}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5"
      disabled={toggle.isPending}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
      title={!isAuthenticated ? '로그인이 필요합니다' : undefined}
    >
      <Icon
        className={`inline w-4 h-4 text-neutral-200 transition-colors ${
          liked ? 'fill-soso-600 text-soso-600' : 'fill-transparent'
        }`}
      />
      <span className="text-neutral-500 text-input2">{count}</span>
    </button>
  );
}
