'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthGuard, useAuthRestore } from '@/hooks/useAuth';
import { useToggleCommentLike } from '@/generated/api/endpoints/freeboard-comment-like/freeboard-comment-like';
import { useToast } from '@/hooks/ui/useToast';
import { getGetCommentsByCursor1QueryKey } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

interface LikeButtonCommentProps {
  postId: number;
  commentId: number;
  isLiked: boolean;
  likeCount: number;
  icon?: React.ElementType;
}

// 음수 방지(보정) 헬퍼
const clampNonNegative = (n: number) => (n < 0 ? 0 : n);

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
  isLiked,
  likeCount,
  icon: Icon = ThumbsUp,
}: LikeButtonCommentProps) {
  const { isRestoring, isAuthenticated } = useAuthRestore();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { guard } = useAuthGuard();

  // UI 전용 상태(부모 props와 동기화됨)
  const [isLikedLocal, setIsLikedLocal] = useState(!!isLiked);
  const [likeCountLocal, setLikeCountLocal] = useState(likeCount);

  useEffect(() => setIsLikedLocal(!!isLiked), [isLiked]);
  useEffect(() => setLikeCountLocal(likeCount), [likeCount]);

  // 이 게시글의 댓글 목록 쿼리 키 (취소/무효화에 사용)
  const commentListKey = getGetCommentsByCursor1QueryKey(postId);

  const toggle = useToggleCommentLike({
    mutation: {
      mutationKey: ['toggleCommentLike', postId, commentId],

      onMutate: async () => {
        // (1) 진행 중/예정인 refetch 취소 → 낙관 업데이트 보존
        await queryClient.cancelQueries({ queryKey: commentListKey });

        // (2) 롤백용 스냅샷
        const snapshot = {
          isLiked: isLikedLocal,
          likeCount: likeCountLocal,
        };

        // (3) 낙관적 토글 + 카운트 보정
        setIsLikedLocal((prev) => {
          const next = !prev;
          const delta = next ? 1 : -1;
          setLikeCountLocal((count) =>
            clampNonNegative(count + delta),
          );
          return next;
        });

        // (4) 스냅샷 전달
        return { snapshot };
      },

      onError: (_error, _variables, onMutateResult) => {
        // 실패 시 스냅샷으로 롤백
        const snap = onMutateResult?.snapshot;
        if (snap) {
          setIsLikedLocal(snap.isLiked);
          setLikeCountLocal(snap.likeCount);
        }
        toast('댓글 좋아요 처리 중 오류가 발생했습니다.', 'error');
      },

      onSuccess: (data) => {
        // 서버가 불리언만 주는 토글 결과 대응
        if (typeof data === 'boolean') {
          setIsLikedLocal(data);
          toast('좋아요가 반영되었습니다.', 'success');
          return;
        }
      },

      onSettled: () => {
        // 성공/실패와 무관하게 최종적으로 서버 상태와 동기화
        queryClient.invalidateQueries({ queryKey: commentListKey });
      },
    },
  });

  // 클릭 시: 가드 통과 후, 중복 요청 방지 & 뮤테이션 트리거
  const handleClick = () =>
    guard(() => {
      if (toggle.isPending) return;
      toggle.mutate({ freeboardId: postId, commentId });
    });

  // 인증 복원 중임을 명시(시각적 피드백)
  if (isRestoring) {
    return (
      <button
        className="flex items-center gap-1.5 opacity-60 cursor-wait"
        disabled
        aria-label="좋아요 로딩 중"
        type="button"
      >
        <Icon className="inline w-4 h-4 text-neutral-200" />
        <span className="text-neutral-500 text-input2">
          {likeCountLocal}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isLikedLocal}
      onClick={handleClick}
      className="flex items-center gap-1.5"
      disabled={toggle.isPending}
      aria-label={isLikedLocal ? '좋아요 취소' : '좋아요'}
      title={!isAuthenticated ? '로그인이 필요합니다' : undefined}
    >
      <Icon
        className={`inline w-4 h-4 text-neutral-200 transition-colors ${
          isLikedLocal
            ? 'fill-soso-600 text-soso-600'
            : 'fill-transparent'
        }`}
      />
      <span className="text-neutral-500 text-input2">
        {likeCountLocal}
      </span>
    </button>
  );
}
