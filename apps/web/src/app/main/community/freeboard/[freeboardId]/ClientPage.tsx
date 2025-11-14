'use client';

import { Header } from '@/components/header/Header';
import FreeboardDetail from './components/FreeboardDetail';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import FreeboardDetailSkeleton from './components/FreeboardDetailSkeleton';
import { useGetFreeboardPost } from '@/generated/api/endpoints/freeboard/freeboard';

/**
 * 자유 게시판 게시글 상세 클라이언트 화면
 * @param postId 게시글 ID
 */
export default function ClientPage({ postId }: { postId: number }) {
  const {
    data: post,
    isPending,
    error,
  } = useGetFreeboardPost(postId, {
    query: {
      staleTime: 0, // 언제나 신선하지 않은 것으로 간주
      gcTime: 5_000, // 화면 이탈 시 빠르게 캐시 정리
      refetchOnMount: false, // 좋아요 invalidate로만 강제 리패치
      refetchOnWindowFocus: true, // 뒤로가기/포커스 전환 시 최신화
      refetchOnReconnect: true,
    },
  });

  // TODO: 로딩/에러 처리 구체화 필요
  // postId가 유효하지 않은 경우 처리 필요
  if (!postId) return <FreeboardDetailSkeleton />;
  if (isPending) return <FreeboardDetailSkeleton />;
  if (error || !post) return <div>에러가 발생했습니다.</div>;

  return (
    <main className="space-y-6 pt-12">
      <Header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Header.Left>
          <Header.BackButton /> {/* router.back() 내부 처리 */}
        </Header.Left>
        <Header.Center>자유게시판</Header.Center>
        <Header.Right>
          {/* TODO: onClick 핸들러 추가 */}
          <Header.MenuButton
            onClick={() => {
              /* 바텀시트 열기 */
            }}
          />
        </Header.Right>
      </Header>

      <FreeboardDetail post={post} />

      <section className="px-5 pb-6">
        <CommentList postId={postId} />
        <div className="fixed bottom-16 left-0 right-0 z-50 px-5 py-3">
          <CommentInput postId={postId} />
        </div>
      </section>

      {/* safe-area 보정 */}
      <div className="fixed inset-x-0 bottom-16 z-50 bg-transparent">
        <div className="backdrop-blur-[2px] bg-white/90 w-full h-full absolute top-0 z-[-1]" />
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </main>
  );
}
