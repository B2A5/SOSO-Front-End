'use client';
import React from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { VirtualListProps } from './VirtualList';
import {
  useScrollRestoration,
  useScrollRestorationInitialOffset,
} from '@/hooks/scroll/useScrollRestoration';
import { useVirtualizerMeasure } from '@/hooks/scroll/useVirtualizerMeasure';

/**
 * 스크롤 성능을 위한 가상 리스트 컴포넌트 (Window 기반)
 *
 * ## 특징:
 * - Window를 스크롤 컨테이너로 사용 (전체 페이지 스크롤)
 * - Flex 기반 레이아웃 (normal flow)
 */

export function WindowVirtualScroll<T>({
  items,
  renderItem,
  estimateSize = 60,
  overscan = 3,
  getItemKey,
  parentRef,
  gap = 0,
  storageKey = 'virtual-window-scroll',
  resetScroll = false,
}: VirtualListProps<T>) {
  const savedOffset = useScrollRestorationInitialOffset(
    storageKey,
    !resetScroll,
  );

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (index) => getItemKey(items[index], index),
    initialOffset: savedOffset,
    gap,
  });

  useScrollRestoration({
    type: 'window',
    virtualizer,
    storageKey,
    enabled: !resetScroll,
  });

  useVirtualizerMeasure({
    virtualizer,
    observeRef: parentRef, // 컨테이너 리사이즈도 감지
  });

  const virtualItems = virtualizer.getVirtualItems();

  const paddingTop =
    virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? virtualizer.getTotalSize() -
        (virtualItems[virtualItems.length - 1]?.end ?? 0)
      : 0;

  return (
    <div
      ref={parentRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        gap: gap > 0 ? `${gap}px` : undefined,
      }}
    >
      {virtualItems.map((virtualRow) => (
        <div
          key={virtualRow.key}
          ref={virtualizer.measureElement}
          data-index={virtualRow.index}
          style={{
            flexShrink: 0,
          }}
        >
          {renderItem(items[virtualRow.index], virtualRow.index)}
        </div>
      ))}
    </div>
  );
}
