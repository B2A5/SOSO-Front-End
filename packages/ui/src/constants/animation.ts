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
