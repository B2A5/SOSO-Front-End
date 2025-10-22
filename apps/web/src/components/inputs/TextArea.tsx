'use client';

import React, { useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useInputState } from '@/hooks/ui/useInputState';
import { useFieldAnimation } from '@/hooks/ui/useFieldAnimation';
import { AnimatedMessage } from '@/components/primitives/AnimatedMessage';
import { Pressable } from '@/components/primitives/Pressable';
import { FOCUS_ANIMATION } from '@/styles/tokens/animation';

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
    // 글자 수 상태
    const [valueLength, setValueLength] = useState(
      // 초기값: value 혹은 defaultValue 기반
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0,
    );

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

    const handleFocus = (
      e: React.FocusEvent<HTMLTextAreaElement>,
    ) => {
      onFocusInternal();
      onFocus?.(e);
    };
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlurInternal();
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
          <Pressable disabled={disabled} className="w-full">
            <motion.textarea
              ref={ref}
              id={id}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
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
              maxLength={maxLength}
              value={value}
              defaultValue={defaultValue}
              {...(props as Omit<
                HTMLMotionProps<'textarea'>,
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

        {/* 에러/헬프 메시지 - AnimatedMessage 사용 */}
        <AnimatedMessage
          message={errorMessage || helpMessage}
          type={errorMessage ? 'error' : 'help'}
          id={errorMessage ? errorId : helpId}
        />
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
