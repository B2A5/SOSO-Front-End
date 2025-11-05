import { useRef, useCallback } from 'react';
import { useMotionValue, animate } from 'motion/react';
import type { PanInfo } from 'motion/react';
import { DrawerPosition, SnapPoint } from '../DrawerContext';
import {
  SPRING_CONFIG,
  CLOSE_THRESHOLD,
  VELOCITY_THRESHOLD,
} from '../constants';
import { findClosestSnapPoint, snapPointToY } from '../utils';

export interface UseDragHandlersProps {
  position: DrawerPosition;
  dismissible: boolean;
  snapPoints?: SnapPoint[];
  activeSnapPointIndex: number;
  setActiveSnapPointIndex: (index: number) => void;
  setIsOpen: (open: boolean) => void;
  setIsDragging: (dragging: boolean) => void;
  contentRef: React.RefObject<HTMLDivElement>;
  scrollLockTimeout?: number;
}

export interface UseDragHandlersReturn {
  y: ReturnType<typeof useMotionValue<number>>;
  x: ReturnType<typeof useMotionValue<number>>;
  handleDragStart: (
    event: MouseEvent | TouchEvent | PointerEvent,
  ) => void;
  handleDrag: () => void;
  handleDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => void;
}

/**
 * Drawer 드래그 핸들러 훅
 *
 * 드래그 제스처를 처리하고 스크롤과의 충돌을 방지합니다.
 * Issue #3 해결: Date 객체 대신 Date.now() 사용
 *
 * @example
 * ```tsx
 * const { y, x, handleDragStart, handleDrag, handleDragEnd } = useDragHandlers({
 *   position: 'bottom',
 *   dismissible: true,
 *   // ...
 * });
 * ```
 */
export function useDragHandlers({
  position,
  dismissible,
  snapPoints,
  activeSnapPointIndex,
  setActiveSnapPointIndex,
  setIsOpen,
  setIsDragging,
  contentRef,
  scrollLockTimeout = 500,
}: UseDragHandlersProps): UseDragHandlersReturn {
  // Motion values for drag
  const y = useMotionValue(0);
  const x = useMotionValue(0);

  // Issue #3 해결: Date 객체 → number로 변경
  const lastTimeDragPrevented = useRef<number | null>(null);

  /**
   * 드래그 가능 여부 체크 (Vaul 방식)
   * 스크롤 가능한 요소의 scrollTop이 0이 아니면 드래그 불허
   */
  const shouldDrag = useCallback(
    (target: HTMLElement): boolean => {
      let element: HTMLElement | null = target;

      // DOM 트리를 순회하며 스크롤 가능한 요소 체크
      while (element && element !== contentRef.current) {
        // 스크롤 가능한 요소인지 체크
        if (element.scrollHeight > element.clientHeight) {
          // 스크롤이 top이 아니면 드래그 불허
          if (element.scrollTop !== 0) {
            lastTimeDragPrevented.current = Date.now(); // Issue #3 해결
            return false;
          }
        }
        element = element.parentElement;
      }

      // 최근에 스크롤로 인해 드래그가 차단되었는지 체크
      if (lastTimeDragPrevented.current) {
        const timeSinceLastPrevent =
          Date.now() - lastTimeDragPrevented.current;

        // scrollLockTimeout 이내면 드래그 불허
        if (timeSinceLastPrevent < scrollLockTimeout) {
          return false;
        }
      }

      return true;
    },
    [contentRef, scrollLockTimeout],
  );

  // 드래그 시작 핸들러
  const handleDragStart = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent) => {
      // 스크롤 가능 영역에서 드래그 시작 시 체크
      const target = event.target as HTMLElement;

      if (!shouldDrag(target)) {
        // 드래그 불가능하면 이벤트 중단
        event.preventDefault();
        return;
      }

      setIsDragging(true);
    },
    [shouldDrag, setIsDragging],
  );

  // 드래그 중 핸들러
  const handleDrag = useCallback(() => {
    // 스냅 포인트가 있을 때 닫기 반대 방향 드래그 제한
    if (snapPoints && snapPoints.length > 1) {
      if (position === 'bottom') {
        const currentY = y.get();
        if (currentY < 0) {
          y.set(0);
        }
      } else if (position === 'top') {
        const currentY = y.get();
        if (currentY > 0) {
          y.set(0);
        }
      } else if (position === 'left') {
        const currentX = x.get();
        if (currentX < 0) {
          x.set(0);
        }
      } else if (position === 'right') {
        const currentX = x.get();
        if (currentX > 0) {
          x.set(0);
        }
      }
    }
  }, [position, snapPoints, y, x]);

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(
    (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      setIsDragging(false);

      if (!dismissible) {
        // dismissible이 false면 원위치로 복귀
        y.set(0);
        x.set(0);
        return;
      }

      const drawerHeight = contentRef.current?.offsetHeight || 0;

      // 스냅 포인트가 있는 경우
      if (snapPoints && snapPoints.length > 1 && drawerHeight > 0) {
        const currentY = y.get();
        const velocityY = info.velocity.y;

        // 가장 가까운 스냅 포인트 찾기
        const closestSnapIndex = findClosestSnapPoint(
          currentY,
          drawerHeight,
          snapPoints,
          velocityY,
          activeSnapPointIndex,
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
        x.set(0);
      }
    },
    [
      dismissible,
      snapPoints,
      activeSnapPointIndex,
      contentRef,
      y,
      x,
      setIsDragging,
      setIsOpen,
      setActiveSnapPointIndex,
    ],
  );

  return {
    y,
    x,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
}
