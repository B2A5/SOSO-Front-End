'use client';

import {
  useRef,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDrawerContext } from './DrawerRoot';
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
import { snapPointToY } from './utils';

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
    closeOnDrag,
    isDragging,
    setIsDragging,
    snapPoints,
    activeSnapPointIndex,
    setActiveSnapPointIndex,
  } = useDrawerContext();

  const contentRef = useRef<HTMLDivElement>(null);

  // ResizeObserver로 Drawer 높이/너비 추적
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;

    // 초기 높이 즉시 설정 (ResizeObserver 전)
    setContentHeight(contentRef.current.offsetHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const height = entry.contentRect.height;

      // 성능 최적화: 5px 미만 변화는 무시
      setContentHeight((prev) => {
        if (Math.abs(prev - height) < 5) return prev;
        return height;
      });
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useBodyScrollLock(isOpen);

  const { y, x, handleDragStart, handleDrag, handleDragEnd } =
    useDragHandlers({
      position,
      closeOnDrag,
      snapPoints,
      activeSnapPointIndex,
      setActiveSnapPointIndex,
      setIsOpen,
      setIsDragging,
      contentRef,
      scrollLockTimeout,
    });

  useSnapPointAnimation({
    snapPoints,
    activeSnapPointIndex,
    y,
    x,
    contentHeight,
    position,
  });

  useDrawerAccessibility({
    isOpen,
    closeOnDrag,
    setIsOpen,
    contentRef,
  });

  useIOSOptimization({
    isOpen,
    isDragging,
  });

  // 애니메이션 props 생성
  const animationProps = getAnimationProps(
    position,
    hasSnapPoints(snapPoints),
  );

  // 스냅 포인트가 있을 때 목표 위치 계산 (모든 position 지원)
  const targetSnapPosition = useMemo(() => {
    if (!hasSnapPoints(snapPoints) || contentHeight === 0) {
      return { y: 0, x: 0 };
    }

    const snapValue = snapPointToY(
      snapPoints[activeSnapPointIndex],
      contentHeight,
    );

    // Position에 따라 y/x 값 결정
    if (position === 'bottom') return { y: snapValue, x: 0 };
    if (position === 'top') return { y: -snapValue, x: 0 };
    if (position === 'left') return { y: 0, x: -snapValue };
    if (position === 'right') return { y: 0, x: snapValue };

    return { y: 0, x: 0 };
  }, [snapPoints, activeSnapPointIndex, contentHeight, position]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          drag={closeOnDrag ? getDragDirection(position) : false}
          dragConstraints={animationProps.dragConstraints}
          dragElastic={animationProps.dragElastic}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          initial={animationProps.initial}
          animate={{
            ...animationProps.animate,
            // 스냅 포인트가 있고 드래그 중이 아닐 때만 애니메이션
            // isDragging 중에는 style의 MotionValue가 우선
            y:
              !isDragging &&
              hasSnapPoints(snapPoints) &&
              (position === 'bottom' || position === 'top')
                ? targetSnapPosition.y
                : animationProps.animate.y,
            x:
              !isDragging &&
              hasSnapPoints(snapPoints) &&
              (position === 'left' || position === 'right')
                ? targetSnapPosition.x
                : animationProps.animate.x,
          }}
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
