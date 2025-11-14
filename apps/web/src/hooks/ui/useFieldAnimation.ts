'use client';

/**
 * useFieldAnimation 훅
 *
 * Input/TextArea 컴포넌트의 상태 전환 애니메이션을 제공하는 훅
 * Framer Motion variants를 반환하여 일관된 애니메이션 경험 제공
 */

import { useMemo } from 'react';
import type { Variants } from 'motion/react';
import { STATE_TRANSITION } from '@/styles/tokens/animation';

// ============================================
// Types
// ============================================

/**
 * 필드 상태 타입
 */
export type FieldState = 'default' | 'focus' | 'error' | 'success';

/**
 * 필드 애니메이션 설정
 */
export interface FieldAnimationConfig {
  /**
   * 현재 필드 상태
   */
  state: FieldState;

  /**
   * 애니메이션 지속 시간 (초)
   * @default 0.2
   */
  duration?: number;
}

/**
 * 필드 애니메이션 반환 타입
 */
export interface FieldAnimationReturn {
  /**
   * Framer Motion variants
   * animate prop에 state를 전달하여 사용
   */
  variants: Variants;

  /**
   * 현재 상태
   */
  currentState: FieldState;

  /**
   * 상태별 border 색상 클래스
   */
  borderClass: string;

  /**
   * 상태별 ring 색상 클래스
   */
  ringClass: string;
}

// ============================================
// Constants
// ============================================

/**
 * 상태별 border 색상
 */
const BORDER_COLORS: Record<FieldState, string> = {
  default:
    'border-neutral-100 hover:border-neutral-700 dark:border-neutral-700 dark:hover:border-neutral-500',
  focus: 'border-transparent',
  error: 'border-transparent',
  success: 'border-transparent',
};

/**
 * 상태별 ring 색상
 */
const RING_COLORS: Record<FieldState, string> = {
  default: '',
  focus: 'ring-1 ring-neutral-700 dark:ring-neutral-500',
  error: 'ring-1 ring-red-300 dark:ring-red-400',
  success: 'ring-1 ring-soso-500 dark:ring-soso-400',
};

// ============================================
// Hook
// ============================================

/**
 * useFieldAnimation 훅
 *
 * Input/TextArea 필드의 상태 전환 애니메이션을 관리합니다.
 * Framer Motion variants와 스타일 클래스를 제공하여
 * 일관된 애니메이션 경험을 제공합니다.
 *
 * @param config - 애니메이션 설정
 * @returns variants, borderClass, ringClass
 *
 * @example
 * function MyInput() {
 *   const [isFocused, setIsFocused] = useState(false);
 *   const [isError, setIsError] = useState(false);
 *
 *   const state = isError ? 'error' : isFocused ? 'focus' : 'default';
 *   const { variants, borderClass, ringClass } = useFieldAnimation({ state });
 *
 *   return (
 *     <motion.input
 *       variants={variants}
 *       animate={state}
 *       className={twMerge('border', borderClass, ringClass)}
 *     />
 *   );
 * }
 */
export function useFieldAnimation({
  state,
  duration = STATE_TRANSITION.duration / 1000,
}: FieldAnimationConfig): FieldAnimationReturn {
  // Framer Motion variants (memoized)
  const variants: Variants = useMemo(
    () => ({
      default: {
        scale: 1,
        transition: {
          duration,
          ease: 'easeInOut',
        },
      },
      focus: {
        scale: 1,
        transition: {
          duration,
          ease: 'easeInOut',
        },
      },
      error: {
        scale: 1,
        transition: {
          duration,
          ease: 'easeInOut',
        },
      },
      success: {
        scale: 1,
        transition: {
          duration,
          ease: 'easeInOut',
        },
      },
    }),
    [duration],
  );

  const borderClass = BORDER_COLORS[state];
  const ringClass = RING_COLORS[state];

  return {
    variants,
    currentState: state,
    borderClass,
    ringClass,
  };
}
