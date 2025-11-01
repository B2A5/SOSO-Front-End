'use client';

import { useRef, useEffect, ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  AnimatePresence,
  PanInfo,
  animate,
} from 'framer-motion';
import { useDrawerContext } from './DrawerContext';
import { DrawerHandle } from './DrawerHandle';
import {
  Z_INDEX,
  SPRING_CONFIG,
  CLOSE_THRESHOLD,
  VELOCITY_THRESHOLD,
} from './constants';
import { cn } from '@/utils/cn';
import { findClosestSnapPoint, snapPointToY } from './utils';

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
}

/**
 * Drawer Content Component
 *
 * Drawer의 실제 콘텐츠 영역입니다.
 * Framer Motion의 drag 기능을 활용하여 드래그 제스처를 처리합니다.
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Overlay />
 *   <Drawer.Content>
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
}: DrawerContentProps) {
  const {
    isOpen,
    setIsOpen,
    position,
    dismissible,
    setIsDragging,
    snapPoints,
    activeSnapPointIndex,
    setActiveSnapPointIndex,
    closeThreshold,
  } = useDrawerContext();

  const contentRef = useRef<HTMLDivElement>(null);

  // Motion values for drag
  const y = useMotionValue(0);

  // 드래그 시작 핸들러
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // 드래그 중 핸들러
  const handleDrag = () => {
    // 스냅 포인트가 있을 때 위로 드래그 제한 (닫기 방향만 허용)
    if (
      position === 'bottom' &&
      snapPoints &&
      snapPoints.length > 1
    ) {
      const currentY = y.get();
      // 현재 위치가 0보다 위로 가려고 하면(음수) 0으로 제한
      if (currentY < 0) {
        y.set(0);
      }
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false);

    if (!dismissible) {
      // dismissible이 false면 원위치로 복귀
      y.set(0);
      return;
    }

    const drawerHeight = contentRef.current?.offsetHeight || 0;

    // 스냅 포인트가 있는 경우
    if (snapPoints && snapPoints.length > 1 && drawerHeight > 0) {
      const currentY = y.get();
      const velocityY = info.velocity.y;

      // 가장 가까운 스냅 포인트 찾기 (Vaul 방식) cspell:ignore Vaul
      const closestSnapIndex = findClosestSnapPoint(
        currentY,
        drawerHeight,
        snapPoints,
        velocityY,
        activeSnapPointIndex,
        closeThreshold,
      );

      // -1이면 닫기
      if (closestSnapIndex === -1) {
        setIsOpen(false);
        return;
      }

      // 스냅 포인트로 애니메이션
      const targetY = snapPointToY(
        snapPoints[closestSnapIndex],
        drawerHeight,
      );
      animate(y, targetY, SPRING_CONFIG);

      // Context 업데이트
      setActiveSnapPointIndex(closestSnapIndex);
      return;
    }

    // 스냅 포인트가 없는 경우: 기존 로직
    const offsetY = info.offset.y;
    const velocityY = info.velocity.y;

    // 닫기 조건 체크
    const shouldClose =
      offsetY > CLOSE_THRESHOLD || // 거리 임계값 초과
      velocityY > VELOCITY_THRESHOLD; // 속도 임계값 초과

    if (shouldClose) {
      // Drawer 닫기
      setIsOpen(false);
    } else {
      // 원위치로 복귀
      y.set(0);
    }
  };

  // Drawer 열릴 때 초기 위치 설정 (스냅 포인트)
  useEffect(() => {
    if (isOpen && snapPoints && snapPoints.length > 1) {
      // 약간의 딜레이 후 초기 스냅 포인트로 애니메이션
      // initial 애니메이션이 완료된 후 실행
      const timer = setTimeout(() => {
        const drawerHeight = contentRef.current?.offsetHeight || 0;
        if (drawerHeight === 0) return;

        const initialY = snapPointToY(
          snapPoints[activeSnapPointIndex],
          drawerHeight,
        );
        animate(y, initialY, SPRING_CONFIG);
      }, 100); // 100ms 딜레이

      return () => clearTimeout(timer);
    }
    // 닫힐 때는 y를 건드리지 않음 - exit 애니메이션이 자연스럽게 처리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // isOpen 변경 시에만 실행 (y, snapPoints, activeSnapPointIndex는 의도적으로 제외)

  // 스냅 포인트 변경 시 애니메이션 (제어 모드 지원)
  useEffect(() => {
    if (!isOpen || !snapPoints || snapPoints.length <= 1) {
      return;
    }

    const drawerHeight = contentRef.current?.offsetHeight || 0;
    if (drawerHeight === 0) {
      return;
    }

    // activeSnapPointIndex에 해당하는 Y 위치로 애니메이션
    const targetY = snapPointToY(
      snapPoints[activeSnapPointIndex],
      drawerHeight,
    );
    animate(y, targetY, SPRING_CONFIG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSnapPointIndex]); // activeSnapPointIndex 변경 시에만 (y, snapPoints, isOpen은 의도적으로 제외)

  // position에 따른 초기 위치 및 애니메이션 방향 설정
  const getAnimationProps = () => {
    const hasSnapPoints = snapPoints && snapPoints.length > 1;

    switch (position) {
      case 'bottom':
        return {
          initial: { y: '100%' },
          // 스냅 포인트가 있으면 animate에서 y 제거 (motion value로 제어)
          animate: hasSnapPoints ? {} : { y: 0 },
          exit: { y: '100%' },
          // 스냅 포인트가 있으면 dragConstraints 제거 (자유 드래그)
          dragConstraints: hasSnapPoints
            ? undefined
            : { top: 0, bottom: 0 },
          // 스냅 포인트가 있으면 elastic 제거 (정확한 드래그)
          dragElastic: hasSnapPoints ? 0 : { top: 0, bottom: 0.2 },
        };
      case 'top':
        return {
          initial: { y: '-100%' },
          animate: hasSnapPoints ? {} : { y: 0 },
          exit: { y: '-100%' },
          dragConstraints: hasSnapPoints
            ? undefined
            : { top: 0, bottom: 0 },
          dragElastic: hasSnapPoints ? 0 : { top: 0.2, bottom: 0 },
        };
      case 'left':
        return {
          initial: { x: '-100%' },
          animate: hasSnapPoints ? {} : { x: 0 },
          exit: { x: '-100%' },
          dragConstraints: hasSnapPoints
            ? undefined
            : { left: 0, right: 0 },
          dragElastic: hasSnapPoints ? 0 : { left: 0.2, right: 0 },
        };
      case 'right':
        return {
          initial: { x: '100%' },
          animate: hasSnapPoints ? {} : { x: 0 },
          exit: { x: '100%' },
          dragConstraints: hasSnapPoints
            ? undefined
            : { left: 0, right: 0 },
          dragElastic: hasSnapPoints ? 0 : { left: 0, right: 0.2 },
        };
      default:
        return {
          initial: { y: '100%' },
          animate: hasSnapPoints ? {} : { y: 0 },
          exit: { y: '100%' },
          dragConstraints: hasSnapPoints
            ? undefined
            : { top: 0, bottom: 0 },
          dragElastic: hasSnapPoints ? 0 : { top: 0, bottom: 0.2 },
        };
    }
  };

  const animationProps = getAnimationProps();

  // position에 따른 기본 스타일
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-0 left-0 right-0 rounded-t-2xl';
      case 'top':
        return 'top-0 left-0 right-0 rounded-b-2xl';
      case 'left':
        return 'left-0 top-0 bottom-0 rounded-r-2xl';
      case 'right':
        return 'right-0 top-0 bottom-0 rounded-l-2xl';
      default:
        return 'bottom-0 left-0 right-0 rounded-t-2xl';
    }
  };

  // 드래그 방향 설정
  const getDragDirection = () => {
    if (position === 'bottom' || position === 'top') return 'y';
    return 'x';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          drag={dismissible ? getDragDirection() : false}
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
                ? y
                : undefined,
            zIndex: Z_INDEX.CONTENT,
          }}
          className={cn(
            'fixed bg-white dark:bg-gray-900',
            'max-h-[95vh] overflow-hidden',
            'p-4',
            getPositionStyles(),
            className,
          )}
        >
          {/* 드래그 핸들 */}
          {showHandle && position === 'bottom' && <DrawerHandle />}

          {/* 실제 콘텐츠 */}
          <div className="overflow-y-auto max-h-full">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DrawerContent.displayName = 'Drawer.Content';
