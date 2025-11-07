'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthGuard, useAuthRestore } from '@/hooks/useAuth';
import { getGetPostQueryKey } from '@/generated/api/endpoints/freeboard/freeboard';
import { formatCappedCount } from '@/utils/formatCount';
import { useToast } from '@/hooks/ui/useToast';
import { useToggleLike2 } from '@/generated/api/endpoints/freeboard-like/freeboard-like';

interface LikeButtonPostProps {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
}

// 음수 방지(보정) 헬퍼
const clampMin0 = (n: number) => (n < 0 ? 0 : n);

/**
 * 게시글 좋아요 버튼
 *
 * 전략:
 * - 낙관적 토글(로컬 UI 먼저 반영) → 실패 시 스냅샷으로 롤백 → 성공 시 토스트
 * - 마지막엔 관련 쿼리 invalidate로 캐시/화면 동기화
 */
export default function LikeButtonPost({
  postId,
  initialLiked,
  initialLikeCount,
}: LikeButtonPostProps) {
  const { isRestoring } = useAuthRestore();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { guard } = useAuthGuard();

  // UI 전용 상태(부모 props와 동기화됨)
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // 부모 값 변경 시 동기화
  useEffect(() => setLiked(initialLiked), [initialLiked]);
  useEffect(() => setLikeCount(initialLikeCount), [initialLikeCount]);

  // 이 게시글 상세 쿼리 키 (취소/무효화에 사용)
  const postDetailKey = getGetPostQueryKey(postId);

  const toggleLike = useToggleLike2({
    mutation: {
      mutationKey: ['togglePostLike', postId],

      onMutate: async () => {
        // (1) 진행 중/예정인 refetch 취소 → 낙관 업데이트가 덮어쓰여지지 않도록
        await queryClient.cancelQueries({ queryKey: postDetailKey });

        // (2) 롤백용 스냅샷 저장
        const snapshot = {
          prevLiked: liked,
          prevLikeCount: likeCount,
        };

        // (3) 낙관적 토글 + 카운트 보정(음수 방지)
        setLiked((prev) => {
          const next = !prev;
          const delta = next ? 1 : -1;
          setLikeCount((count) => clampMin0(count + delta));
          return next;
        });

        // (4) 스냅샷을 onError/onSettled에 전달
        return { snapshot };
      },

      onError: (_error, _variables, onMutateResult) => {
        // 실패 시 스냅샷으로 UI 롤백
        const snap = onMutateResult?.snapshot;
        if (snap) {
          setLiked(snap.prevLiked);
          setLikeCount(snap.prevLikeCount);
        }
        toast('좋아요 처리 중 오류가 발생했습니다.', 'error');
      },

      onSuccess: () => {
        toast('좋아요가 반영되었습니다.', 'success');
      },

      onSettled: () => {
        // 성공/실패와 무관하게 최종적으로 서버 상태와 동기화
        queryClient.invalidateQueries({ queryKey: postDetailKey });
      },
    },
  });

  // 클릭 시: 가드 통과 후, 중복 요청 방지 & 뮤테이션 트리거
  const handleToggleLike = () =>
    guard(() => {
      if (toggleLike.isPending) return;
      toggleLike.mutate({ freeboardId: postId });
    });

  // 인증 복원 중임을 명시(시각적 피드백)
  if (isRestoring) {
    return (
      <button
        className="flex items-center gap-1.5 opacity-60 cursor-wait"
        disabled
        aria-label="좋아요 로딩 중"
      >
        <Heart className="inline w-4 h-4 text-neutral-200" />
        <span className="text-neutral-500 text-input2">
          {formatCappedCount(likeCount)}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={handleToggleLike}
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
