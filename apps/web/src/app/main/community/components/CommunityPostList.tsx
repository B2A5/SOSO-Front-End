'use client';

import { InfiniteScroll } from '@/components/infiniteScrolls/InfiniteScroll';
import { cn } from '@/utils/cn';

/**
 * 커뮤니티 게시판(자유게시판, 투표게시판)에서 사용하는 게시글 목록 컴포넌트
 *
 * @description
 * - InfiniteScroll 컴포넌트를 조합하여 만든 게시글 리스트
 * - 초기 로딩, 빈 상태, 무한 스크롤, 가상 스크롤 모두 지원
 * - 제네릭 타입으로 다양한 게시글 타입 지원 (자유게시판, 투표게시판 등)
 * - getItemKey를 통해 안정적인 key 생성 필수
 * - renderItem을 통해 렌더링할 컴포넌트 전달
 * - 가상 스크롤과 스크롤 위치 저장 기능 포함
 */

interface BoardSummary {
  postId?: number;
  title?: string;
}

interface CommunityPostListProps<T extends BoardSummary> {
  items: T[]; // 게시글 데이터 배열
  hasNextPage: boolean; // 다음 페이지 존재 여부
  fetchNextPage: () => void; // 다음 페이지 로드 함수
  isFetchingNextPage: boolean; // 다음 페이지 로딩 상태
  initialLoading: boolean; // 초기 로딩 상태
  error?: Error | null; // API 에러 (옵셔널)
  onRetry?: () => void; // 재시도 함수 (옵셔널)
  getItemKey: (item: T, index: number) => React.Key; // 안정적인 key 생성 함수
  renderItem: (item: T, index: number) => React.ReactNode; // 각 아이템 렌더링 함수
  storageKey: string; // 스크롤 위치 저장용 키
  className?: string; // 컨테이너 추가 클래스
}

export default function CommunityPostList<T extends BoardSummary>({
  items,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  initialLoading,
  error,
  onRetry,
  getItemKey,
  renderItem,
  storageKey,
  className,
}: CommunityPostListProps<T>) {
  return (
    <InfiniteScroll
      items={items}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      initialLoading={initialLoading}
      error={error}
      className="flex-1 overflow-y-auto px-4"
    >
      {/* 초기 로딩 스켈레톤 */}
      <InfiniteScroll.Skeleton
        className={cn('flex flex-col gap-4', className)}
        skeletonCount={5}
      >
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      </InfiniteScroll.Skeleton>

      {/* API 에러 발생 시 */}
      <InfiniteScroll.Error
        className={cn(
          'flex flex-col items-center justify-center gap-4',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-red-500 text-center font-medium">
            게시글을 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="text-sm text-neutral-500 text-center">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-soso-600 text-white rounded-lg hover:bg-soso-700 transition-colors"
          >
            다시 시도
          </button>
        )}
      </InfiniteScroll.Error>

      {/* 게시글이 없을 때 */}
      <InfiniteScroll.Empty
        className={cn(
          'flex flex-col items-center justify-center py-12',
          className,
        )}
      >
        <p className="text-neutral-500 text-center">
          아직 작성된 게시글이 없습니다.
        </p>
      </InfiniteScroll.Empty>

      {/* 게시글 목록 */}
      <InfiniteScroll.Contents<T>
        className={cn('flex flex-col gap-4', className)}
        virtualScroll={{
          enabled: true,
          estimateSize: 156, // 카드 평균 높이
          overscan: 3,
        }}
        scrollStore={{
          enabled: true,
          storageKey: storageKey,
          resetScroll: false,
        }}
        // 안정적인 key 생성을 위한 함수 필수 전달
        getItemKey={getItemKey}
        renderItem={renderItem}
        gap={16} // 4 * 4px = 16px
        threshold={0.8}
      >
        {/* 무한스크롤 트리거 */}
        <InfiniteScroll.Trigger
          loadingText="더 많은 게시글을 불러오는 중..."
          notMoreText="모든 게시글을 확인했습니다."
        />
      </InfiniteScroll.Contents>
    </InfiniteScroll>
  );
}
