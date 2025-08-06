'use client';

import { twMerge } from 'tailwind-merge';
import { useOverlay } from '@/hooks/ui/useOverlay';
import FloatingMenu, { type CategoryItem } from './FloatingMenu';
import { PenLine } from 'lucide-react';

/**
 * FloatingButton 컴포넌트 Props
 */
export interface FloatingButtonProps {
  /** 카테고리 목록 */
  categories: CategoryItem[];
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 플로팅 액션 버튼 컴포넌트
 *
 * @description 카테고리 메뉴를 오버레이로 표시하는 플로팅 버튼
 * - 클릭 시 useOverlay를 통해 FloatingMenu 표시
 * - 백드롭 클릭으로 메뉴 닫기 가능
 * - 접근성 속성 완전 지원
 */
export default function FloatingButton({
  categories,
  className,
}: FloatingButtonProps) {
  const { openOverlay } = useOverlay();

  /**
   * 메뉴 열기 함수
   */
  const handleOpenMenu = () => {
    openOverlay(<FloatingMenu categories={categories} />, {
      backdrop: true, // 백드롭 클릭 시 자동 닫기는 useOverlay 기본 동작에 의존
    });
  };
  /** 백드롭 클릭 시 메뉴 닫기
   * @todo useOverlay 훅에서 백드롭 클릭 시 자동 닫기 기능을 구현
   */

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
      onClick={handleOpenMenu}
    >
      <PenLine />
    </button>
  );
}
