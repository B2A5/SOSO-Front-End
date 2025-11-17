/**
 * Drawer 상수 정의
 */

/** 드래그로 닫히기 위한 최소 거리 임계값 (px) */
export const CLOSE_THRESHOLD = 100;

/** 드래그로 닫히기 위한 최소 속도 임계값 (px/s) */
export const VELOCITY_THRESHOLD = 500;

/** 기본 스냅 포인트 (화면 높이 기준 비율) */
export const DEFAULT_SNAP_POINTS = [1]; // 100% 열림

/** iOS Safari 감지 */
export const IS_IOS =
  typeof window !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

/** Spring 애니메이션 설정 */
export const SPRING_CONFIG = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 400,
  mass: 0.5,
};

/** 드래그 핸들 크기 */
export const DRAG_HANDLE = {
  WIDTH: 36,
  HEIGHT: 4,
} as const;

/** z-index 값 */
export const Z_INDEX = {
  OVERLAY: 2000,
  CONTENT: 2001,
} as const;
