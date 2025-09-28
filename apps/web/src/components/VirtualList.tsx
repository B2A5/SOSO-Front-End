'use client';
import React from 'react';
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
}

/** 외부 스크롤 컨테이너(parentRef) 기준 가상 리스트 */
export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 60,
  overscan = 3,
  getItemKey,
  parentRef,
  indexOffset = 0,
  rowGap = 0,
}: VirtualListProps<T>) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current, // 외부 스크롤 엘리먼트
    estimateSize: () => estimateSize, // 평균 높이
    overscan,
    getItemKey: (i) => getItemKey?.(items[i], i) ?? i,
    measureElement: (el) => el.getBoundingClientRect().height, // 실제 높이 측정
  });

  return (
    <div
      /* 전체 리스트 높이의 스페이서 */
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
            ref={(el) => {
              if (el) virtualizer.measureElement(el);
            }}
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
