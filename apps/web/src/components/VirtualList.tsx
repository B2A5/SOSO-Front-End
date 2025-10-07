'use client';
import React, { useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

/**
 * VirtualList 컴포넌트의 props
 */
interface VirtualListProps<T> {
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
    typeof window !== 'undefined'
      ? Number(sessionStorage.getItem(storageKey) ?? 0)
      : 0;

  // Virtualizer 설정
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (index) => getItemKey(items[index], index),
    initialOffset: resetScroll ? 0 : savedOffset,
    gap,
  });

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    // 초기 측정
    virtualizer.measure();

    // 프레임당 1회만 스크롤 위치 저장
    const saveScroll = rafThrottle((offset: number) => {
      sessionStorage.setItem(storageKey, String(offset));
    });

    const onScroll = () => {
      if (virtualizer.scrollOffset !== null) {
        saveScroll(virtualizer.scrollOffset);
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    // 새로고침/탭 전환 직전에 마지막 값 보장
    const flush = () => {
      saveScroll.flush();
      sessionStorage.setItem(
        storageKey,
        String(virtualizer.scrollOffset),
      );
    };
    window.addEventListener('visibilitychange', flush);
    window.addEventListener('beforeunload', flush);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('visibilitychange', flush);
      window.removeEventListener('beforeunload', flush);
      flush(); // 언마운트 시에도 최종 저장
    };
  }, [parentRef, storageKey, virtualizer]);

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
