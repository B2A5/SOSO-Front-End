'use client';

import { Eye } from 'lucide-react';
import type { GetPostResponse } from '@/api/posts';
import LikeButton from '@/app/main/community/[tab]/[postid]/components/LikeButton';
import ImageSlider from '@/components/ImageSlider';
import { UserTypeBadge } from './components/UserTypeBadge';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import { useParams } from 'next/navigation';
import { getPost } from './components/mock/mockPosts';
import { useQuery } from '@tanstack/react-query';
import { UserType } from '@/types/user.types';
import { UserProfile } from './components/UserProfile';

export default function PostPage() {
  const { postid } = useParams<{ postid: string }>();
  const postId = Number(postid);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<GetPostResponse>({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: Number.isFinite(postId),
  });

  if (isLoading) return <div className="p-5">로딩 중...</div>;
  if (isError || !post)
    return <div className="p-5">게시글을 불러올 수 없습니다.</div>;

  return (
    <div>
      <main className="space-y-6 ">
        <div className="p-5 border-b flex flex-col space-y-4 border-neutral-0">
          {/* 카테고리 및 유저 정보 */}
          <div className="flex flex-col space-y-2 ">
            <span className="inline-block text-xs font-bold text-green-950 pl-1">
              {post.category}
            </span>

            <UserProfile
              nickname={post.user.nickname}
              profileImageUrl={post.user.profileImageUrl}
              size={45}
              className="items-start"
            >
              <UserProfile.Avatar className="w-[45px] h-[45px] max-w-none" />
              <UserProfile.Right>
                <UserProfile.Header>
                  <UserProfile.Name />
                  <UserProfile.Badge>
                    <UserTypeBadge
                      type={post.user.userType as UserType}
                    />
                  </UserProfile.Badge>
                </UserProfile.Header>

                <UserProfile.Body>
                  {(post.user.location || post.createdAt) && (
                    <UserProfile.Meta className="mt-0">
                      {post.user.location && (
                        <UserProfile.Location
                          value={post.user.location}
                        />
                      )}
                      {post.user.location && post.createdAt && (
                        <UserProfile.Meta.Separator />
                      )}
                      {post.createdAt && (
                        <UserProfile.Time value={post.createdAt} />
                      )}
                    </UserProfile.Meta>
                  )}
                </UserProfile.Body>
              </UserProfile.Right>
            </UserProfile>
          </div>

          {/* 본문 */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-2xl font-bold">Q. {post.title}</h1>

            {post.imageUrls.length > 0 && (
              <ImageSlider
                images={post.imageUrls}
                className="w-full min-h-[200px]"
              />
            )}

            <p className="text-textBox text-neutral-1000">
              {post.content}
            </p>
          </div>

          {/* 좋아요 / 조회수 */}
          <div className="flex justify-between items-center mt-4">
            <LikeButton
              isLiked={post.isLiked}
              likeCount={post.likeCount}
            />
            <div className="flex items-center gap-1.5">
              <Eye className="inline w-6 h-6 text-neutral-200" />
              <span className="text-neutral-500 text-input2">30</span>
            </div>
          </div>
        </div>

        {/* 댓글 리스트 */}
        <div className="px-5 space-y-4">
          {/* <div>댓글 {post.commentCount}개</div> */}
          <CommentList postId={post.postId} />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-16 z-50 bg-transparent">
        <CommentInput postId={post.postId} />
        <div className="backdrop-blur-[2px] bg-white/90 w-full h-full absolute top-0 z-[-1]" />
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
