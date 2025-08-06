import { useRef } from 'react';
import { PostSummary } from '@/api/posts';
import { FreeBoardCard } from './FreeboardCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { twMerge } from 'tailwind-merge';

/**
 * 무한스크롤로 커뮤니티 게시글 카드를 보여주는 컴포넌트입니다.
 * - 게시글 목록을 스크롤할 수 있는 형태로 보여줍니다.
 * - useInfiniteScroll 훅을 통해 무한스크롤 지원
 */
interface ContentsListProps {
  type: 'votesboard' | 'freeboard'; // 게시판 타입
  // @todo: 타입에 따라 다른 컴포넌트로 분리할 수도 있음
  posts: PostSummary[]; // 게시글 데이터 배열(여기에 나중에 투표 타입도 추가)
  hasNextPage: boolean; // 다음 페이지 존재 여부
  fetchNextPage: () => void; // 다음 페이지 로드 함수
  isFetchingNextPage: boolean; // 다음 페이지 로딩 상태
  isLoading?: boolean; // 초기 로딩 상태
  className?: string; // 추가 클래스명
}

export default function ContentsList({
  posts,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading = false,
  className,
}: ContentsListProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 훅 설정
  useInfiniteScroll({
    targetRef: triggerRef,
    hasNextPage,
    fetchNextPage,
    isFetching: isFetchingNextPage,
    threshold: 0.8, // 80% 지점에서 다음 페이지 로드
  });

  // 초기 로딩 상태
  if (isLoading) {
    return (
      <div className={twMerge('flex flex-col gap-4', className)}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // 게시글이 없는 경우
  if (!posts || posts.length === 0) {
    return (
      <div
        className={twMerge(
          'flex flex-col items-center justify-center py-12',
          className,
        )}
      >
        <p className="text-neutral-500 text-center">
          아직 작성된 게시글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      {/* 게시글 카드 리스트 (나중에 투표 타입 추가) */}
      {posts.map((post) => (
        <FreeBoardCard key={post.postId} post={post} isBadge={true} />
      ))}

      {/* 무한스크롤 트리거 요소 */}
      {hasNextPage && (
        <div ref={triggerRef} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-soso-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-neutral-500">
                더 많은 게시글을 불러오는 중...
              </span>
            </div>
          ) : (
            <div className="w-full h-1 bg-transparent" /> // 투명한 트리거 영역
          )}
        </div>
      )}

      {/* 더 이상 불러올 게시글이 없는 경우 */}
      {!hasNextPage && posts.length > 0 && (
        <div className="flex justify-center py-8">
          <p className="text-neutral-400 text-sm">
            모든 게시글을 확인했습니다.
          </p>
        </div>
      )}
    </div>
  );
}
