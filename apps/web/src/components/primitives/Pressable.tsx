'use client';

/**
 * Pressable 컴포넌트
 *
 * 모든 interactive 요소에 일관된 press 효과를 제공하는 범용 컴포넌트
 * Button, Card, Input 등에서 재사용 가능
 */

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { PRESS_ANIMATION } from '@/styles/tokens/animation';

// ============================================
// Types
// ============================================

/**
 * Pressable 컴포넌트의 Props
 */
export interface PressableProps extends HTMLMotionProps<'div'> {
  /**
   * 자식 요소
   */
  children: React.ReactNode;

  /**
   * 비활성화 여부
   * true일 경우 press 효과가 적용되지 않습니다
   * @default false
   */
  disabled?: boolean;

  /**
   * press 시 스케일 비율
   * @default 0.98
   * @example
   * pressScale={0.95} // 더 강한 효과
   * pressScale={0.99} // 더 약한 효과
   */
  pressScale?: number;

  /**
   * press 애니메이션 지속 시간 (ms)
   * @default 150
   */
  pressDuration?: number;
}

// ============================================
// Component
// ============================================

/**
 * Pressable 컴포넌트
 *
 * 모든 interactive 요소에 일관된 press 효과를 제공합니다.
 * useTap 훅을 내장하여 터치/마우스 이벤트를 자동으로 처리합니다.
 *
 * 주요 기능:
 * - 자동 press 상태 관리 (useTap)
 * - 커스터마이징 가능한 스케일 효과
 * - disabled 상태 지원
 * - 다양한 HTML 요소로 렌더링 가능 (polymorphic)
 * - Framer Motion 애니메이션
 *
 * @component
 * @example
 * // 기본 사용법 (div로 렌더링)
 * <Pressable>
 *   클릭 가능한 영역
 * </Pressable>
 *
 * @example
 * // 커스텀 스케일
 * <Pressable pressScale={0.95}>
 *   강한 press 효과
 * </Pressable>
 *
 * @example
 * // 비활성화
 * <Pressable disabled>
 *   비활성화된 영역
 * </Pressable>
 */
export function Pressable({
  children,
  disabled = false,
  pressScale = PRESS_ANIMATION.scale,
  pressDuration = PRESS_ANIMATION.duration,
  className,
  ...props
}: PressableProps) {
  return (
    <motion.div
      className={twMerge(
        disabled && 'pointer-events-none',
        className,
      )}
      whileTap={
        disabled
          ? undefined
          : {
              scale: pressScale,
              transition: {
                duration: pressDuration / 1000,
                ease: 'easeOut',
              },
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

Pressable.displayName = 'Pressable';
