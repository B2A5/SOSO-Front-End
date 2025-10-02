'use client';
import React, { useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, i: number) => React.ReactNode;
  estimateSize?: number; // 평균 항목 높이(초기 추정)
  overscan?: number; // 화면 밖 추가 렌더 개수
  getItemKey?: (item: T, i: number) => React.Key; // 안정 키
  parentRef: React.RefObject<HTMLDivElement>; // 스크롤 컨테이너
  gap?: number; // 항목 간격 (px)
  storageKey?: string; // 세션 스토리지 키
  resetScroll?: boolean; // true면 세션 무시하고 맨 위에서 시작
}

export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 60,
  overscan = 3,
  getItemKey,
  parentRef,
  gap = 0,
  storageKey = 'virtual-list-scroll',
  resetScroll = false, // 기본값 false → 세션 복원
}: VirtualListProps<T>) {
  // 세션에 저장된 스크롤 위치 불러오기
  const savedOffset =
    typeof window !== 'undefined'
      ? Number(sessionStorage.getItem(storageKey) ?? 0)
      : 0;

  // Virtualizer 생성
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (i) => getItemKey?.(items[i], i) ?? i,
    // resetScroll이 true면 무조건 맨 위(0), 아니면 세션 값 복원
    initialOffset: resetScroll ? 0 : savedOffset,
    gap,
  });

  useEffect(() => {
    // mount 직후 강제로 높이 측정
    virtualizer.measure();

    // unmount 시 현재 스크롤 위치를 세션에 저장
    return () => {
      sessionStorage.setItem(
        storageKey,
        String(virtualizer.scrollOffset),
      );
    };
  }, [virtualizer, storageKey]);

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
          data-index={row.index}
        >
          {renderItem(items[row.index], row.index)}
        </div>
      ))}
    </div>
  );
}
