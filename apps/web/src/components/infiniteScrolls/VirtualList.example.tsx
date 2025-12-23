/**
 * VirtualList를 훅으로 리팩토링한 예제
 *
 *  useScrollRestoration과 useVirtualizerMeasure 사용 예제입니다.
 *
 */
'use client';
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useScrollRestoration,
  useScrollRestorationInitialOffset,
} from '@/hooks/scroll/useScrollRestoration';
import { useVirtualizerMeasure } from '@/hooks/scroll/useVirtualizerMeasure';
import { VirtualListProps } from './VirtualList';

export function VirtualListWithHooks<T>({
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
  // 저장된 스크롤 위치 load
  const savedOffset = useScrollRestorationInitialOffset(
    storageKey,
    !resetScroll, // resetScroll이 true면 복원 안 함
  );

  // Virtualizer 설정
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (index) => getItemKey(items[index], index),
    initialOffset: savedOffset, // -> 훅에서 가져온 값 사용
    gap,
  });

  // 스크롤 위치 저장 훅 적용 (container 타입)
  useScrollRestoration({
    type: 'container',
    virtualizer,
    parentRef,
    storageKey,
    enabled: !resetScroll,
  });

  // 리사이즈 대응 훅 적용 (container 타입)
  useVirtualizerMeasure<HTMLDivElement, Element>({
    virtualizer,
    observeRef: parentRef,
  });

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
