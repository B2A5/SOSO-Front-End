'use client';

import { DRAG_HANDLE } from './constants';
import { cn } from '@/utils/cn';

/**
 * Drawer Handle Component
 *
 * Drawer 상단의 드래그 핸들 UI 컴포넌트입니다.
 * 사용자가 드래그할 수 있는 시각적 표시를 제공합니다.
 *
 * @example
 * ```tsx
 * <Drawer.Content>
 *   <Drawer.Handle />
 *   <div>Content</div>
 * </Drawer.Content>
 * ```
 */
export function DrawerHandle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto mb-4 shrink-0 rounded-full bg-gray-300',
        'dark:bg-gray-700',
        className,
      )}
      style={{
        width: `${DRAG_HANDLE.WIDTH}px`,
        height: `${DRAG_HANDLE.HEIGHT}px`,
      }}
      aria-hidden="true"
    />
  );
}

DrawerHandle.displayName = 'Drawer.Handle';
