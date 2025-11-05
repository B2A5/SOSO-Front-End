'use client';

import { useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDrawerContext } from './DrawerContext';
import { DrawerHandle } from './DrawerHandle';
import { Z_INDEX, SPRING_CONFIG } from './constants';
import { cn } from '@/utils/cn';

// 커스텀 훅 imports
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { useDragHandlers } from './hooks/useDragHandlers';
import { useSnapPointAnimation } from './hooks/useSnapPointAnimation';
import { useDrawerAccessibility } from './hooks/useDrawerAccessibility';
import { useIOSOptimization } from './hooks/useIOSOptimization';

// 유틸 함수 imports
import {
  getAnimationProps,
  getPositionStyles,
  getDragDirection,
  hasSnapPoints,
} from './drawerAnimationUtils';

/**
 * Drawer Content Props
 */
export interface DrawerContentProps {
  /** 추가 className */
  className?: string;
  /** 자식 요소 */
  children: ReactNode;
  /** 드래그 핸들 표시 (기본 true) */
  showHandle?: boolean;
  /** 스크롤 잠금 타임아웃 (Issue #6 해결, 기본 500ms) */
  scrollLockTimeout?: number;
}

/**
 * Drawer Content Component (Refactored)
 *
 * 개선 사항:
 * - Issue #2: Body 스크롤 잠금 → useBodyScrollLock 훅
 * - Issue #3: Date 객체 비효율 → useDragHandlers 훅에서 Date.now() 사용
 * - Issue #4: useEffect 의존성 → useSnapPointAnimation 훅에서 ref 사용
 * - Issue #6: SCROLL_LOCK_TIMEOUT 하드코딩 → props로 전달
 *
 * 추상화:
 * - 드래그 로직 → useDragHandlers
 * - 스냅 포인트 애니메이션 → useSnapPointAnimation
 * - 접근성 (ESC + 포커스 트랩) → useDrawerAccessibility
 * - iOS 최적화 → useIOSOptimization
 * - 애니메이션 헬퍼 → drawerAnimationUtils
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Overlay />
 *   <Drawer.Content scrollLockTimeout={300}>
 *     <h1>Title</h1>
 *     <p>Content</p>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export function DrawerContent({
  className,
  children,
  showHandle = true,
  scrollLockTimeout = 500,
}: DrawerContentProps) {
  const {
    isOpen,
    setIsOpen,
    position,
    dismissible,
    isDragging,
    setIsDragging,
    snapPoints,
    activeSnapPointIndex,
    setActiveSnapPointIndex,
  } = useDrawerContext();

  const contentRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅들로 로직 분리
  // 1. Body 스크롤 잠금 (Issue #2)
  useBodyScrollLock(isOpen);

  // 2. 드래그 핸들러 (Issue #3 해결, Issue #6 해결)
  const { y, x, handleDragStart, handleDrag, handleDragEnd } =
    useDragHandlers({
      position,
      dismissible,
      snapPoints,
      activeSnapPointIndex,
      setActiveSnapPointIndex,
      setIsOpen,
      setIsDragging,
      contentRef,
      scrollLockTimeout,
    });

  // 3. 스냅 포인트 애니메이션 (Issue #4 해결)
  useSnapPointAnimation({
    isOpen,
    snapPoints,
    activeSnapPointIndex,
    y,
    contentRef,
  });

  // 4. 접근성 (ESC 키 + 포커스 트랩)
  useDrawerAccessibility({
    isOpen,
    dismissible,
    setIsOpen,
    contentRef,
  });

  // 5. iOS Safari 최적화
  useIOSOptimization({
    isOpen,
    isDragging,
  });

  // 애니메이션 props 생성
  const animationProps = getAnimationProps(
    position,
    hasSnapPoints(snapPoints),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          drag={dismissible ? getDragDirection(position) : false}
          dragConstraints={animationProps.dragConstraints}
          dragElastic={animationProps.dragElastic}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          initial={animationProps.initial}
          animate={animationProps.animate}
          exit={animationProps.exit}
          transition={SPRING_CONFIG}
          style={{
            y:
              position === 'bottom' || position === 'top'
                ? y
                : undefined,
            x:
              position === 'left' || position === 'right'
                ? x
                : undefined,
            zIndex: Z_INDEX.CONTENT,
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn(
            'fixed bg-white dark:bg-gray-900',
            'max-h-[95vh] overflow-hidden',
            'p-4',
            getPositionStyles(position),
            className,
          )}
        >
          {/* 드래그 핸들 */}
          {showHandle && position === 'bottom' && <DrawerHandle />}

          {/* 실제 콘텐츠 */}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DrawerContent.displayName = 'Drawer.Content';
