'use client';

import { useEffect, useRef, useState } from 'react';

import { twMerge } from 'tailwind-merge';
import { useOverlay } from '@/hooks/ui/useOverlay';
import Pressable from '../Pressable';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

/**
 * 카테고리 아이템 타입 정의
 */
export interface CategoryItem {
  /** 카테고리 값 (라우팅에 사용) */
  value: string;
  /** 카테고리 레이블 */
  label: string;
}

/**
 * FloatingMenu 컴포넌트 Props
 */
export interface FloatingMenuProps {
  /** 카테고리 목록 */
  categories: CategoryItem[];
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 플로팅 메뉴 컴포넌트
 *
 * @description 오버레이 내부에서 렌더링되는 카테고리 메뉴
 * - 그리드 레이아웃으로 카테고리 버튼들 표시
 * - 키보드 접근성 지원 (방향키, ESC, Enter)
 * - CSS 기반 fade-in 애니메이션
 * - 메뉴 아이템 클릭 시 자동 닫기 및 페이지 이동
 */
export default function FloatingMenu({
  categories,
  className,
}: FloatingMenuProps) {
  const menuRef = useRef<HTMLUListElement>(null);
  const [pressedButton, setPressedButton] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { closeOverlay } = useOverlay();
  /**
   * 컴포넌트 마운트 시 첫 번째 버튼에 포커스
   */
  useEffect(() => {
    const firstButton = menuRef.current?.querySelector(
      'button',
    ) as HTMLButtonElement;
    firstButton?.focus();
    // // 약간의 지연을 두어 애니메이션 완료 후 포커스
    // const timer = setTimeout(() => {
    //   firstButton?.focus();
    // }, 150);

    // return () => clearTimeout(timer);
  }, []);

  /**
   * 키보드 접근성 처리
   * - ESC: 메뉴 닫기
   * - Enter/Space: 현재 포커스된 버튼 클릭
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          closeOverlay();
          break;
        case 'Enter':
        case ' ':
          // 현재 포커스된 요소가 버튼이면 클릭
          const activeElement =
            document.activeElement as HTMLButtonElement;
          if (activeElement?.tagName === 'BUTTON') {
            event.preventDefault();
            activeElement.click();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () =>
      document.removeEventListener('keydown', handleKeyDown);
  }, [closeOverlay]);

  const handleButtonClick = (value: string) => {
    closeOverlay();
    router.push(`/category/${value}`);
  };

  /**
   * 방향키로 포커스 이동 처리
   * 2열 그리드 구조에서 방향키 네비게이션
   */
  const handleArrowKeyNavigation = (event: React.KeyboardEvent) => {
    const buttons = Array.from(
      menuRef.current?.querySelectorAll('button') || [],
    ) as HTMLButtonElement[];

    const currentIndex = buttons.findIndex(
      (btn) => btn === document.activeElement,
    );
    if (currentIndex === -1) return;

    const COLUMN_COUNT = 2;
    const maxIndex = buttons.length - 1;
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = Math.min(currentIndex + 1, maxIndex);
        break;
      case 'ArrowLeft':
        nextIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        nextIndex = Math.min(currentIndex + COLUMN_COUNT, maxIndex);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(currentIndex - COLUMN_COUNT, 0);
        break;
      default:
        return;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      buttons[nextIndex]?.focus();
    }
  };

  /**
   * 버튼 pressed 상태 핸들러들
   */
  const handlePointerDown = (value: string) => {
    setPressedButton(value);
  };

  const handlePointerUp = () => {
    setPressedButton(null);
  };

  const handlePointerLeave = () => {
    setPressedButton(null);
  };

  return (
    <div className="fixed bottom-32 right-4 z-50">
      <ul
        ref={menuRef}
        role="menu"
        aria-label="카테고리 메뉴"
        className={twMerge(
          'grid grid-cols-2 gap-4 w-max p-4',
          'animate-fade-in-up',
          className,
        )}
        onKeyDown={handleArrowKeyNavigation}
      >
        {categories.map(({ value, label }) => {
          return (
            <Pressable key={value}>
              <button
                value={value}
                onPointerDown={() => handlePointerDown(value)}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onClick={() => handleButtonClick(value)}
                aria-label={`${label} 카테고리 글쓰기`}
                className={twMerge(
                  'w-25 h-12 px-4 text-body rounded-3xl transition-colors duration-150 ease-in-out',
                  'border border-transparent',
                  'focus:outline-none',
                  'focus:bg-soso-0 focus:text-soso-600',
                  'hover:bg-soso-0 hover:text-soso-600',
                  `${pressedButton === value ? 'bg-soso-0 text-soso-600' : 'bg-white text-fontColor-gray3'}`,
                )}
              >
                {label}
              </button>
            </Pressable>
          );
        })}
      </ul>
      <div>
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={closeOverlay}
          className={twMerge(
            'absolute -bottom-12 right-0',
            'w-12 h-12 rounded-full',
            'flex items-center justify-center',
            'shadow-lg hover:shadow-xl',
            'transition-all duration-200 ease-in-out',
            'hover:scale-105 active:scale-95',
            'text-white bg-soso-600 border-2 border-soso-600',
            'focus:outline-none focus:ring-2 focus:ring-soso-300',
          )}
        >
          <X />
        </button>
      </div>
    </div>
  );
}
