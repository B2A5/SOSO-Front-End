// apps/web/src/app/main/community/freeboard/[freeboardId]/components/LikeButtonPost.tsx
'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuthRestore } from '@/hooks/useAuth';
import { useToggleLike } from '@/generated/api/endpoints/freeboard-like/freeboard-like';
import { getGetPostQueryKey } from '@/generated/api/endpoints/freeboard/freeboard';
import { formatCappedCount } from '@/utils/formatCount';

interface LikeButtonPostProps {
  postId: number;
  isLiked: boolean;
  likeCount: number;
  icon?: React.ElementType;
}

const FREEBOARD_LIST_ROOT_KEY = ['/community/freeboard'] as const;

export default function LikeButtonPost({
  postId,
  isLiked,
  likeCount,
  icon: Icon = Heart,
}: LikeButtonPostProps) {
  const { isRestoring, isAuthenticated } = useAuthRestore();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { guard } = useAuthGuard({
    onUnauthed: () => toast('로그인이 필요합니다.', 'error'),
  });

  // SSR 초기값
  const [liked, setLiked] = useState<boolean>(!!isLiked);
  const [count, setCount] = useState<number>(likeCount);

  // 부모 props 변경 동기화
  useEffect(() => setLiked(!!isLiked), [isLiked]);
  useEffect(() => setCount(likeCount), [likeCount]);

  const toggleLike = useToggleLike();

  const handleClick = () =>
    guard(() => {
      if (toggleLike.isPending) return;

      // 낙관적 업데이트 없이 서버 응답으로만 맞춘다 (혼선 최소화)
      toggleLike.mutate(
        { freeboardId: postId },
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
            toast('좋아요 처리 중 오류가 발생했습니다.', 'error');
          },
          onSettled: () => {
            // 상세/리스트 캐시 최신화
            queryClient.invalidateQueries({
              queryKey: getGetPostQueryKey(postId),
            });
            queryClient.invalidateQueries({
              queryKey: FREEBOARD_LIST_ROOT_KEY,
              exact: false,
            });
          },
        },
      );
    });

  // 🔒 옵션 B: 복원 중엔 비활성 표시(조회수 추가 호출 없음)
  if (isRestoring) {
    return (
      <button
        className="flex items-center gap-1.5 opacity-60 cursor-wait"
        disabled
        aria-label="좋아요 로딩 중"
      >
        <Icon className="inline w-4 h-4 text-neutral-200" />
        <span className="text-neutral-500 text-input2">
          {formatCappedCount(count)}
        </span>
      </button>
    );
  }

  // 복원 완료 후 표준 버튼 (미로그인이어도 guard가 막아줌)
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5"
      disabled={toggleLike.isPending}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
      title={!isAuthenticated ? '로그인이 필요합니다' : undefined}
    >
      <Icon
        className={`inline w-4 h-4 text-neutral-200 transition-colors ${
          liked ? 'fill-soso-600 text-soso-600' : 'fill-transparent'
        }`}
      />
      <span className="text-neutral-500 text-input2">
        {formatCappedCount(count)}
      </span>
    </button>
  );
}
