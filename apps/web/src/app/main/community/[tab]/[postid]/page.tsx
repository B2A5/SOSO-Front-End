'use client';

import { Eye, MoreVertical } from 'lucide-react';
import type { GetPostResponse } from '@/api/posts';
import LikeButton from '@/app/main/community/[tab]/[postid]/components/LikeButton';
import ImageSlider from '@/components/ImageSlider';
import PostProfile from './components/PostProfile';
import CommentProfile from './components/CommentProfile';

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

// 댓글 더미
type CommentUser = {
  nickname: string;
  profileImageUrl: string;
  userType: 'founder' | 'resident';
};

type Comment = {
  id: number;
  user: CommentUser;
  content: string;
  likeCount: number;
  edited?: boolean;
  createdAt: string;
};

const dummyComments: Comment[] = [
  {
    id: 11,
    user: {
      nickname: '민수',
      profileImageUrl: '/somoon/default_somoon.svg',
      userType: 'resident',
    },
    content: '오 여기 가봤는데 줄 길더라구요. 꿀팁 감사!',
    likeCount: 3,
    createdAt: '2025-08-07T03:00:00Z',
  },
  {
    id: 12,
    user: {
      nickname: '앨리스',
      profileImageUrl: '/somoon/default_somoon.svg',
      userType: 'founder',
    },
    content: '사진 보니 또 가고 싶네요 :)',
    likeCount: 1,
    edited: true,
    createdAt: '2025-08-07T05:40:00Z',
  },
];

export default function PostPage() {
  const post = dummyPost;

  return (
    <div>
      <main className="p-layout space-y-6 border-b border-neutral-0">
        {/* 카테고리 및 유저 정보 */}
        <div className="flex flex-col space-y-2">
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

        {/* 댓글 리스트 */}
        <section className="pt-6 space-y-4">
          {dummyComments.map((comment) => (
            <CommentProfile
              key={comment.id}
              nickname={comment.user.nickname}
              profileImageUrl={comment.user.profileImageUrl}
              userType={comment.user.userType}
              likeCount={comment.likeCount}
              edited={comment.edited}
              createdAt={comment.createdAt}
              action={<MoreVertical className="w-4 h-4" />}
            >
              {comment.content}
            </CommentProfile>
          ))}
        </section>
      </main>
    </div>
  );
}
