import { Eye } from 'lucide-react';
import type { GetPostResponse } from '@/api/posts';
import LikeButton from '@/app/main/community/[tab]/[postid]/components/LikeButton';
import ImageSlider from '@/components/ImageSlider';
import UserProfile from './components/UserProfile';

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
      <main className="p-layout space-y-6 border-b border-neutral-0">
        {/* 카테고리 및 유저 정보 */}
        <div className="flex flex-col space-y-2">
          {/* 카테고리 뱃지 */}
          <span className="inline-block text-xs font-bold text-green-950 pl-1">
            {post.category}
          </span>

          {/* 유저 프로필 */}
          <UserProfile
            nickname={post.user.nickname}
            profileImageUrl={post.user.profileImageUrl}
            userType={post.user.userType as 'founder' | 'resident'}
            location={post.user.location}
            createdAt={post.createdAt}
          />
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
