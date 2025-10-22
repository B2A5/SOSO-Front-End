'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useInputState } from '@/hooks/ui/useInputState';
import { useFieldAnimation } from '@/hooks/ui/useFieldAnimation';
import { AnimatedMessage } from '@/components/primitives/AnimatedMessage';
import { Pressable } from '@/components/primitives/Pressable';
import { FOCUS_ANIMATION } from '@/styles/tokens/animation';

/**
 * Input 컴포넌트 Props 인터페이스
 */
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 라벨 텍스트 */
  label?: string;
  /** 좌측 아이콘 컴포넌트 */
  leftIcon?: React.ReactNode;
  /** 우측 아이콘 컴포넌트 */
  rightIcon?: React.ReactNode;
  /** 에러 상태 여부 */
  isError?: boolean;
  /** 성공 상태 여부 */
  isSuccess?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 헬프 메시지 */
  helpMessage?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 입력 필드 추가 클래스명 */
  inputClassName?: string;
  /** 좌측 아이콘 클릭 핸들러 */
  onLeftIconClick?: () => void;
  /** 우측 아이콘 클릭 핸들러 */
  onRightIconClick?: () => void;
}

/**
 * 공통 Input 컴포넌트
 *
 * @description
 * - 좌측/우측 아이콘 지원
 * - 상태별 스타일링 (default, focus, error, success)
 * - 에러/헬프 메시지 표시
 * - 완전한 접근성 지원
 *
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      isError = false,
      isSuccess = false,
      errorMessage,
      helpMessage,
      className,
      inputClassName,
      disabled = false,
      id,
      onLeftIconClick,
      onRightIconClick,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    // 상태 관리 훅
    const {
      state,
      handleFocus: onFocusInternal,
      handleBlur: onBlurInternal,
    } = useInputState({
      isError,
      isSuccess,
    });

    // 애니메이션 훅
    const { borderClass, ringClass } = useFieldAnimation({ state });

    /**
     * Focus 이벤트 핸들러
     */
    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement>,
    ) => {
      onFocusInternal();
      onFocus?.(event);
    };

    /**
     * Blur 이벤트 핸들러
     */
    const handleBlur = (
      event: React.FocusEvent<HTMLInputElement>,
    ) => {
      onBlurInternal();
      onBlur?.(event);
    };

    /**
     * 아이콘 클릭 핸들러 (disabled 상태일 때 무시)
     */
    const handleIconClick = (handler?: () => void) => {
      if (disabled) return;
      handler?.();
    };

    const disabledClass = disabled
      ? 'bg-gray-50 cursor-not-allowed'
      : 'bg-white';

    // aria 연결을 위한 ID 생성
    const errorId = errorMessage && id ? `${id}-error` : undefined;
    const helpId = helpMessage && id ? `${id}-help` : undefined;
    const describedBy =
      [errorId, helpId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={twMerge('flex w-full flex-col', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              'mb-2 text-sm font-medium text-neutral-1000 dark:text-neutral-200',
              disabled && 'text-gray-400',
            )}
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-label="필수">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <button
              type="button"
              disabled={disabled || !onLeftIconClick}
              aria-label="Left icon button"
              className={twMerge(
                'absolute top-1/2 left-3 z-10 -translate-y-1/2 transform',
                'rounded p-1 transition-transform',
                onLeftIconClick && !disabled
                  ? 'cursor-pointer'
                  : 'cursor-default',
                disabled && 'opacity-50',
                !onLeftIconClick && 'pointer-events-none',
              )}
              onClick={() => handleIconClick(onLeftIconClick)}
            >
              {leftIcon}
            </button>
          )}

          {/* Input Field */}
          <Pressable disabled={disabled} className="w-full">
            <motion.input
              ref={ref}
              id={id}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={isError || undefined}
              aria-describedby={describedBy}
              className={twMerge(
                'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200',
                'placeholder:text-gray-400',
                'dark:bg-neutral-900 dark:text-neutral-200',
                // 키보드 포커스 스타일 (접근성)
                FOCUS_ANIMATION.ring,
                // 아이콘 위치에 따른 패딩
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                // 상태 스타일 (border + ring)
                borderClass,
                ringClass,
                disabledClass,
                inputClassName,
              )}
              {...(props as Omit<
                HTMLMotionProps<'input'>,
                'animate'
              >)}
            />
          </Pressable>

          {/* Right Icon */}
          {rightIcon && (
            <button
              type="button"
              disabled={disabled || !onRightIconClick}
              aria-label="Right icon button"
              className={twMerge(
                'absolute top-1/2 right-3 z-10 -translate-y-1/2 transform',
                'rounded p-1 transition-transform',
                onRightIconClick && !disabled
                  ? 'cursor-pointer'
                  : 'cursor-default',
                disabled && 'opacity-50',
                !onRightIconClick && 'pointer-events-none',
              )}
              onClick={() => handleIconClick(onRightIconClick)}
            >
              {rightIcon}
            </button>
          )}
        </div>

        {/* Message - AnimatedMessage 사용 */}
        <AnimatedMessage
          message={errorMessage || helpMessage}
          type={errorMessage ? 'error' : 'help'}
          id={errorMessage ? errorId : helpId}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
