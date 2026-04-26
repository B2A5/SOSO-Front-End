'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

/**
 * VirtualList 컴포넌트의 props
 */
export interface VirtualListProps<T> {
  /** 렌더링할 아이템 배열 */
  items: T[];
  /** 각 아이템을 렌더링하는 함수 */
  renderItem: (item: T, i: number) => React.ReactNode;
  /** 평균 아이템 높이 (기본값: 60) */
  estimateSize?: number;
  /** 화면 밖 추가 렌더 개수 (기본값: 3) */
  overscan?: number;
  /** 안정적인 key 생성 함수 */
  getItemKey: (item: T, i: number) => React.Key;
  /** 스크롤 컨테이너 ref */
  parentRef: React.RefObject<HTMLDivElement>;
  /** 아이템 간 간격(px) */
  gap?: number;
  /** 세션 스크롤 위치 저장용 키 */
  storageKey?: string;
  /** true면 세션 무시하고 맨 위에서 시작 */
  resetScroll?: boolean;
}

/**
 * 스크롤 성능을 위한 가상 리스트 컴포넌트
 * - 스크롤 위치를 세션에 저장해 복원 가능 (rAF 쓰로틀 적용)
 */
export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 60,
  overscan = 3,
  getItemKey,
  parentRef,
  gap = 0,
  storageKey = 'virtual-list-scroll',
  resetScroll = false,
}: VirtualListProps<T>) {
  // 이전 스크롤 위치 불러오기
  const savedOffset =
    typeof window !== 'undefined' && !resetScroll
      ? Number(sessionStorage.getItem(storageKey) ?? 0)
      : 0;

  // useVirtualizer에 넘기는 함수를 useCallback으로 안정화:
  // setOptions는 매 렌더마다 호출되는데, 함수 레퍼런스가 바뀌면
  // 내부적으로 notifyListeners를 트리거해 무한 리렌더가 발생함
  const getScrollElement = useCallback(
    () => parentRef.current,
    [parentRef],
  );
  const estimateSizeFn = useCallback(
    () => estimateSize,
    [estimateSize],
  );
  const getItemKeyFn = useCallback(
    (index: number) => getItemKey(items[index], index),
    [getItemKey, items],
  );

  // Virtualizer 설정
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement,
    estimateSize: estimateSizeFn,
    overscan,
    getItemKey: getItemKeyFn,
    initialOffset: savedOffset,
    gap,
  });

  // virtualizerRef: useEffect deps에 virtualizer 객체를 넣으면
  // 렌더마다 새 인스턴스로 인식되어 effect가 재실행됨.
  // ref를 통해 항상 최신 virtualizer를 참조하되 deps는 안정적으로 유지
  const virtualizerRef = useRef(virtualizer);
  virtualizerRef.current = virtualizer;

  // 스크롤 위치 저장 및 이탈 직전 보장
  useEffect(() => {
    const scrollContainerElement = parentRef.current;
    if (!scrollContainerElement) return;

    // 마운트 직후 아이템 크기 초기 측정
    virtualizerRef.current.measure();

    // 스크롤 중 저장: 프레임당 1회
    const saveScrollPosition = rafThrottle((offset: number) => {
      sessionStorage.setItem(storageKey, String(offset));
    });

    const handleScroll = () => {
      if (virtualizerRef.current.scrollOffset !== null) {
        saveScrollPosition(virtualizerRef.current.scrollOffset);
      }
    };

    scrollContainerElement.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    // 탭 전환·페이지 이탈 시 최신 위치를 즉시 flush
    const flushLatestPosition = () => {
      saveScrollPosition.flush();
      if (virtualizerRef.current.scrollOffset !== null) {
        sessionStorage.setItem(
          storageKey,
          String(virtualizerRef.current.scrollOffset),
        );
      }
    };
    document.addEventListener(
      'visibilitychange',
      flushLatestPosition,
    );
    window.addEventListener('beforeunload', flushLatestPosition);

    return () => {
      scrollContainerElement.removeEventListener(
        'scroll',
        handleScroll,
      );
      document.removeEventListener(
        'visibilitychange',
        flushLatestPosition,
      );
      window.removeEventListener('beforeunload', flushLatestPosition);
      flushLatestPosition();
    };
  }, [parentRef, storageKey]);

  // 부모 컨테이너 리사이즈 대응
  useEffect(() => {
    const scrollContainerElement = parentRef.current;
    if (!scrollContainerElement) return;

    // 측정 빈도 제한: 프레임당 1회
    const measureOnNextAnimationFrame = rafThrottle(() => {
      virtualizerRef.current.measure();
    });

    // 부모 컨테이너 크기 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      measureOnNextAnimationFrame();
    });
    resizeObserver.observe(scrollContainerElement);

    // 창 리사이즈 보조 감지
    const handleWindowResize = () => {
      measureOnNextAnimationFrame();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      measureOnNextAnimationFrame.cancel?.();
    };
  }, [parentRef]);

  return (
    <div
      style={{
        height: virtualizer.getTotalSize(),
        position: 'relative',
        width: '100%',
      }}
    >
      {virtualizer.getVirtualItems().map((row) => (
        <div
          key={row.key}
          ref={virtualizer.measureElement}
          data-index={row.index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${row.start}px)`,
          }}
        >
          {renderItem(items[row.index], row.index)}
        </div>
      ))}
    </div>
  );
}
