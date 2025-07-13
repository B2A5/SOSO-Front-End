import React from 'react';
import clsx from 'clsx';
import { useTap } from '@/hooks/ui/useTap';
import { Spinner } from '@/components/loadings/Spinner';

/* ---------- 1. 타입 ---------- */

type Variant = 'filled' | 'outlined';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 색상·테마 */
  variant?: Variant;
  /** 크기 */
  size?: Size;
  /** 전체 폭 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 로딩 문구 (시각) */
  loadingText?: string;
  /** 아이콘 (앞) */
  startIcon?: React.ReactNode;
  /** 아이콘 (뒤) */
  endIcon?: React.ReactNode;
}

/* ---------- 2. 스타일 토큰 ---------- */

/** 변형별 Tailwind 클래스 */
const variantMap: Record<Variant, string> = {
  filled:
    'bg-green-500 text-white hover:bg-green-700 focus-visible:ring-green-500 disabled:bg-green-300',
  outlined:
    'bg-transparent text-green-600 border border-green-600 hover:bg-green-600 hover:text-white focus-visible:ring-green-500 disabled:border-green-300 disabled:text-green-300',
};

/** 크기별 Tailwind 클래스 */
const sizeMap: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm space-x-1',
  md: 'h-10 px-4 text-base space-x-2',
  lg: 'h-12 px-6 text-lg space-x-3',
};

/** ✅ NEW: 로딩 스피너 크기 클래스 매핑 */
const spinnerClassMap: Record<Size, string> = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

/* ---------- 3. 컴포넌트 ---------- */

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      /** ✅ CHANGED: 기본 variant → 'filled' */
      variant = 'filled',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      loadingText = 'Loading…',
      startIcon,
      endIcon,
      className,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    /* tap 애니메이션 */
    const [pressed, bind] = useTap();

    const isDisabled = disabled || isLoading;

    const classes = clsx(
      'interactive tap:scale-tap',
      'inline-flex items-center justify-center rounded-lg transition-transform duration-tap ease-spring-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50 select-none',
      variantMap[variant],
      sizeMap[size],
      fullWidth && 'w-full',
      className,
    );

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        data-pressed={pressed || undefined}
        className={classes}
        {...bind}
        {...rest}
      >
        {/* 로딩 상태 */}
        {isLoading ? (
          <>
            {/* ✅ CHANGED: size prop 제거, className으로 크기 지정 */}
            <Spinner
              className={clsx(
                'shrink-0',
                spinnerClassMap[size],
              )}
              color="text-current"
            />
            <span className="truncate">
              {loadingText}
            </span>
          </>
        ) : (
          <>
            {startIcon && (
              <span className="shrink-0">
                {startIcon}
              </span>
            )}
            <span className="truncate">
              {children}
            </span>
            {endIcon && (
              <span className="shrink-0">
                {endIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
