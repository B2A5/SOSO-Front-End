'use client';

import { Eye } from 'lucide-react';
import ImageSlider from '@/components/ImageSlider';
import { UserProfile } from './UserProfile';
import { UserTypeBadge } from './UserTypeBadge';
import { relativeTime } from '@/utils/relativeTime';
import { useGetPost } from '@/generated/api/endpoints/freeboard/freeboard';
import type { FreeboardDetailResponse } from '@/generated/api/models';
import LikeButtonPost from './LikeButtonPost';
import { CategoryChip } from '@/components/chips/CategoryChip';
import { Category } from '../../../constants/categories';

/** 자유게시판 게시글 상세 본문 */
export default function FreeboardDetail({
  postId,
}: {
  postId: number;
}) {
  const { data: post } = useGetPost<FreeboardDetailResponse>(postId, {
    query: {
      enabled: Number.isFinite(postId),
      staleTime: 1000 * 60 * 3, // 3분 캐시
    },
  });

  const author = post?.author;
  const images = post?.images ?? [];
  const imageUrls = images.map((image) => image.imageUrl);
  const viewCount = post?.viewCount ?? 0;
  const category = post?.category ?? '';
  const title = post?.title ?? '';
  const content = post?.content ?? '';
  const createdAt = post?.createdAt ?? '';

  const hasAddress = Boolean(author?.address);
  const hasTime = Boolean(createdAt);
  const hasMetaInfo = hasAddress || hasTime;

  return (
    <div className="p-5 border-b border-neutral-0">
      {/* 카테고리 */}
      {category && (
        <div className="flex items-center gap-1 pb-2">
          <CategoryChip category={category as Category} />
        </div>
      )}

      {/* 작성자 정보 */}
      <UserProfile className="items-start pb-9">
        <UserProfile.Left>
          <UserProfile.Avatar
            url={author?.profileImageUrl}
            size={45}
            alt={`${author?.nickname ?? '사용자'}의 프로필 이미지`}
          />
        </UserProfile.Left>

        <UserProfile.Right>
          <UserProfile.Name
            nickname={author?.nickname ?? ''}
            userType={
              author?.userType && (
                <UserTypeBadge type={author.userType} />
              )
            }
          />

          {hasMetaInfo && (
            <UserProfile.SubContents>
              <div className="text-input2 text-neutral-500">
                {hasAddress && <span>{author?.address}</span>}
                {hasAddress && hasTime && (
                  <span className="mx-1">·</span>
                )}
                {hasTime && <span>{relativeTime(createdAt)}</span>}
              </div>
            </UserProfile.SubContents>
          )}
        </UserProfile.Right>
      </UserProfile>

      {/* 본문 */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Q. {title}</h1>

        {images.length > 0 && (
          <ImageSlider
            images={imageUrls}
            className="w-full min-h-[200px]"
          />
        )}

        {content && (
          <p className="text-textBox text-neutral-1000 min-h-20">
            {content}
          </p>
        )}
      </div>
      {/* 하단 좋아요 + 조회수 */}
      <div className="flex justify-between items-center mt-4">
        <LikeButtonPost
          postId={postId}
          isLiked={post?.isLiked ?? false}
          likeCount={post?.likeCount ?? 0}
        />

        <div className="flex items-center gap-1.5">
          <Eye className="inline w-6 h-6 text-neutral-200" />
          <span className="text-neutral-500 text-input2">
            {viewCount}
          </span>
        </div>
      </div>
    </div>
  );
}
