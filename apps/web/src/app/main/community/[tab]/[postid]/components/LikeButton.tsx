'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import { useToggleLike } from '@/generated/api/endpoints/freeboard-like/freeboard-like';

interface LikeButtonProps {
  postId: number;
  isLiked: boolean;
  likeCount: number;
  icon?: React.ElementType;
}

/**
 * 자유게시판 좋아요 버튼
 * - 낙관적 업데이트
 * - 실패 시 롤백 + Toast 안내
 */
export default function LikeButton({
  postId,
  isLiked,
  likeCount,
  icon: Icon = Heart,
}: LikeButtonProps) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  // 외부 데이터 변경 시 동기화
  useEffect(() => setLiked(isLiked), [isLiked]);
  useEffect(() => setCount(likeCount), [likeCount]);

  // 좋아요 토글 mutation
  const { mutateAsync: toggleLike, isPending } = useToggleLike({
    mutation: {
      onSuccess: () => {
        // 서버 반영 후 데이터 최신화
        queryClient.invalidateQueries({
          queryKey: [`/community/freeboard/${postId}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/community/freeboard/${postId}/like`],
        });
      },
      onError: () => {
        // 에러 발생 시 상태 롤백 및 사용자 안내
        setLiked(isLiked);
        setCount(likeCount);
        toast('좋아요 처리 중 오류가 발생했습니다.', 'error');
      },
    },
  });

  // 클릭 핸들러 (낙관적 업데이트)
  const handleClick = async () => {
    if (isPending) return;

    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      await toggleLike({ freeboardId: postId });
    } catch {
      /* onError에서 이미 처리 */
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5"
      disabled={isPending}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
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
