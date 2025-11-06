import { useEffect, useRef } from 'react';
import { animate, type MotionValue } from 'motion/react';
import { SnapPoint } from '../DrawerRoot';
import { SPRING_CONFIG } from '../constants';
import { snapPointToY } from '../utils';

export interface UseSnapPointAnimationProps {
  isOpen: boolean;
  snapPoints?: SnapPoint[];
  activeSnapPointIndex: number;
  y: MotionValue<number>;
  contentRef: React.RefObject<HTMLDivElement>;
}

/**
 * 스냅 포인트 애니메이션 훅
 *
 * Drawer 열림 시 초기 스냅 포인트로 애니메이션하고,
 * activeSnapPointIndex 변경 시 해당 스냅 포인트로 애니메이션합니다.
 *
 * Issue #4 해결: useRef로 최신 값 참조하여 의존성 배열 문제 해결
 *
 * @example
 * ```tsx
 * useSnapPointAnimation({
 *   isOpen,
 *   snapPoints: [0.3, 0.6, 1],
 *   activeSnapPointIndex,
 *   y,
 *   contentRef,
 * });
 * ```
 */
export function useSnapPointAnimation({
  isOpen,
  snapPoints,
  activeSnapPointIndex,
  y,
  contentRef,
}: UseSnapPointAnimationProps) {
  // Issue #4 해결: ref로 최신 값 추적
  const snapPointsRef = useRef(snapPoints);
  const activeSnapIndexRef = useRef(activeSnapPointIndex);
  const isOpenRef = useRef(isOpen);

  // 최신 값으로 ref 업데이트
  useEffect(() => {
    snapPointsRef.current = snapPoints;
    activeSnapIndexRef.current = activeSnapPointIndex;
    isOpenRef.current = isOpen;
  }, [snapPoints, activeSnapPointIndex, isOpen]);

  // Drawer 열릴 때 초기 위치 설정 (스냅 포인트)
  useEffect(() => {
    const currentSnapPoints = snapPointsRef.current;
    const currentIndex = activeSnapIndexRef.current;

    if (
      !isOpen ||
      !currentSnapPoints ||
      currentSnapPoints.length <= 1
    ) {
      return;
    }

    // 약간의 딜레이 후 초기 스냅 포인트로 애니메이션
    // initial 애니메이션이 완료된 후 실행
    const timer = setTimeout(() => {
      const drawerHeight = contentRef.current?.offsetHeight || 0;
      if (drawerHeight === 0) return;

      const initialY = snapPointToY(
        currentSnapPoints[currentIndex],
        drawerHeight,
      );
      animate(y, initialY, SPRING_CONFIG);
    }, 100); // 100ms 딜레이

    return () => clearTimeout(timer);
    // isOpen이 true가 될 때만 실행 (초기 열림)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 스냅 포인트 변경 시 애니메이션 (제어 모드 지원)
  useEffect(() => {
    const currentSnapPoints = snapPointsRef.current;
    const currentIsOpen = isOpenRef.current;

    if (
      !currentIsOpen ||
      !currentSnapPoints ||
      currentSnapPoints.length <= 1
    ) {
      return;
    }

    const drawerHeight = contentRef.current?.offsetHeight || 0;
    if (drawerHeight === 0) {
      return;
    }

    // activeSnapPointIndex에 해당하는 Y 위치로 애니메이션
    const targetY = snapPointToY(
      currentSnapPoints[activeSnapPointIndex],
      drawerHeight,
    );
    animate(y, targetY, SPRING_CONFIG);
    // activeSnapPointIndex 변경 시에만 실행
  }, [activeSnapPointIndex, y, contentRef]);
}
