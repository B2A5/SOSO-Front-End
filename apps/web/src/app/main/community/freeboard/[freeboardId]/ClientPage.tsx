'use client';

import { Header } from '@/components/header/Header';
import FreeboardDetail from './components/FreeboardDetail';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import FreeboardDetailSkeleton from './components/FreeboardDetailSkeleton';
import { useGetFreeboardPost } from '@/generated/api/endpoints/freeboard/freeboard';
import { useAuthRestore } from '@/hooks/useAuth';
import ErrorFallback from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * 자유 게시판 게시글 상세 클라이언트 화면
 * @param postId 게시글 ID
 * @param blurDataUrls 게시글 이미지의 블러 URL
 */
export default function ClientPage({
  postId,
  blurDataUrls,
}: {
  postId: number;
  blurDataUrls?: (string | undefined)[] | undefined;
}) {
  const { isAuthenticated } = useAuthRestore();
  const {
    data: post,
    isPending,
    error,
    refetch,
  } = useGetFreeboardPost(postId, {
    query: {
      staleTime: 0, // 언제나 신선하지 않은 것으로 간주
      gcTime: 5_000, // 화면 이탈 시 빠르게 캐시 정리
      refetchOnMount: isAuthenticated ? 'always' : false, // 로그인 사용자만 항상 최신화
      refetchOnWindowFocus: true, // 뒤로가기/포커스 전환 시 최신화
      refetchOnReconnect: true,
    },
  });

  if (!postId) return <FreeboardDetailSkeleton />;
  if (isPending) return <FreeboardDetailSkeleton />;
  if (error || !post) {
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

        <div className="px-5 pt-16">
          <ErrorFallback
            message="게시글을 불러오는 중 오류가 발생했습니다."
            onRetry={() => {
              refetch();
            }}
          />
        </div>
      </main>
    );
  }

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

      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            message={error?.message}
            onRetry={resetErrorBoundary}
          />
        )}
      >
        <FreeboardDetail post={post} blurDataUrls={blurDataUrls} />
      </ErrorBoundary>

      <section className="px-5 pb-6">
        <CommentList
          postId={postId}
          initialCount={post.commentCount}
        />
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
