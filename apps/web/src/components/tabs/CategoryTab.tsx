import React, { useState } from 'react';
import { Categories } from '@/types/tab.types';
import { Pressable } from '../Pressable';

/**
 * 미니멀한 디자인의 카테고리 탭 컴포넌트
 * 탭이 많을 경우 가로 스크롤이 가능하며, 기본적으로는 균등 분배됩니다.
 *
 * @param {TabsProps} props - 컴포넌트 props
 * @returns {JSX.Element} 탭 컴포넌트
 */

interface CategoryTabProps {
  tabs?: Categories[]; // 탭 목록
  defaultValue?: Categories['value']; // 기본 선택된 탭의 value
  onChange?: (value: Categories['value']) => void; // 탭 변경 시 호출되는 콜백 함수
  className?: string; // 추가 CSS 클래스명
}
export function CategoryTab({
  tabs = [],
  defaultValue,
  onChange,
  className = '',
}: CategoryTabProps) {
  const [activeTab, setActiveTab] = useState(
    defaultValue || tabs[0]?.value,
  );

  /**
   * 탭 클릭 핸들러
   * @param {string} value - 선택된 탭의 value
   */
  const handleTabClick = (value: Categories['value']) => {
    setActiveTab(value);
    onChange?.(value);
  };

  /**
   * 탭이 많은지 확인하는 함수 (7개 이상일 때 스크롤 모드)
   * @returns {boolean} 스크롤 모드 여부
   */
  const isScrollMode = tabs.length > 6;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          flex gap-2 p-1 bg-gray-100 rounded-full
          ${
            isScrollMode
              ? 'overflow-x-auto scrollbar-hide'
              : 'justify-evenly'
          }
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tabs.map((tab) => (
          <Pressable key={tab.value}>
            <button
              className={`
                px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 ease-in-out
              whitespace-nowrap
              ${isScrollMode ? 'flex-shrink-0 min-w-fit' : 'flex-1'}
              ${
                activeTab === tab.value
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }
            `}
              onClick={() => handleTabClick(tab.value)}
            >
              {tab.label}
            </button>
          </Pressable>
        ))}
      </div>
    </div>
  );
}
