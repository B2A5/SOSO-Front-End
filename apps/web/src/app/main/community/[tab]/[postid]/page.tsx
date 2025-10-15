'use client';

import { Eye } from 'lucide-react';
import ImageSlider from '@/components/ImageSlider';
import { UserTypeBadge } from './components/UserTypeBadge';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import { useParams } from 'next/navigation';
import { UserProfile } from './components/UserProfile';
import { relativeTime } from '@/utils/relativeTime';
import { useGetPost } from '@/generated/api/endpoints/freeboard/freeboard';
import type { FreeboardDetailResponse } from '@/generated/api/models';

export default function PostPage() {
  const { postid } = useParams<{ postid: string }>();
  const postId = Number(postid);

  const {
    data: post,
    isLoading,
    isError,
  } = useGetPost<FreeboardDetailResponse>(postId, {
    query: {
      enabled: Number.isFinite(postId),
      staleTime: 1000 * 60 * 3, // 3분 캐시
    },
  });

  if (isLoading)
    return <div className="p-5 text-neutral-500">로딩 중...</div>;
  if (isError || !post)
    return (
      <div className="p-5 text-red-500">
        게시글을 불러올 수 없습니다.
      </div>
    );

  const author = post.author;
  const images = post.imageUrls ?? [];
  const viewCount = post.viewCount ?? 0;
  const category = post.category ?? '';
  const title = post.title ?? '';
  const content = post.content ?? '';
  const createdAt = post.createdAt ?? '';

  const hasAddress = Boolean(author?.address);
  const hasTime = Boolean(createdAt);
  const hasMetaInfo = hasAddress || hasTime;

  return (
    <div>
      <main className="space-y-6">
        <div className="p-5 border-b flex flex-col space-y-4 border-neutral-0">
          {/* 카테고리 */}
          {category && (
            <span className="inline-block text-xs font-bold text-green-950 pl-1">
              {category}
            </span>
          )}

          {/* 작성자 프로필 */}
          <UserProfile className="items-start">
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
                    {hasTime && (
                      <span>{relativeTime(createdAt)}</span>
                    )}
                  </div>
                </UserProfile.SubContents>
              )}
            </UserProfile.Right>
          </UserProfile>
        </div>

        {/* 본문 */}
        <div className="flex flex-col space-y-6 px-5">
          <h1 className="text-2xl font-bold">Q. {title}</h1>

          {images.length > 0 && (
            <ImageSlider
              images={images}
              className="w-full min-h-[200px]"
            />
          )}

          {content && (
            <p className="text-textBox text-neutral-1000">
              {content}
            </p>
          )}

          {/* 조회수 */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-1.5">
              <Eye className="inline w-6 h-6 text-neutral-200" />
              <span className="text-neutral-500 text-input2">
                {viewCount}
              </span>
            </div>
          </div>
        </div>

        {/* 댓글 */}
        {post.postId && (
          <div className="px-5 space-y-4">
            <CommentList postId={post.postId} />
            <CommentInput postId={post.postId} />
          </div>
        )}
      </main>

      {/* 하단 배경 */}
      <div className="fixed inset-x-0 bottom-16 z-50 bg-transparent">
        <div className="backdrop-blur-[2px] bg-white/90 w-full h-full absolute top-0 z-[-1]" />
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
