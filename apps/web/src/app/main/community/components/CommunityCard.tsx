// src/components/CommunityCard.tsx
import Card from '@/components/Card';
import { CategoryBadge } from './CategoryBadge';
import { Category } from '@/constants/categorys';
import { relativeTime } from '@/utils/relativeTime';
import { Heart, MessageSquareMore } from 'lucide-react';

import type { PostSummary } from '@/api/posts';

export interface CommunityCardProps {
  post: PostSummary; // 변경: 개별 필드 대신 post 하나로
  isBadge?: boolean; // 배지 표시 여부
}

export function CommunityCard({
  post,
  isBadge = false,
}: CommunityCardProps) {
  const {
    title,
    content, // 이전의 description → content 로 변경
    category,
    likeCount,
    commentCount,
    createdAt,
    user: { nickname },
  } = post;

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-2">
        {isBadge && (
          <div className="flex items-center gap-1">
            <CategoryBadge category={category as Category} />
          </div>
        )}
        <h3 className="text-title2">{title}</h3>
        <p className="text-body">{content}</p>
      </div>
      <div className="flex justify-between items-center">
        {/* 작성자 · 시간 */}
        <label className="text-neutral-500 text-xs">
          {nickname} · {relativeTime(createdAt)}
        </label>
        <div className="flex items-center gap-2">
          {/* 좋아요 */}
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-neutral-500" />
            <span className="text-xs">{likeCount}</span>
          </div>
          {/* 댓글 */}
          <div className="flex items-center gap-1">
            <MessageSquareMore className="w-4 h-4 text-neutral-500" />
            <span className="text-xs">{commentCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
