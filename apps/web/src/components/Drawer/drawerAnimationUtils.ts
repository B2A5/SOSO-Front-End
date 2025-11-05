import { DrawerPosition, SnapPoint } from './DrawerContext';

/**
 * Drawer 애니메이션 유틸리티 함수
 */

export interface AnimationProps {
  initial: { x?: string; y?: string };
  animate: { x?: number; y?: number };
  exit: { x?: string; y?: string };
  dragConstraints?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  dragElastic?:
    | number
    | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      };
}

/**
 * position에 따른 애니메이션 props 반환
 *
 * @param position - Drawer 위치
 * @param hasSnapPoints - 스냅 포인트 여부
 * @returns Framer Motion 애니메이션 props
 *
 * @example
 * ```tsx
 * const animationProps = getAnimationProps('bottom', true);
 * <motion.div {...animationProps} />
 * ```
 */
export function getAnimationProps(
  position: DrawerPosition,
  hasSnapPoints: boolean,
): AnimationProps {
  switch (position) {
    case 'bottom':
      return {
        initial: { y: '100%' },
        animate: hasSnapPoints ? {} : { y: 0 },
        exit: { y: '100%' },
        dragConstraints: hasSnapPoints
          ? undefined
          : { top: 0, bottom: 0 },
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
}

/**
 * position에 따른 Tailwind CSS 클래스 반환
 *
 * @param position - Drawer 위치
 * @returns Tailwind CSS 클래스 문자열
 *
 * @example
 * ```tsx
 * const styles = getPositionStyles('bottom');
 * // "bottom-0 left-0 right-0 rounded-t-2xl"
 * ```
 */
export function getPositionStyles(position: DrawerPosition): string {
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
}

/**
 * position에 따른 드래그 방향 반환
 *
 * @param position - Drawer 위치
 * @returns 드래그 방향 ('x' | 'y')
 *
 * @example
 * ```tsx
 * const direction = getDragDirection('left');
 * // 'x'
 * ```
 */
export function getDragDirection(
  position: DrawerPosition,
): 'x' | 'y' {
  if (position === 'bottom' || position === 'top') return 'y';
  return 'x';
}

/**
 * 스냅 포인트 존재 여부 확인
 *
 * @param snapPoints - 스냅 포인트 배열
 * @returns 스냅 포인트가 2개 이상인지 여부
 */
export function hasSnapPoints(snapPoints?: SnapPoint[]): boolean {
  return snapPoints !== undefined && snapPoints.length > 1;
}
