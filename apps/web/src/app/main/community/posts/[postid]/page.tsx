import Header from '@/components/Header';
import { Eye, Home, Sprout } from 'lucide-react';
import Image from 'next/image';
import type { GetPostResponse } from '@/api/posts';

const dummyPost: GetPostResponse = {
  postId: 1,
  title: 'Lorem Ipsum Dolor Sit Amet',
  content:
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
  category: '맛집',
  imageUrls: [],
  likeCount: 5,
  isLiked: false,
  createdAt: '2025-08-06T10:00:00Z',
  user: {
    nickname: '유진짱',
    location: '서울시 강남구',
    profileImageUrl: '/somoon/default_somoon.svg',
    userType: 'resident',
  },
};

export default function PostPage() {
  const post = dummyPost;

  return (
    <div>
      <Header title={post.title} />
      <main className="p-layout space-y-6 border-b border-neutral-0">
        {/* 카테고리 뱃지 - TODO 스타일 확인 필요*/}
        <div className="flex flex-col space-y-2">
          <span className="inline-block text-xs font-bold text-green-950 pl-1">
            {post.category}
          </span>

          {/* 유저 정보 */}
          <div className="flex items-center gap-2">
            <Image
              src={post.user.profileImageUrl}
              alt="유저 프로필 이미지"
              className="w-[45px] h-[45px] rounded-full overflow-hidden bg-neutral-50 p-1"
              width={45}
              height={45}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-body font-bold">
                  {post.user.nickname}
                </h2>
                <div className="text-[8px] px-1 py-0.5 rounded-full text-white bg-soso-600 flex gap-0.5 items-center">
                  {post.user.userType === 'founder' ? (
                    <>
                      창업자
                      <Sprout className="w-2 h-2" />
                    </>
                  ) : (
                    <>
                      주민
                      <Home className="w-2 h-2" />
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                {post.user.location}
              </p>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-2xl font-bold">Q. {post.title}</h1>
          <p className="text-textBox">{post.content}</p>
        </div>

        {/* 좋아요/조회수 */}
        <div className="flex justify-between items-center mt-4">
          <div>❤️ 좋아요 {post.likeCount}</div>
          <div className="flex items-center gap-2">
            <Eye className="inline w-6 h-6 text-neutral-200" />
            <span className="text-neutral-500 text-input2">30</span>
          </div>
        </div>
      </main>
    </div>
  );
}
