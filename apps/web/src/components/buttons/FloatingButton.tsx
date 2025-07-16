'use client';

import { useState } from 'react';
import AsideButton from './AsideButton';
import { CATEGORY_LIST } from './constant';
import { twMerge } from 'tailwind-merge';

/** * 플로팅 버튼 컴포넌트
 * - AsideButton을 사용하여 카테고리 목록을 표시
 * - 버튼 클릭 시 AsideButton이 열리고 닫히는 기능 포함
 * - 외부 클릭 시 AsideButton 닫힘
 * - 애니메이션 효과 적용
 */
export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false); //애니메이션 제어 전용
  const [isVisible, setIsVisible] = useState(false); // 렌더링 제어 전용

  //플로팅 버튼 클릭시 상태를 변경하는 이벤트 핸들러
  const handleFloatingButtonClick = () => {
    if (!isOpen) {
      setIsVisible(true); // 바로 렌더링
      setIsOpen(true); // fade-in 바로 작동
    } else {
      setIsOpen(false); // fade-out 클래스 붙이기
    }
  };

  const handleAnimationEnd = () => {
    if (!isOpen) setIsVisible(false);
  };

  return (
    <aside className="fixed bottom-20 right-4 flex flex-col items-end gap-5">
      {/* 플로팅 메뉴 */}
      {isVisible && (
        <ul
          id="floating-menu"
          role="menu"
          aria-hidden={!isOpen}
          className={twMerge(`
            z-50 
            grid grid-cols-2 gap-4 w-max
            transition-all duration-300 ease-out
            ${isOpen ? 'fade-in ' : 'fade-out pointer-events-none'}
          `)}
          onAnimationEnd={() => {
            handleAnimationEnd();
          }}
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
        className={twMerge(`
          z-50
          w-12 h-12 rounded-full text-white shadow-lg border-2 border-soso-600 transition-colors duration-200
          ${isOpen ? 'bg-soso-600' : 'bg-white text-soso-600 '}
        `)}
        onClick={handleFloatingButtonClick}
      >
        +
      </button>
      {/* 오버레이 */}
      {isVisible && (
        <div
          onClick={() => setIsOpen(false)}
          className={twMerge(`
            fixed inset-0 z-40 backdrop-blur-sm bg-black/30
            ${isOpen ? 'fade-in' : 'fade-out pointer-events-none'}
          `)}
          onAnimationEnd={() => {
            handleAnimationEnd();
          }}
          aria-hidden="true"
        />
      )}
    </aside>
  );
}
