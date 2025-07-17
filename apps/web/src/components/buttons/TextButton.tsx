'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTap } from '@/hooks/ui/useTap';

type TextButtonTheme = 'soso' | 'gray';

export interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: TextButtonTheme;
}

/**
 * TextButton
 * - 배경 없는 텍스트 기반 버튼.
 * - 테마: 'soso' | 'gray'
 * - 로딩 없음, 아이콘 없음, 단일 사이즈.
 * - tap 애니메이션 / 접근성 focus ring 지원.
 */
export const TextButton = React.forwardRef<
  HTMLButtonElement,
  TextButtonProps
>(
  (
    { theme = 'soso', disabled, className, children, ...rest },
    ref,
  ) => {
    const [pressed, bind] = useTap();

    /* 접근성 focus */
    const FOCUS_CLASS =
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    /* 테마별 색상 */
    const themeClassMap: Record<TextButtonTheme, string> = {
      soso: 'text-soso-600 hover:text-soso-500 active:text-soso-800',
      gray: 'text-fontColor-gray1 hover:text-fontColor-gray2 active:text-black',
    };

    /* disabled 스타일 */
    const disabledClassMap: Record<TextButtonTheme, string> = {
      soso: 'disabled:text-fontColor-gray1 disabled:bg-neutral-100',
      gray: 'disabled:text-fontColor-gray1 disabled:bg-neutral-100',
    };

    /* 기본 텍스트 스타일 */
    const baseTextClass = 'text-base font-medium leading-none';

    /* 내부 tap scale */
    const innerScaleClass = twMerge(
      'inline-flex items-center justify-center gap-1 transition-transform duration-150 ease-out',
      pressed && !disabled ? 'scale-95' : 'scale-100',
    );

    const rootClass = twMerge(
      'inline-flex items-center justify-center select-none bg-transparent rounded-sm',
      'transition-colors duration-100 ease-out',
      FOCUS_CLASS,
      baseTextClass,
      themeClassMap[theme],
      disabled && disabledClassMap[theme],
      disabled && 'disabled:pointer-events-none',
      className,
    );

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        data-pressed={pressed || undefined}
        className={rootClass}
        {...(!disabled ? bind : {})}
        {...rest}
      >
        <span className={innerScaleClass}>
          <span className="truncate">{children}</span>
        </span>
      </button>
    );
  },
);

TextButton.displayName = 'TextButton';

export default TextButton;
