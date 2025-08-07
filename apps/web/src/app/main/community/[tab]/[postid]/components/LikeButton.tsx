'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  /** 현재 사용자가 좋아요를 눌렀는지 여부 */
  isLiked: boolean;
  /** 좋아요 수 */
  likeCount: number;
}

/**
 * LikeButton 컴포넌트
 *
 * 게시글의 좋아요 버튼을 렌더링합니다.
 * 클릭 시 좋아요 상태를 낙관적 업데이트 방식으로 반영하며,
 * 실제 API 호출은 추후 연결 필요
 */
export default function LikeButton({
  isLiked,
  likeCount,
}: LikeButtonProps) {
  // 좋아요 상태 및 카운트 상태 관리
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  /** 좋아요 버튼 클릭 핸들러 */
  const handleClick = () => {
    // 낙관적 UI 업데이트 (사용자 반응을 빠르게 반영)
    if (liked) {
      setCount((prev) => prev - 1);
    } else {
      setCount((prev) => prev + 1);
    }
    setLiked((prev) => !prev);

    // TODO: 실제 좋아요 API 요청 연결 필요
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
