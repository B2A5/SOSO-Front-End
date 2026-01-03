'use client';

import React, { createContext, useContext, Component } from 'react';
import { cn } from '@/utils/cn';
import { useInfiniteScroll } from '@/hooks/scroll/useInfiniteScroll';
import { VirtualList } from '@/components/infiniteScrolls/VirtualList';

interface InfiniteScrollProps<T> {
  items: T[]; // 렌더링할 아이템 배열
  hasNextPage: boolean; // 다음 페이지 존재 여부
  fetchNextPage: () => void; // 다음 페이지 로드 함수
  isFetchingNextPage: boolean; // 다음 페이지 로딩 상태
  initialLoading: boolean; // 초기 로딩 상태
  error?: Error | null; // API 에러 (옵셔널)
  className?: string; // 컨테이너 추가 클래스
  children: React.ReactNode; // 내부에 포함될 컴포넌트들 (Skeleton, Empty, Error, Contents, Trigger)
}

interface InfiniteScrollContext<T> {
  items: T[]; // 렌더링할 아이템 배열
  hasNextPage: boolean; // 다음 페이지 존재 여부
  fetchNextPage: () => void; // 다음 페이지 로드 함수
  isFetchingNextPage: boolean; // 다음 페이지 로딩 상태
  initialLoading: boolean; // 초기 로딩 상태
  error?: Error | null; // API 에러
  parentRef: React.RefObject<HTMLDivElement | null>; // 스크롤 컨테이너 ref
  triggerRef: React.RefObject<HTMLDivElement | null>; // 로딩 트리거 ref
}

// 무한스크롤 컨텍스트
const InfiniteScrollContext = createContext<
  InfiniteScrollContext<unknown> | undefined
>(undefined);

// 컨텍스트 훅
const useInfiniteScrollContext = <T,>() => {
  const context = useContext(
    InfiniteScrollContext,
  ) as InfiniteScrollContext<T>;
  if (!context) {
    throw new Error(
      'useInfiniteScrollContext는 InfiniteScroll 컴포넌트 내부에서만 사용할 수 있습니다.',
    );
  }
  return context;
};

/**
 * Error Boundary: 컴포넌트 렌더링 중 발생하는 동기 에러를 catch
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class InfiniteScrollErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      'InfiniteScroll Error Boundary caught:',
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 text-center">
              데이터를 표시하는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              {this.state.error?.message}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

function InfiniteScrollContainer<T>({
  children,
  items,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  initialLoading = false,
  error = null,
  className,
}: InfiniteScrollProps<T>) {
  // refs
  const parentRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const contextValue: InfiniteScrollContext<T> = {
    items,
    initialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    parentRef,
    triggerRef,
  };

  // 1. API 에러가 있으면 Error 슬롯 찾아서 렌더링
  if (error) {
    const errorSlot = React.Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) &&
        typeof child.type === 'function' &&
        'displayName' in child.type &&
        child.type.displayName === 'InfiniteScrollError',
    );

    if (errorSlot && React.isValidElement(errorSlot)) {
      return (
        <div className={className}>
          <InfiniteScrollContext.Provider value={contextValue}>
            {errorSlot}
          </InfiniteScrollContext.Provider>
        </div>
      );
    }

    // Error 슬롯이 없으면 기본 에러 UI
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12',
          className,
        )}
      >
        <p className="text-red-500 text-center">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-sm text-neutral-500 mt-2">
          {error.message}
        </p>
      </div>
    );
  }

  // 2. 정상 흐름: Error Boundary로 동기 에러 catch
  return (
    <InfiniteScrollErrorBoundary>
      <InfiniteScrollContext.Provider value={contextValue}>
        <div ref={parentRef} className={className}>
          {children}
        </div>
      </InfiniteScrollContext.Provider>
    </InfiniteScrollErrorBoundary>
  );
}

/**
 * 무한 스크롤 초기 로딩 스켈레톤
 * - initialLoading이 true일 때만 렌더링
 * - skeletonCount 개수만큼 children 반복 렌더링
 * - children은 스켈레톤 컴포넌트
 */

interface InfiniteScrollSkeletonProps {
  className?: string;
  skeletonCount?: number; // 표시할 스켈레톤 개수
  children: React.ReactNode;
}

function InfiniteScrollSkeleton({
  className,
  skeletonCount = 3,
  children,
}: InfiniteScrollSkeletonProps) {
  const { initialLoading } = useInfiniteScrollContext();

  if (!initialLoading) {
    return null;
  }

  return (
    <div className={className} aria-busy="true" aria-live="polite">
      {Array.from({ length: skeletonCount }, (_, index) => (
        <div key={`list-skeleton-${index}`}>{children}</div>
      ))}
    </div>
  );
}

/**
 * 무한 스크롤 내부에 아이템이 없을때 표시할 컴포넌트
 *
 */
interface InfiniteScrollEmptyProps {
  className?: string;
  children: React.ReactNode;
}

function InfiniteScrollEmpty({
  className,
  children,
}: InfiniteScrollEmptyProps) {
  const { items, initialLoading } = useInfiniteScrollContext();

  if (initialLoading || items.length > 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center',
        className,
      )}
      aria-live="polite"
    >
      {children}
    </div>
  );
}

/**
 * 무한 스크롤 에러 표시 컴포넌트
 * - API 에러가 있을 때 렌더링
 * - error prop과 함께 사용
 */
