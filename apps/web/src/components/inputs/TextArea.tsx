'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * TextArea 컴포넌트의 상태 타입
 */
type InputState = 'default' | 'focus' | 'error' | 'success';

/**
 * TextArea 컴포넌트 Props 인터페이스
 */
interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isError?: boolean;
  isSuccess?: boolean;
  errorMessage?: string;
  helpMessage?: string;
  className?: string;
  inputClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  /** 최대 글자 수 */
  maxLength?: number;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      onChange,
      maxLength, // ✨ 추가된 prop
      value, // 컨트롤드 사용 시
      defaultValue, // 언컨트롤드 초기값
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    // ✨ 현재 글자 수 상태
    const [valueLength, setValueLength] = useState(
      // 초기값: value 혹은 defaultValue 기반
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0,
    );

    // InputState 계산
    const getInputState = (): InputState => {
      if (isError) return 'error';
      if (isSuccess) return 'success';
      if (isFocused) return 'focus';
      return 'default';
    };

    // 상태별 border/ring 클래스
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

    const handleFocus = (
      e: React.FocusEvent<HTMLTextAreaElement>,
    ) => {
      setIsFocused(true);
      onFocus?.(e);
    };
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // 글자 수 변경 핸들러
    const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setValueLength(e.target.value.length);
      onChange?.(e);
    };

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

        {/* TextArea Container (상대 위치 지정) */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <button
              type="button"
              disabled={disabled || !onLeftIconClick}
              aria-label="Left icon button"
              className={twMerge(
                'absolute top-3 left-3 z-10',
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

          {/* TextArea Field */}
          <textarea
            ref={ref}
            id={id}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange} // ✨ 변경된 부분
            aria-invalid={isError || undefined}
            aria-describedby={describedBy}
            className={twMerge(
              'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200',
              'placeholder:text-gray-400 focus:outline-none',
              'dark:bg-neutral-900 dark:text-neutral-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              borderClass,
              disabledClass,
              inputClassName,
            )}
            maxLength={maxLength} // ✨ 최대 글자 수 설정
            value={value}
            defaultValue={defaultValue}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <button
              type="button"
              disabled={disabled || !onRightIconClick}
              aria-label="Right icon button"
              className={twMerge(
                'absolute top-3 right-3 z-10',
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

          {/* ✨ 글자 수 표시 */}
          {maxLength != null && (
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              {valueLength} / {maxLength}
            </div>
          )}
        </div>

        {/* 에러/헬프 메시지 */}
        {(errorMessage || helpMessage) && (
          <div className="mt-1 min-h-[1.25rem]">
            {errorMessage ? (
              <p
                id={errorId}
                role="alert"
                aria-live="polite"
                className="flex items-center gap-1 text-xs text-red-600"
              >
                {errorMessage}
              </p>
            ) : (
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

TextArea.displayName = 'TextArea';

export default TextArea;
