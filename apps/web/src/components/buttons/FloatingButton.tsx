'use client';

import { useEffect, useRef, useState } from 'react';
import AsideButton from './AsideButton';
import { CATEGORY_LIST } from './constant';
import { twMerge } from 'tailwind-merge';
import FloatingOpenIcon from '@/assets/images/FloatingOpenImage';
import FloatingCloseIcon from '@/assets/images/FloatingCloseImage';
import { useOverlay } from '@/hooks/ui/useOverlay';

/** * 플로팅 버튼 컴포넌트
 * - AsideButton을 사용하여 카테고리 목록을 표시
 * - 버튼 클릭 시 AsideButton이 열리고 닫히는 기능 포함
 * - 애니메이션 효과 적용
 * - 키보드 접근성
 */
export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false); //애니메이션 제어 전용
  const [isMounted, setIsMounted] = useState(false); // 렌더링 제어 전용
  const floatingButtonRef = useRef<HTMLButtonElement>(null); // 포커스 제어용 플로팅 버튼 참조
  const { openOverlay, closeOverlay } = useOverlay(); // 오버레이 제어 훅

  /*  키보드 접근성 관련  */
  // 메뉴 열릴 때 첫 번째 버튼에 포커스
  useEffect(() => {
    if (isOpen) {
      const firstButton = document.querySelector(
        '#floating-menu button',
      );
      (firstButton as HTMLButtonElement)?.focus();
    }
  }, [isOpen]);

  //esc 누르면 메뉴 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        floatingButtonRef.current?.focus(); //플로팅 버튼에 포커스 이동동
        openOverlay(<></>, { backdrop: true }); // 오버레이 열기
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  //방향키로 포커스 이동
  const handleArrowKeyNavigation = (e: React.KeyboardEvent) => {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        '#floating-menu button',
      ),
    );

    const currentIndex = buttons.findIndex(
      (btn) => btn === document.activeElement,
    );
    if (currentIndex === -1) return;

    const columnCount = 2;
    const maxIndex = buttons.length - 1;
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columnCount;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - columnCount;
        break;
      default:
        return;
    }

    if (nextIndex >= 0 && nextIndex <= maxIndex) {
      e.preventDefault(); // 기본 동작(스크롤 등) 방지
      buttons[nextIndex].focus();
    }
  };

  //플로팅 버튼 클릭시 상태를 변경하는 이벤트 핸들러
  const handleFloatingButtonClick = () => {
    if (!isOpen) {
      setIsMounted(true); // 바로 렌더링
      setIsOpen(true); // fade-in 바로 작동
      openOverlay(<></>, { backdrop: true }); // 오버레이 열기
    } else {
      setIsOpen(false); // fade-out 클래스 붙이기
      closeOverlay(); // 오버레이 닫기
    }
  };

  //애니메이션 끝나는 시점에 DOM 제거
  const handleAnimationEnd = () => {
    if (!isOpen) setIsMounted(false);
  };

  return (
    <aside className="fixed bottom-20 right-4 flex flex-col items-end gap-5">
      {/* 플로팅 메뉴 */}
      {isMounted && (
        <ul
          id="floating-menu"
          role="menu"
          aria-hidden={!isOpen}
          className={twMerge(`
            z-3000 
            grid grid-cols-2 gap-4 w-max
            transition-all duration-300 ease-out
            ${isOpen ? 'fade-in ' : 'fade-out '}
          `)}
          onAnimationEnd={() => {
            handleAnimationEnd();
          }}
          onKeyDown={handleArrowKeyNavigation}
        >
          {CATEGORY_LIST.map(({ value, label }) => (
            <li key={value} role="none">
              <AsideButton value={value} label={label} />
            </li>
          ))}
        </ul>
      )}
      {/* 플로팅 버튼 (토글용) */}
      <button
        aria-label={isOpen ? '카테고리 닫기' : '카테고리 열기'}
        aria-haspopup="menu" // 메뉴를 여는 토글 버튼임을 명시
        aria-controls="floating-menu" // 연결된 메뉴의 id 속성값
        aria-expanded={isOpen}
        ref={floatingButtonRef}
        className={twMerge(`
          z-3000
          w-12 h-12 rounded-full text-white shadow-lg border-2 border-soso-600 transition-colors duration-200
          ${isOpen ? 'bg-soso-600' : 'bg-white text-soso-600 '}
        `)}
        onClick={handleFloatingButtonClick}
      >
        {isOpen ? (
          <FloatingCloseIcon /> // 닫기용 아이콘
        ) : (
          <FloatingOpenIcon /> // 열기용 아이콘
        )}
      </button>
    </aside>
  );
}
