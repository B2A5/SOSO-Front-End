// src/components/CommunityCard.tsx
import Image from 'next/image';
import Card from '@/components/Card';
import { CategoryChip } from '@/components/chips/CategoryChip';
import { Category } from '../constants/categories';
import { relativeTime } from '@/utils/relativeTime';
import { Heart, MessageSquareMore } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCount } from '@/utils/formatCount';
import type { FreeboardSummary } from '@/generated/api/models';

export interface FreeBoardCardProps {
  post: FreeboardSummary;
  isChip?: boolean; // 칩 표시 여부
}

export function FreeBoardCard({
  post,
  isChip = false,
}: FreeBoardCardProps) {
  const {
    postId,
    title,
    contentPreview,
    category,
    likeCount,
    commentCount,
    createdAt,
    author,
  } = post;

  const router = useRouter();

  const handleOnClick = () => {
    router.push(`/main/community/freeboard/${postId}`);
  };

  return (
    <Card
      className="w-full flex flex-col gap-2"
      onClick={handleOnClick}
    >
      {isChip && category && (
        <div className="flex items-center gap-1">
          <CategoryChip category={category as Category} />
        </div>
      )}
      <div className="flex flex-row justify-between items-center gap-4">
        <section className="flex flex-col gap-1">
          <h3 className="text-title2 truncate" title={title}>
            {title}
          </h3>
          <p className="text-body truncate" title={contentPreview}>
            {contentPreview}
          </p>
        </section>
        {post.thumbnailUrl && (
          <Image
            src={post.thumbnailUrl}
            alt="게시글 썸네일 이미지"
            width={55}
            height={55}
            className="w-[55px] h-[55px] object-cover rounded-md flex-shrink-0"
          />
        )}
      </div>

      <section className="flex justify-between items-center">
        {/* 작성자 · 시간 */}
        <span className="text-neutral-500 text-xs">
          {author?.nickname ?? '알 수 없음'} ·{' '}
          {createdAt ? relativeTime(createdAt) : ''}
        </span>
        <div className="flex items-center gap-2">
          {/* 좋아요 */}
          <div
            className="flex items-center gap-1"
            aria-label={`좋아요 ${likeCount ?? 0}개`}
          >
            <Heart className="w-4 h-4 text-neutral-500" />
            <span className="text-xs">{formatCount(likeCount)}</span>
          </div>
          {/* 댓글 */}
          <div
            className="flex items-center gap-1"
            aria-label={`댓글 ${commentCount ?? 0}개`}
          >
            <MessageSquareMore className="w-4 h-4 text-neutral-500" />
            <span className="text-xs">
              {formatCount(commentCount)}
            </span>
          </div>
        </div>
      </section>
    </Card>
  );
}
