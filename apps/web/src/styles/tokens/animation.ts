/**
 * 애니메이션 토큰
 *
 * 전체 디자인 시스템에서 사용되는 애니메이션 관련 상수 정의
 * 일관된 애니메이션 경험을 제공하기 위한 토큰 모음
 */

/**
 * Pressable 효과 설정
 * 버튼, 카드, Input 등 상호작용 가능한 요소의 눌림 효과
 */
export const PRESS_ANIMATION = {
  /** 눌렸을 때 스케일 비율 */
  scale: 0.98,
  /** 애니메이션 지속 시간 (ms) */
  duration: 150,
  /** 애니메이션 easing */
  ease: 'ease-out',
} as const;

/**
 * 포커스 효과 설정
 * 키보드 네비게이션 시 focus 스타일
 */
export const FOCUS_ANIMATION = {
  /** 포커스 ring Tailwind 클래스 */
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  /** 포커스 ring 색상 */
  ringColor: 'focus-visible:ring-soso-600',
  /** 전환 지속 시간 (ms) */
  duration: 200,
} as const;

/**
 * 상태 전환 애니메이션 설정
 * error, success, default 등의 상태 변경 시
 */
export const STATE_TRANSITION = {
  /** 전환 지속 시간 (ms) */
  duration: 200,
  /** 애니메이션 easing */
  ease: 'ease-in-out',
} as const;

/**
 * 메시지 애니메이션 설정
 * error/help 메시지 표시/숨김 애니메이션
 */
export const MESSAGE_ANIMATION = {
  /** 나타날 때 애니메이션 */
  enter: {
    opacity: 1,
    height: 'auto',
    y: 0,
  },
  /** 사라질 때 애니메이션 */
  exit: {
    opacity: 0,
    height: 0,
    y: -10,
  },
  /** 전환 설정 */
  transition: {
    duration: 0.2,
    ease: 'easeInOut',
  },
} as const;

/**
 * Hover 효과 설정
 * 마우스 오버 시 애니메이션
 */
export const HOVER_ANIMATION = {
  /** hover 시 스케일 */
  scale: 1.01,
  /** 전환 지속 시간 (ms) */
  duration: 150,
} as const;

/**
 * 드롭다운/팝오버 애니메이션 설정
 */
export const DROPDOWN_ANIMATION = {
  /** 나타날 때 */
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  /** 사라질 때 */
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  /** 전환 설정 */
  transition: {
    duration: 0.2,
    ease: [0, 0, 0.2, 1],
  },
} as const;

/**
 * 모든 애니메이션 토큰 통합 객체
 */
export const ANIMATION_TOKENS = {
  press: PRESS_ANIMATION,
  focus: FOCUS_ANIMATION,
  state: STATE_TRANSITION,
  message: MESSAGE_ANIMATION,
  hover: HOVER_ANIMATION,
  dropdown: DROPDOWN_ANIMATION,
} as const;

/**
 * 애니메이션 토큰 타입
 */
export type AnimationTokens = typeof ANIMATION_TOKENS;
