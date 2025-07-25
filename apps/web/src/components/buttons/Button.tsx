'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTap } from '@/hooks/ui/useTap';
import { Spinner } from '@/components/loadings/Spinner';

/**
 * Button 컴포넌트
 * 사용자 정의 버튼 컴포넌트로, 다양한 변형(variant)과 크기(size)를 지원합니다.
 * 로딩 상태와 아이콘을 지원하며, 접근성 고려한 키보드 포커스 스타일을 포함합니다.
 *
 * @component
 * @param {Object} props - 컴포넌트 속성
 * @param {Variant} [props.variant='filled'] - 버튼의 변형 스타일
 * @param {Size} [props.size='md'] - 버튼의 크기
 * @param {boolean} [props.isLoading=false] - 로딩 상태 여부
 * @param {string} [props.loadingText='Loading…'] - 로딩 중 표시할 텍스트
 * @param {React.ReactNode} [props.startIcon] - 버튼 앞에 표시할 아이콘
 * @param {React.ReactNode} [props.endIcon] - 버튼 뒤에 표시할 아이콘
 * @param {string} [props.className] - 추가적인 클래스 이름
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} rest - 기타 HTML 속성
 * @returns {JSX.Element} - 렌더링된 버튼 컴포넌트
 */

/* ---------- 1. 타입 ---------- */

type Variant = 'filled' | 'outlined' | 'bottom' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 색상·테마 */
  variant?: Variant;
  /** 크기 */
  size?: Size;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 로딩 문구  */
  loadingText?: string;
  /** 앞에 넣을 아이콘 */
  startIcon?: React.ReactNode;
  /** 뒤에 넣을 아이콘 */
  endIcon?: React.ReactNode;
}

/* ---------- 2. 스타일 토큰 ---------- */

/** 변형별 Tailwind 클래스 */
const variantMap: Record<Variant, string> = {
  filled: 'bg-soso-500 text-white hover:bg-soso-600',
  outlined:
    'bg-white text-soso-600 border border-soso-600 hover:bg-soso-600 hover:text-white',
  bottom:
    'bg-white text-fontColor-gray2 hover:bg-neutral-100 active:text-fontColor-gray3 active:ring-neutral-600',

  ghost:
    'bg-transparent rounded-1 text-neutral-500 hover:text-neutral-400 active:text-neutral-700',
};

/** 비활성화 상태 클래스 */
const disabledMap: Record<Variant, string> = {
  filled: 'disabled:bg-neutral-300 disabled:text-neutral-600',
  outlined:
    'disabled:border-neutral-300 disabled:text-neutral-300 disabled:bg-transparent',
  bottom: 'disabled:bg-neutral-0 disabled:text-fontColor-gray1',

  ghost: 'bg-neutral-0 text-fontColor-gray1',
};

/** 크기별 클래스 */
const sizeMap: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg gap-2.5',
};

/** 스피너 크기별 클래스 */
const spinnerClassMap: Record<Size, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

/* ---------- 3. 컴포넌트 ---------- */

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      variant = 'filled',
      size = 'md',
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

    const isDisabled = disabled;

    // 키보드 및 접근성 클래스
    const FOCUS_CLASS =
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const classes = twMerge(
      'inline-flex items-center justify-center rounded-lg font-medium select-none',
      'transition-transform duration-150 ease-out',
      FOCUS_CLASS,

      // 기본 variant 스타일
      variantMap[variant],

      // disabled만 회색으로
      isDisabled && disabledMap[variant],
      isDisabled && 'disabled:pointer-events-none',

      // 로딩 상태: 포인터 이벤트 막기
      isLoading && 'pointer-events-none',

      // useTap의 pressed 상태에 따라 버튼 자체 스케일 조정
      pressed && !isDisabled && !isLoading ? 'scale-95' : 'scale-100',

      sizeMap[size],
      className,
    );

    // 내부 콘텐츠 래퍼에 스케일 적용
    const innerScaleClass = twMerge(
      'flex items-center justify-center',
      'transition-transform duration-150 ease-out',
      pressed && !isDisabled && !isLoading ? 'scale-95' : 'scale-100',
    );

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        data-pressed={pressed || undefined}
        className={classes}
        {...(!isLoading && !isDisabled ? bind : {})} // 로딩 및 disabled시 tap 이벤트 비활성화
        {...rest}
      >
        <div className={innerScaleClass}>
          {/* 로딩 상태 */}
          {isLoading ? (
            <>
              <Spinner
                className={twMerge(
                  'flex-shrink-0',
                  spinnerClassMap[size],
                )}
                color="text-current"
              />
              {loadingText && (
                <span className="ml-2 truncate">{loadingText}</span>
              )}
            </>
          ) : (
            <>
              {/* 앞 아이콘 */}
              {startIcon && (
                <span className="flex-shrink-0">{startIcon}</span>
              )}

              {/* 텍스트 */}
              <span className="truncate">{children}</span>

              {/* 뒤 아이콘 */}
              {endIcon && (
                <span className="flex-shrink-0">{endIcon}</span>
              )}
            </>
          )}
        </div>
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
