import Header from '@/components/Header';
import { Eye, Home, Sprout } from 'lucide-react';
import Image from 'next/image';
import type { GetPostResponse } from '@/api/posts';
import { relativeTime } from '@/utils/relativeTime';
import LikeButton from '@/components/buttons/LikeButton';
import ImageSlider from '@/components/ImageSlider';

const dummyPost: GetPostResponse = {
  postId: 1,
  title: 'Lorem Ipsum Dolor Sit Amet',
  content:
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
  category: '맛집',
  imageUrls: [
    'https://picsum.photos/id/1015/600/400', // 자연
    'https://picsum.photos/id/1025/600/400', // 동물
    'https://picsum.photos/id/1035/600/400', // 도시
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
/**
 * PostPage 컴포넌트
 *
 * 게시글 상세 페이지를 렌더링합니다. 게시글의 제목, 내용, 이미지 슬라이더,
 * 작성자 정보, 좋아요 수, 조회 수 등을 표시합니다.
 * 정적인 dummy 데이터를 기반으로 구성되어 있습니다.
 *
 * TODO:
 * - 헤더 타이틀을 실제 게시글 타입에 따라 변경 필요
 * - 백엔드 연동 시 조회수 및 좋아요 기능 연결 필요
 */

export default function PostPage() {
  const post = dummyPost;

  return (
    <div>
      {/* 페이지 헤더 (상단 바) */}
      <Header title="자유글 상세" />

      <main className="p-layout space-y-6 border-b border-neutral-0">
        {/* 카테고리 및 유저 정보 */}
        <div className="flex flex-col space-y-2">
          {/* 카테고리 뱃지 */}
          <span className="inline-block text-xs font-bold text-green-950 pl-1">
            {post.category}
          </span>

          {/* 유저 프로필 */}
          <div className="flex items-center gap-2">
            <Image
              src={post.user.profileImageUrl}
              alt="유저 프로필 이미지"
              className="w-[45px] h-[45px] rounded-full overflow-hidden bg-neutral-50 p-1"
              width={45}
              height={45}
            />
            <div>
              {/* 닉네임 + 유저타입 뱃지 */}
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

              {/* 위치 + 작성 시간 */}
              <p className="text-sm text-neutral-500">
                {post.user.location} · {relativeTime(post.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex flex-col space-y-6">
          {/* 제목 */}
          <h1 className="text-2xl font-bold">Q. {post.title}</h1>

          {/* 이미지 슬라이더 */}
          {post.imageUrls.length > 0 && (
            <ImageSlider
              images={post.imageUrls}
              className="w-full min-h-[200px]"
            />
          )}

          {/* 게시글 내용 */}
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
      </main>
    </div>
  );
}
