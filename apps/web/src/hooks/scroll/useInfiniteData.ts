import { useMemo } from 'react';
import type { UseInfiniteQueryResult } from '@tanstack/react-query';

/**
 * TanStack Query의 pages 구조를 flat array로 변환하는 훅
 *
 * - `useInfiniteQuery`의 pages 배열을 단일 배열로 flatten
 * - 페이지 구조에서 실제 아이템 추출
 *
 */
export function useInfiniteData<TData, TPageData = TData[]>({
  query,
  getItemsFromPage = (page) => page as unknown as TData[],
}: {
  /** TanStack Query의 useInfiniteQuery 결과 */
  query: UseInfiniteQueryResult<{ pages: TPageData[] }, Error>;
  /** 페이지 데이터에서 아이템 배열 추출 함수 (기본값: 페이지 자체를 배열로 간주) */
  getItemsFromPage?: (page: TPageData) => TData[];
}) {
  // pages 배열을 flat array로 변환
  const items = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.flatMap((page) => getItemsFromPage(page));
  }, [query.data?.pages, getItemsFromPage]);

  return {
    /** 모든 페이지의 아이템을 하나의 배열로 flatten */
    items,
    /** 다음 페이지 존재 여부 */
    hasNextPage: query.hasNextPage ?? false,
    /** 다음 페이지 로드 함수 */
    fetchNextPage: query.fetchNextPage,
    /** 다음 페이지 로딩 중 여부 */
    isFetchingNextPage: query.isFetchingNextPage,
    /** 초기 로딩 중 여부 */
    isLoading: query.isLoading,
    /** 에러 발생 여부 */
    isError: query.isError,
    /** 에러 객체 */
    error: query.error,
  };
}
