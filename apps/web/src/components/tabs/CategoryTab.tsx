import React, { useState } from 'react';
import { Categories } from '@/constants/categories';
import { Pressable } from '../Pressable';
import { twMerge } from 'tailwind-merge';

/**
 * 반응형 카테고리 탭 컴포넌트 (단순 접근법)
 * 화면 크기에 관계없이 항상 스크롤 가능하며,
 * 반응형 패딩과 개선된 다크모드를 지원합니다.
 *
 * @param {CategoryTabProps} props - 컴포넌트 props
 */
interface CategoryTabProps {
  tabs?: Categories[];
  defaultValue?: Categories['value'];
  onChange?: (value: Categories['value']) => void;
  className?: string;
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
   * @param {Categories['value']} value - 선택된 탭의 value
   */
  const handleTabClick = (value: Categories['value']) => {
    setActiveTab(value);
    onChange?.(value); // 🔧 onChange 호출 복원
  };

  return (
    <div className={twMerge('w-full', className)}>
      <div
        className="
          flex gap-2 p-3 overflow-x-auto scrollbar-hide
          bg-fontColor-lightgray dark:bg-neutral-900
        "
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tabs.map((tab) => (
          <Pressable key={tab.value}>
            <button
              className={twMerge(
                // 기본 스타일
                'px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap',
                'transition-all duration-200 ease-in-out flex-shrink-0',
                'border border-neutral-200 dark:border-neutral-700',

                // 반응형 크기
                'sm:px-4 lg:px-5 sm:py-2',
                'min-w-fit',

                // 활성/비활성 상태
                activeTab === tab.value
                  ? 'font-bold bg-soso-500 text-white shadow-sm border-soso-600 dark:border-soso-600'
                  : 'bg-white hover:font-bold text-fontColor-gray2 dark:text-neutral-400 hover:border-soso-600 dark:hover:border-neutral-800 hover:text-soso-600 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:bg-neutral-800',
              )}
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
