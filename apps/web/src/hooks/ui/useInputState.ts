'use client';

/**
 * useInputState 훅
 *
 * Input/TextArea 컴포넌트의 상태 관리 로직을 캡슐화한 훅
 * Input, TextArea, Select 등에서 재사용 가능
 */

import { useState, useCallback } from 'react';
import type { FieldState } from './useFieldAnimation';

// ============================================
// Types
// ============================================

/**
 * useInputState 설정
 */
export interface UseInputStateConfig {
  /**
   * 에러 상태 여부
   * @default false
   */
  isError?: boolean;

  /**
   * 성공 상태 여부
   * @default false
   */
  isSuccess?: boolean;

  /**
   * 초기 포커스 상태
   * @default false
   */
  initialFocused?: boolean;

  /**
   * 포커스 시 콜백
   */
  onFocusChange?: (focused: boolean) => void;
}

/**
 * useInputState 반환 타입
 */
export interface UseInputStateReturn {
  /**
   * 현재 필드 상태 (default | focus | error | success)
   */
  state: FieldState;

  /**
   * 포커스 여부
   */
  isFocused: boolean;

  /**
   * 포커스 핸들러
   */
  handleFocus: () => void;

  /**
   * Blur 핸들러
   */
  handleBlur: () => void;

  /**
   * 포커스 상태 직접 설정
   */
  setFocused: (focused: boolean) => void;
}

// ============================================
// Hook
// ============================================

/**
 * useInputState 훅
 *
 * Input/TextArea 컴포넌트의 상태 관리 로직을 제공합니다.
 * 포커스, 에러, 성공 상태를 기반으로 현재 필드 상태를 계산합니다.
 *
 * 우선순위: error > success > focus > default
 *
 * @param config - 상태 설정
 * @returns 상태 및 핸들러
 *
 * @example
 * function MyInput({ isError, isSuccess }) {
 *   const { state, isFocused, handleFocus, handleBlur } = useInputState({
 *     isError,
 *     isSuccess,
 *   });
 *
 *   return (
 *     <input
 *       onFocus={handleFocus}
 *       onBlur={handleBlur}
 *       className={getStyleForState(state)}
 *     />
 *   );
 * }
 *
 * @example
 * // 포커스 변경 감지
 * const { state, isFocused } = useInputState({
 *   isError: false,
 *   onFocusChange: (focused) => {
 *     console.log('Focus changed:', focused);
 *   },
 * });
 */
export function useInputState({
  isError = false,
  isSuccess = false,
  initialFocused = false,
  onFocusChange,
}: UseInputStateConfig = {}): UseInputStateReturn {
  const [isFocused, setIsFocused] = useState(initialFocused);

  /**
   * 현재 Input 상태를 계산합니다
   * 우선순위:
   * 1. error가 있으면 항상 error (focus 여부 무관)
   * 2. focus 중이면 focus (success 무시)
   * 3. blur 상태에서 success면 success
   * 4. 기본 상태
   */
  const state: FieldState = (() => {
    // 에러가 있으면 항상 에러 (focus 중이어도)
    if (isError) return 'error';

    // focus 중이면 focus (success 무시)
    if (isFocused) return 'focus';

    // blur 상태에서 success
    if (isSuccess) return 'success';

    // 기본 상태
    return 'default';
  })();

  /**
   * Focus 핸들러
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocusChange?.(true);
  }, [onFocusChange]);

  /**
   * Blur 핸들러
   */
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocusChange?.(false);
  }, [onFocusChange]);

  /**
   * 포커스 상태 직접 설정
   */
  const setFocused = useCallback(
    (focused: boolean) => {
      setIsFocused(focused);
      onFocusChange?.(focused);
    },
    [onFocusChange],
  );

  return {
    state,
    isFocused,
    handleFocus,
    handleBlur,
    setFocused,
  };
}
