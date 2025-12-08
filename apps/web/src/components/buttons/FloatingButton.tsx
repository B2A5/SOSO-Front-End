'use client';

import { twMerge } from 'tailwind-merge';
import { PenLine } from 'lucide-react';

/**
 * FloatingButton 컴포넌트 Props
 */
export interface FloatingButtonProps {
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 플로팅 액션 버튼 컴포넌트
 */
export default function FloatingButton({
  className,
  onClick,
}: FloatingButtonProps) {
  return (
    <button
      type="button"
      aria-label="카테고리 메뉴 열기"
      aria-haspopup="menu"
      className={twMerge(
        // 기본 스타일
        'fixed bottom-20 right-4 z-40',
        'w-12 h-12 rounded-full',
        'text-white bg-soso-600 border-2 border-soso-600',
        'shadow-lg hover:shadow-xl',
        // 애니메이션 및 상호작용
        'transition-all duration-200 ease-in-out',

        'hover:scale-105 active:scale-95',
        // 포커스 스타일
        'focus:outline-none focus:ring-2 focus:ring-soso-300',
        'flex items-center justify-center',
        className,
      )}
      onClick={onClick}
    >
      <PenLine />
    </button>
  );
}
