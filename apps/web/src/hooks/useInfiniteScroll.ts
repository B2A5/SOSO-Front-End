import React, { useEffect } from 'react';

interface UseInfiniteScrollProps {
  targetRef: React.RefObject<HTMLElement | null>; // 관찰할 DOM 요소의 ref
  hasNextPage: boolean; // 다음 페이지가 있는지 여부
  fetchNextPage: () => void; // 다음 페이지를 불러오는 함수
  isFetching?: boolean; // 현재 데이터 요청 중인지 여부 (중복 요청 방지용)
  threshold?: number; // 뷰포트에 걸리는 비율 (0~1)
}

/**
 * useInfiniteScroll 훅
 *
 * - targetRef로 전달된 요소가 뷰포트에 나타나면 fetchNextPage()를 호출합니다.
 * - hasNextPage가 true이고 isFetching이 false일 때만 동작합니다.
 * - IntersectionObserver API를 활용하여 구현됩니다.
 */
export function useInfiniteScroll({
  targetRef,
  hasNextPage,
  fetchNextPage,
  isFetching = false,
  threshold = 0.5,
}: UseInfiniteScrollProps) {
  useEffect(() => {
    const element = targetRef.current;

    // 조건 확인: 요소가 없거나, 다음 페이지가 없거나, 로딩 중이면 종료
    if (!element || !hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage(); // 요소가 화면에 보이면 다음 페이지 로드
        }
      },
      { threshold },
    );

    observer.observe(element); // 옵저버 등록

    return () => {
      observer.disconnect(); // 언마운트 시 옵저버 해제
    };
  }, [
    targetRef.current,
    hasNextPage,
    isFetching,
    fetchNextPage,
    threshold,
  ]);
}
