import React from 'react';
import clsx from 'clsx';

/**
 * 사이즈별 Tailwind 클래스
 */
const sizeMap = {
  sm: 'w-4 h-4', // 버튼 안
  md: 'w-8 h-8', // 일반
  lg: 'w-12 h-12', // 모달/오버레이
} as const;

type SpinnerSize = keyof typeof sizeMap;

/**
 * 프로퍼티 정의
 */
export interface SpinnerProps {
  size?: SpinnerSize; // 기본 md
  color?: string; // Tailwind 색상 클래스 (ex: text-green-500)
  /** 오버레이 & 중앙 정렬 */
  overlay?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** 스크린리더용 메시지 */
  srText?: string;
}

/**
 * SVG 한 장으로 끝내는 심플 로딩 스피너
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-current',
  overlay = false,
  className,
  srText = 'Loading...',
}) => {
  const svg = (
    <svg
      className={clsx(
        'animate-spin',
        sizeMap[size],
        color,
        className,
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
  );

  const content = (
    <div role="status">
      {svg}
      <span className="sr-only">{srText}</span>
    </div>
  );

  if (!overlay) return content;

  /* overlay 옵션 → 풀 스크린 중앙 + 반투명 배경 + 블러 */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {content}
    </div>
  );
};

export default Spinner;
