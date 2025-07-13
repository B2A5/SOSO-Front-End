import React from 'react';
import { twMerge } from 'tailwind-merge';

/** 스피너 프로퍼티 */
export interface SpinnerProps {
  /** Tailwind 색상 클래스 (예: text-green-500) */
  color?: string;
  /** 추가 클래스 */
  className?: string;
  /** 스크린리더용 문구 */
  srText?: string;
}

/**
 * 개선된 스피너 컴포넌트
 * 버튼 내부에서 깔끔하게 정렬되도록 최적화
 */
export const Spinner: React.FC<SpinnerProps> = ({
  color = 'text-current',
  className,
  srText = 'Loading...',
}) => {
  return (
    <>
      <svg
        className={twMerge(
          'animate-spin flex-shrink-0', // flex-shrink-0으로 크기 고정
          color,
          className, // 부모에서 크기 지정 (w-4 h-4 등)
        )}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          fill="currentColor"
          className="opacity-75"
        />
      </svg>
      <span className="sr-only">{srText}</span>
    </>
  );
};