interface InfiniteScrollErrorProps {
  className?: string;
  children: React.ReactNode;
}

function InfiniteScrollError({
  className,
  children,
}: InfiniteScrollErrorProps) {
  const { error } = useInfiniteScrollContext();

  // error가 없으면 렌더링하지 않음
  if (!error) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center py-12',
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      {children}
    </div>
  );
}

// displayName 설정 (Container에서 슬롯 찾기 위해 필요)
InfiniteScrollError.displayName = 'InfiniteScrollError';

/**
 * 무한 스크롤 콘텐츠 리스트
 * - 가상 스크롤 여부 선택 가능
 * - 스크롤 위치 저장 여부 선택 가능
 * - 내부에 아이템과, 로딩 트리거 포함
 * @todo: VirtualList가 스크롤 위치 저장을 끌 수 없음, 옵션 추가 필요
 */

interface VirtualScrollConfig {
  enabled: true;
  estimateSize?: number;
  overscan?: number;
}

interface ScrollStoreConfig {
  enabled: true;
  storageKey: string; // 스크롤 위치 저장 키
  resetScroll?: boolean; // 스크롤 위치 초기화 여부
}

interface InfiniteScrollContentsProps<T> {
  className?: string;
  virtualScroll?: VirtualScrollConfig; // 가상 스크롤 설정 (기본값: false)
  scrollStore?: ScrollStoreConfig; // 스크롤 위치 저장 설정 (기본값: true)
  getItemKey: (item: T, i: number) => React.Key; // 안정적인 key 생성 함수 (필수)
  renderItem: (item: T, index: number) => React.ReactNode; // 각 아이템을 렌더링하는 함수
  gap?: number; // 아이템 간격(px) (기본값: 0)
  threshold?: number; // IntersectionObserver threshold (기본값: 0.8)
  children: React.ReactElement<InfiniteScrollTriggerProps>; // 트리거 컴포넌트
}

function InfiniteScrollContents<T>({
  className,
  virtualScroll,
  scrollStore,
  getItemKey,
  renderItem,
  gap = 0,
  threshold = 0.8,
  children,
}: InfiniteScrollContentsProps<T>) {
  const {
    items,
    initialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    parentRef,
    triggerRef,
  } = useInfiniteScrollContext<T>();

  // 무한 스크롤 훅 설정
  useInfiniteScroll({
    targetRef: triggerRef,
    hasNextPage,
    fetchNextPage,
    isFetching: isFetchingNextPage,
    threshold,
    rootRef: parentRef,
  });

  if (initialLoading || items.length === 0) {
    return null;
  }
  return (
    <div className={cn('w-full', className)}>
      {virtualScroll ? (
        <VirtualList<T>
          items={items}
          parentRef={parentRef as React.RefObject<HTMLDivElement>}
          gap={gap}
          estimateSize={virtualScroll.estimateSize ?? 60}
          overscan={virtualScroll.overscan ?? 3}
          getItemKey={getItemKey}
          renderItem={renderItem}
          storageKey={
            scrollStore?.storageKey ?? 'infinite-scroll-default'
          }
          resetScroll={scrollStore?.resetScroll ?? false}
        />
      ) : (
        <div className="flex flex-col" style={{ gap: `${gap}px` }}>
          {items.map((item, index) => (
            <React.Fragment key={getItemKey(item, index)}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </div>
      )}
      {/* 로딩 트리거 */}
      {children}
    </div>
  );
}

interface InfiniteScrollTriggerProps {
  className?: string;
  spinner?: boolean; // 로딩 스피너 표시 여부
  loadingText?: string; // 로딩 중 텍스트
  notMoreText?: string; // 더 이상 아이템이 없을 때 텍스트
  children?: React.ReactNode; // 커스텀 로딩 컴포넌트
}

function InfiniteScrollTrigger({
  className,
  spinner = true,
  loadingText = '로딩 중...',
  notMoreText = '더 이상 불러올 항목이 없습니다.',
  children,
}: InfiniteScrollTriggerProps) {
  // 컨텍스트에서 상태 가져오기
  const {
    triggerRef,
    isFetchingNextPage,
    hasNextPage,
    initialLoading,
  } = useInfiniteScrollContext();

  if (initialLoading) {
    return null;
  }

  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      className={cn(
        'flex justify-center items-center py-4',
        className,
      )}
      style={{ minHeight: '1px' }}
      aria-live="polite"
      aria-busy={isFetchingNextPage}
    >
      {!hasNextPage ? (
        // 아이템이 더 이상 없음
        <div className="text-neutral-400 text-sm">
          <span>{notMoreText}</span>
        </div>
      ) : isFetchingNextPage ? (
        // 아이템 로딩 중
        children || (
          <div className="flex items-center gap-2">
            {spinner && (
              <div className="w-5 h-5 border-2 border-soso-600 border-t-transparent rounded-full animate-spin" />
            )}
            <span className="text-neutral-500">{loadingText}</span>
          </div>
        )
      ) : null}
    </div>
  );
}

export const InfiniteScroll = Object.assign(InfiniteScrollContainer, {
  Skeleton: InfiniteScrollSkeleton,
  Empty: InfiniteScrollEmpty,
  Error: InfiniteScrollError,
  Contents: InfiniteScrollContents,
  Trigger: InfiniteScrollTrigger,
});
