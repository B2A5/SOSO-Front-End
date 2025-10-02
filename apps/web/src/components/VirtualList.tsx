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
  indexOffset?: number; // 표시용 인덱스 시작값
  rowGap?: number; // 항목 간 간격(px, padding으로 처리)
  storageKey?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 60,
  overscan = 3,
  getItemKey,
  parentRef,
  indexOffset = 0,
  rowGap = 0,
  storageKey = 'virtual-list-scroll',
}: VirtualListProps<T>) {
  const savedOffset =
    typeof window !== 'undefined'
      ? Number(sessionStorage.getItem(storageKey) ?? 0)
      : 0;

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (i) => getItemKey?.(items[i], i) ?? i,
    initialOffset: savedOffset,
  });

  useEffect(() => {
    // mount 직후 한 번 강제 measure
    virtualizer.measure();

    // unmount 시 현재 스크롤 위치 저장
    return () => {
      sessionStorage.setItem(
        storageKey,
        String(virtualizer.scrollOffset),
      );
    };
  }, [virtualizer, storageKey]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const onScroll = () => {
      console.log('📍 scrollOffset:', virtualizer.scrollOffset);
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [virtualizer, parentRef]);

  return (
    <div
      style={{
        height: virtualizer.getTotalSize(),
        position: 'relative',
        width: '100%',
      }}
    >
      {virtualizer.getVirtualItems().map((row) => {
        const displayIndex = row.index + indexOffset;
        return (
          <div
            key={row.key}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${row.start}px)`,
              paddingBottom: rowGap,
            }}
            data-index={displayIndex}
          >
            {renderItem(items[row.index], displayIndex)}
          </div>
        );
      })}
    </div>
  );
}
