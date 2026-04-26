'use client';

import React, { Suspense } from 'react';
import { Header } from '@/components/header/Header';
import VoteBoardDetail from './components/VotesBoardDetail';
import VotesBoardCommentList from './components/VotesBoardCommentList';
import PollCommentInput from './components/PollCommentInput';
import VotesBoardDetailSkeleton from './components/VotesBoardDetailSkeleton';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';
import {
  getPoll,
  getGetPollQueryKey,
} from '@/generated/api/endpoints/poll/poll';
import { useQuery } from '@tanstack/react-query';
import { useAuthRestore } from '@/hooks/useAuth';

export default function VotesBoardDetailClientPage({
  votesboardId,
}: {
  votesboardId: number;
}) {
  const { isAuthenticated } = useAuthRestore();
  const {
    data: post,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: getGetPollQueryKey(votesboardId),
    queryFn: () => getPoll(votesboardId),
    staleTime: 0,
    gcTime: 5_000,
    refetchOnMount: isAuthenticated ? 'always' : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const menuButtonOnClick = () => {};

  const header = (
    <Header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <Header.Left>
        <Header.BackButton />
      </Header.Left>
      <Header.Center>투표게시판</Header.Center>
      <Header.Right>
        <Header.MenuButton onClick={menuButtonOnClick} />
      </Header.Right>
    </Header>
  );

  if (!votesboardId || isPending) {
    return (
      <main className="space-y-6 pt-12">
        {header}
        <VotesBoardDetailSkeleton />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="space-y-6 pt-12">
        {header}
        <div className="px-5 pt-16">
          <ErrorFallback
            message="게시글을 불러오는 중 오류가 발생했습니다."
            onRetry={() => refetch()}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 pt-12">
      {header}

      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            message={error?.message}
            onRetry={resetErrorBoundary}
          />
        )}
      >
        <Suspense fallback={<VotesBoardDetailSkeleton />}>
          <VoteBoardDetail votesboardId={votesboardId} />
        </Suspense>
      </ErrorBoundary>

      <section className="px-5 pb-6">
        <VotesBoardCommentList
          pollId={votesboardId}
          initialCount={post.commentCount}
        />
        <div className="fixed bottom-16 left-0 right-0 z-50 px-5 py-3">
          <PollCommentInput pollId={votesboardId} />
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
