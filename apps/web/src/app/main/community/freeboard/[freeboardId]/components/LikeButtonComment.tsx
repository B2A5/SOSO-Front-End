// apps/web/src/app/main/community/freeboard/[freeboardId]/components/LikeButtonComment.tsx
'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthGuard, useAuthRestore } from '@/hooks/useAuth';
import { useToggleCommentLike } from '@/generated/api/endpoints/freeboard-comment-like/freeboard-comment-like';
import { getGetCommentsByCursorQueryKey } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';
import { useToast } from '@/hooks/ui/useToast';

interface LikeButtonCommentProps {
  postId: number;
  commentId: number;
  isLiked: boolean;
  likeCount: number;
  icon?: React.ElementType;
}

/**
 * 댓글 좋아요 버튼
 * 동작 순서:
 * 1) 서버로 요청을 보내기 전에 화면의 상태만 먼저 토글하여 즉시 반응을 보여 준다.
 * 2) 요청이 실패하면 저장해 둔 이전 값으로 되돌린다.
 * 3) 요청이 성공하고 서버가 절대값(좋아요 여부, 좋아요 수)을 보내면 그 값으로 화면을 맞춘다.
 * 4) 마지막에 관련 쿼리를 다시 가져와 실제 서버 값과 화면을 일치시킨다.
 */
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
  const { guard } = useAuthGuard();

  // 화면 전용 상태
  const [liked, setLiked] = useState(!!isLiked);
  const [count, setCount] = useState(likeCount);

  // 부모로부터 내려오는 값이 바뀌면 동기화한다.
  useEffect(() => setLiked(!!isLiked), [isLiked]);
  useEffect(() => setCount(likeCount), [likeCount]);

  // 댓글 목록 쿼리 키
  const listKey = getGetCommentsByCursorQueryKey(postId);

  const toggle = useToggleCommentLike({
    mutation: {
      mutationKey: ['toggleCommentLike', postId, commentId],

      // 서버 요청 전에 화면만 즉시 토글하고, 롤백을 위한 스냅샷을 반환한다.
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: listKey });
        const snapshot = { liked, count };

        const next = !liked;
        setLiked(next);
        setCount((c) => Math.max(0, c + (next ? 1 : -1)));

        return { snapshot };
      },

      // 실패하면 화면 상태를 스냅샷으로 되돌린다.
      onError: (_error, _variables, context) => {
        if (context?.snapshot) {
          setLiked(context.snapshot.liked);
          setCount(context.snapshot.count);
        }
        toast('댓글 좋아요 처리 중 오류가 발생했습니다.', 'error');
      },

      // 성공하면 서버가 절대값을 보낸 경우에만 그 값으로 맞춘다.
      // 서버가 불리언만 보낸 경우에는 추가 수정 없이 끝낸다.
      onSuccess: (data) => {
        if (data && typeof data === 'object') {
          const d = data as { isLiked?: boolean; likeCount?: number };
          if (typeof d.isLiked === 'boolean') setLiked(d.isLiked);
          if (typeof d.likeCount === 'number')
            setCount(Math.max(0, d.likeCount));
        }
        toast('좋아요가 반영되었습니다.', 'success');
      },

      // 마지막으로 댓글 목록 데이터를 다시 가져와 실제 값과 화면을 일치시킨다.
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: listKey });
      },
    },
  });

  const handleClick = () =>
    guard(() => {
      if (toggle.isPending) return;
      toggle.mutate({ freeboardId: postId, commentId });
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
