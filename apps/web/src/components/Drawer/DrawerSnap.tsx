'use client';

import { ReactNode } from 'react';
import { useDrawerContext } from './DrawerRoot';
import { cn } from '@/utils/cn';

/**
 * Drawer Snap Props
 */
export interface DrawerSnapProps {
  /** 스냅 포인트 인덱스 (0부터 시작) */
  index: number;
  /** 자식 요소 */
  children: ReactNode;
  /** 추가 className */
  className?: string;
  /** 비활성 시에도 DOM에 유지 (애니메이션/성능 최적화) */
  keepMounted?: boolean;
  /** 애니메이션 타입 */
  animation?: 'fade' | 'slide' | 'none';
}

/**
 * Drawer.Snap Component
 *
 * 특정 스냅 포인트에서만 표시되는 콘텐츠를 관리합니다.
 *
 * @example
 * ```tsx
 * <Drawer snapPoints={[0.3, 0.6, 1]}>
 *   <Drawer.Content>
 *     <Drawer.Snap index={0}>
 *       <ShortContent />
 *     </Drawer.Snap>
 *     <Drawer.Snap index={1}>
 *       <MediumContent />
 *     </Drawer.Snap>
 *     <Drawer.Snap index={2}>
 *       <FullContent />
 *     </Drawer.Snap>
 *   </Drawer.Content>
 * </Drawer>
 * ```
 */
export function DrawerSnap({
  index,
  children,
  className,
  keepMounted = false,
  animation = 'fade',
}: DrawerSnapProps) {
  const { activeSnapPointIndex } = useDrawerContext();

  const isActive = activeSnapPointIndex === index;

  // keepMounted가 false이고 비활성이면 렌더링 안 함
  if (!keepMounted && !isActive) {
    return null;
  }

  return (
    <div
      className={cn(
        'w-full',
        // 애니메이션 클래스
        animation === 'fade' && 'transition-opacity duration-200',
        animation === 'slide' && 'transition-transform duration-200',
        // 활성/비활성 상태
        keepMounted && !isActive && 'hidden',
        !isActive &&
          animation === 'fade' &&
          'opacity-0 pointer-events-none',
        isActive && animation === 'fade' && 'opacity-100',
        className,
      )}
      data-snap-index={index}
      data-active={isActive}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
}

DrawerSnap.displayName = 'Drawer.Snap';
