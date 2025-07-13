import React from 'react';
import clsx from 'clsx';

/** 스피너 프로퍼티 */
export interface SpinnerProps {
  /** Tailwind 색상 클래스 (예: text-green-500) */
  color?: string;
  /** 추가 클래스 (w-* / h-* 등 자유롭게 지정) */
  className?: string;
  /** 스크린리더용 문구 */
  srText?: string;
}

/**
 * SVG 한 장으로 구현한 심플 로딩 스피너
 * * 부모의 크기(w/h) 그대로 상속 → 기본값 w-full h-full
 */
export const Spinner: React.FC<SpinnerProps> = ({
  color = 'text-current',
  className,
  srText = 'Loading...',
}) => {
  return (
    <div role="status">
      <svg
        className={clsx(
          'animate-spin w-full h-full', // ⭐ 부모 크기 자동 적용
          color,
          className, // 필요 시 직접 w-4 h-4 등 덮어쓰기
        )}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{srText}</span>
    </div>
  );
};

export default Spinner;
