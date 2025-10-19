'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Input 컴포넌트의 상태 타입
 */
type InputState = 'default' | 'focus' | 'error' | 'success';

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
    const [isFocused, setIsFocused] = useState(false);

    /**
     * 현재 Input 상태를 계산합니다
     */
    const getInputState = (): InputState => {
      if (isError) return 'error';
      if (isSuccess) return 'success';
      if (isFocused) return 'focus';
      return 'default';
    };

    /**
     * 상태별 border 클래스를 반환합니다
     */
    const getBorderClass = (state: InputState): string => {
      const borderClasses = {
        default:
          'border-neutral-100 hover:border-neutral-700 dark:border-neutral-700 dark:hover:border-neutral-500',
        focus: 'border-none ring-1 ring-neutral-700',
        error: 'border-none ring-1 ring-red-300',
        success: 'border-none ring-1 ring-soso-500',
      };

      return borderClasses[state];
    };

    /**
     * Focus 이벤트 핸들러
     */
    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement>,
    ) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    /**
     * Blur 이벤트 핸들러
     */
    const handleBlur = (
      event: React.FocusEvent<HTMLInputElement>,
    ) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    /**
     * 아이콘 클릭 핸들러 (disabled 상태일 때 무시)
     */
    const handleIconClick = (handler?: () => void) => {
      if (disabled) return;
      handler?.();
    };

    const currentState = getInputState();
    const borderClass = getBorderClass(currentState);
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
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={isError || undefined}
            aria-describedby={describedBy}
            className={twMerge(
              'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200',
              'placeholder:text-gray-400 focus:outline-none',
              'dark:bg-neutral-900 dark:text-neutral-200',
              // 아이콘 위치에 따른 패딩
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // 상태 스타일
              borderClass,
              disabledClass,
              inputClassName,
            )}
            {...props}
          />

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

        {/* Message */}
        {(errorMessage || helpMessage) && (
          <div className="mt-1 min-h-[1.25rem]">
            {errorMessage && (
              <p
                id={errorId}
                role="alert"
                aria-live="polite"
                className="flex items-center gap-1 text-xs text-red-600"
              >
                {errorMessage}
              </p>
            )}
            {!errorMessage && helpMessage && (
              <p id={helpId} className="text-xs text-gray-500">
                {helpMessage}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
