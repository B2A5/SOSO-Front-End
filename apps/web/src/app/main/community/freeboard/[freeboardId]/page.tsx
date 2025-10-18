'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import FreeboardDetail from './components/FreeboardDetail';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';
import FreeboardDetailSkeleton from './components/FreeboardDetailSkeleton';

/** 자유게시판 게시글 상세 페이지 */
export default function PostPage() {
  const { freeboardId } = useParams<{ freeboardId?: string }>();

  const postId =
    freeboardId && !isNaN(Number(freeboardId))
      ? Number(freeboardId)
      : null;

  if (!postId) {
    return <FreeboardDetailSkeleton full />;
  }

  return (
    <main className="space-y-6">
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <ErrorFallback
            message="게시글을 불러올 수 없습니다."
            onRetry={resetErrorBoundary}
          />
        )}
      >
        <Suspense fallback={<FreeboardDetailSkeleton full />}>
          <FreeboardDetail postId={postId} />
        </Suspense>
      </ErrorBoundary>

      <div className="px-5 space-y-4">
        {/* 댓글 영역 */}
        <div className="px-5 space-y-4 pb-[100px]">
          <CommentList postId={postId} />
        </div>

        {/* 고정 입력창 */}
        <div className="fixed bottom-16 left-0 right-0 z-50 px-5 py-3">
          <CommentInput postId={postId} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-50 bg-transparent">
        <div className="backdrop-blur-[2px] bg-white/90 w-full h-full absolute top-0 z-[-1]" />
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </main>
  );
}
