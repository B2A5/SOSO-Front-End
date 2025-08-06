'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  const handleClick = () => {
    // 낙관적 업데이트
    if (liked) {
      setCount((prev) => prev - 1);
    } else {
      setCount((prev) => prev + 1);
    }
    setLiked((prev) => !prev);

    // TODO: 실제 API 호출 위치
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5"
    >
      <Heart
        className={`inline w-4 h-4 text-neutral-200 ${
          liked ? 'fill-soso-600 text-soso-600' : 'fill-transparent'
        }`}
      />
      <span className="text-neutral-500 text-input2">{count}</span>
    </button>
  );
}
