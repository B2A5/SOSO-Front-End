import type { GetPostResponse } from '@/api/posts';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_POST: GetPostResponse = {
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
    userType: 'FOUNDER',
  },
};

export async function getPost(
  postId: number,
): Promise<GetPostResponse> {
  await delay(400);
  return { ...MOCK_POST, postId };
}
