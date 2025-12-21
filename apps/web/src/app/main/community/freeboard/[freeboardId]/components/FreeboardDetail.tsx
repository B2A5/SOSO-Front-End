'use client';

import { Eye } from 'lucide-react';
import ImageSlider from '@/components/ImageSlider';
import { UserProfile } from './UserProfile';
import { UserTypeBadge } from './UserTypeBadge';
import { relativeTime } from '@/utils/relativeTime';
import type { FreeboardDetailResponse } from '@/generated/api/models';
import LikeButtonPost from './LikeButtonPost';
import { CategoryChip } from '@/components/chips/CategoryChip';
import { Category } from '../../../constants/categories';
import { formatCappedCount } from '@/utils/formatCount';

/**
 * 자유 게시판 게시글 상세 컴포넌트
 *
 * @param post 게시글 상세 데이터
 */
export default function FreeboardDetail({
  post,
  blurDataURL,
}: {
  post: FreeboardDetailResponse;
  blurDataURL?: string;
}) {
  const { author } = post;

  return (
    <div className="p-5 border-b border-neutral-0">
      {/* 카테고리 */}
      <div className="flex items-center gap-1 pb-2">
        <CategoryChip
          category={post.category as unknown as Category}
        />
      </div>

      {/* 작성자 */}
      <UserProfile className="items-start pb-6">
        <UserProfile.Left>
          <UserProfile.Avatar
            url={author.profileImageUrl}
            size={45}
            alt={`${author.nickname}의 프로필 이미지`}
          />
        </UserProfile.Left>

        <UserProfile.Right>
          <UserProfile.Name
            nickname={author.nickname}
            userType={<UserTypeBadge type={author.userType} />}
          />
          <UserProfile.SubContents>
            <div className="text-input2 text-neutral-500">
              <span>{author.address}</span>
              <span className="mx-1">·</span>
              <span>{relativeTime(post.createdAt)}</span>
            </div>
          </UserProfile.SubContents>
        </UserProfile.Right>
      </UserProfile>

      {/* 본문 */}
      <div className="flex flex-col space-y-2 pb-6">
        <h1 className="text-2xl font-bold">Q. {post.title}</h1>

        {post.images.length > 0 && (
          <ImageSlider
            images={post.images.map((img) => img.imageUrl)}
            blurDataURL={blurDataURL}
            className="w-full min-h-[200px]"
          />
        )}

        {post.content && (
          <p className="text-textBox text-neutral-1000">
            {post.content}
          </p>
        )}
      </div>

      {/* 하단 */}
      <div className="flex justify-between items-center">
        <LikeButtonPost
          postId={post.postId}
          initialLiked={post.isLiked}
          initialLikeCount={post.likeCount}
        />
        <div className="flex items-center gap-1.5">
          <Eye className="inline w-6 h-6 text-neutral-200" />
          <span className="text-neutral-500 text-input2">
            {formatCappedCount(post.viewCount)}
          </span>
        </div>
      </div>
    </div>
  );
}
