import { useEffect, useRef } from 'react';
import { animate, type MotionValue } from 'motion/react';
import { SnapPoint, DrawerPosition } from '../DrawerRoot';
import { SPRING_CONFIG } from '../constants';
import { snapPointToY } from '../utils';

export interface UseSnapPointAnimationProps {
  snapPoints?: SnapPoint[];
  activeSnapPointIndex: number;
  y: MotionValue<number>;
  x: MotionValue<number>;
  contentHeight: number;
  position: DrawerPosition;
}

/**
 * 스냅 포인트 애니메이션 훅 (완전 개선 버전)
 *
 * activeSnapPointIndex 변경 시 해당 스냅 포인트로 애니메이션합니다.
 *
 * 개선 사항:
 * - Timer 제거: DrawerContent의 animate prop이 초기 애니메이션 처리
 * - 모든 Position 지원: bottom, top, left, right
 * - 불필요한 애니메이션 방지: activeSnapPointIndex 실제 변경 시에만 실행
 * - 타입 안정성 개선: 방어적 코드 추가
 *
 * @example
 * ```tsx
 * useSnapPointAnimation({
 *   snapPoints: [0.3, 0.6, 1],
 *   activeSnapPointIndex,
 *   y,
 *   x,
 *   contentHeight,
 *   position: 'bottom',
 * });
 * ```
 */
export function useSnapPointAnimation({
  snapPoints,
  activeSnapPointIndex,
  y,
  x,
  contentHeight,
  position,
}: UseSnapPointAnimationProps) {
  // activeSnapPointIndex 이전 값 추적 (실제 변경 감지용)
  const prevIndexRef = useRef(activeSnapPointIndex);

  // activeSnapPointIndex 변경 시 애니메이션
  useEffect(() => {
    // 스냅 포인트가 없거나 높이가 0이면 중단
    if (
      !snapPoints ||
      snapPoints.length <= 1 ||
      contentHeight === 0
    ) {
      return;
    }

    // activeSnapPointIndex가 실제로 변경되었을 때만 실행
    // contentHeight만 변경된 경우는 애니메이션하지 않음 (UX 개선)
    if (prevIndexRef.current === activeSnapPointIndex) {
      return;
    }

    // 대상 위치 계산
    const snapValue = snapPointToY(
      snapPoints[activeSnapPointIndex],
      contentHeight,
    );

    // Position에 따라 y 또는 x로 애니메이션
    if (position === 'bottom') {
      animate(y, snapValue, SPRING_CONFIG);
    } else if (position === 'top') {
      animate(y, -snapValue, SPRING_CONFIG);
    } else if (position === 'left') {
      animate(x, -snapValue, SPRING_CONFIG);
    } else if (position === 'right') {
      animate(x, snapValue, SPRING_CONFIG);
    }

    // 이전 인덱스 업데이트
    prevIndexRef.current = activeSnapPointIndex;
  }, [
    activeSnapPointIndex,
    snapPoints,
    y,
    x,
    contentHeight,
    position,
  ]);
}
