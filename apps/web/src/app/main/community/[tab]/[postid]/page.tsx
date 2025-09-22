'use client';

import { Eye } from 'lucide-react';
import type { GetPostResponse } from '@/api/posts';
import LikeButton from '@/app/main/community/[tab]/[postid]/components/LikeButton';
import ImageSlider from '@/components/ImageSlider';
import PostProfile from './components/PostProfile';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';

// 게시글 더미
const dummyPost: GetPostResponse = {
  postId: 1,
  title: 'Lorem Ipsum Dolor Sit Amet',
  content:
    'It is a long established fact that a reader will be distracted by the readable content...',
  category: '맛집',
  imageUrls: [
    'https://picsum.photos/id/1015/600/400',
    'https://picsum.photos/id/1025/600/400',
    'https://picsum.photos/id/1035/600/400',
  ],
  likeCount: 5,
  isLiked: false,
  createdAt: '2025-08-06T10:00:00Z',
  user: {
    nickname: '유진',
    location: '서울시 강남구',
    profileImageUrl: '/somoon/default_somoon.svg',
    userType: 'resident',
  },
};

export default function PostPage() {
  const post = dummyPost;

  return (
    <div>
      <main className="space-y-6 ">
        <div className="p-5 border-b flex flex-col space-y-4 border-neutral-0">
          {/* 카테고리 및 유저 정보 */}
          <div className="flex flex-col space-y-2 ">
            <span className="inline-block text-xs font-bold text-green-950 pl-1">
              {post.category}
            </span>

            <PostProfile
              nickname={post.user.nickname}
              profileImageUrl={post.user.profileImageUrl}
              userType={post.user.userType as 'founder' | 'resident'}
              location={post.user.location}
              createdAt={post.createdAt}
            />
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
          <CommentList postId={post.postId} />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-16 z-50 bg-transparent">
        <CommentInput
          postId={post.postId}
          onSubmit={async (pid, content) => {
            // TODO: API 연동 지점
            // await api.post(`/posts/${pid}/comments`, { content });
            console.log('댓글 등록:', pid, content);

            // TODO: 성공 후 목록 갱신 (리패치 or 낙관적 업데이트)
            // queryClient.invalidateQueries({ queryKey: ['comments', pid] });
          }}
        />
        <div className="backdrop-blur-[2px] bg-white/90 w-full h-full absolute top-0 z-[-1]"></div>
        {/* iOS 안전 영역 보정 */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
