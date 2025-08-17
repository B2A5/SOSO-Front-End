'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  /** 현재 사용자가 좋아요를 눌렀는지 여부 */
  isLiked: boolean;
  /** 좋아요 수 */
  likeCount: number;
  /** 사용할 아이콘 (기본값: Heart) */
  icon?: React.ElementType;
}

/**
 * LikeButton 컴포넌트
 *
 * 게시글/댓글에서 공통으로 좋아요 버튼을 렌더링합니다.
 * icon prop을 통해 아이콘을 다르게 지정할 수 있습니다.
 */
export default function LikeButton({
  isLiked,
  likeCount,
  icon: Icon = Heart, // 기본값 Heart
}: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  const handleClick = () => {
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5"
    >
      <Icon
        className={`inline w-4 h-4 text-neutral-200 ${
          liked ? 'fill-soso-600 text-soso-600' : 'fill-transparent'
        }`}
      />
      <span className="text-neutral-500 text-input2">{count}</span>
    </button>
  );
}
