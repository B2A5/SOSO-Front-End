import React, { useState } from 'react';
import { Pressable } from '../Pressable';
import { twMerge } from 'tailwind-merge';
import { TabItem } from '@/types/tab.types';

/**
 * PillChips 컴포넌트 Props
 *
 * @template T - chip value 타입
 */
interface PillChipsTabProps<T = string> {
  /** Chip 목록 배열 */
  chips: TabItem<T>[];

  /** 현재 활성화된 chip value (null일 경우 '전체' 선택됨) */
  activeValue?: T | null;

  /** Chip 변경 시 호출될 콜백 함수 (null은 '전체' 선택을 의미) */
  onChange?: (value: T | null) => void;

  /** '전체' chip 표시 여부 */
  showAll?: boolean;

  /** '전체' chip의 라벨 */
  allLabel?: string;

  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 알약(pill) 형태의 칩 컴포넌트
 *
 * @description
 * 카테고리 필터, 태그 선택 등에 사용되는 칩 컴포넌트입니다.
 * '전체' 칩을 표시할 수 있으며, 선택 시 null 값을 반환합니다.
 *
 * @template T - chip value의 타입

 */
export function PillChipsTab<T = string>({
  chips = [],
  activeValue,
  onChange,
  showAll = true,
  allLabel = '전체',
  className = '',
}: PillChipsTabProps<T>) {
  const [internalActiveValue, setInternalActiveValue] =
    useState<T | null>(activeValue ?? null);

  // activeValue prop이 있으면 제어 컴포넌트, 없으면 비제어 컴포넌트
  const currentValue =
    activeValue !== undefined ? activeValue : internalActiveValue;

  /**
   * Chip 클릭 핸들러
   * @param value - 선택된 chip의 value (null은 '전체')
   */
  const handleChipClick = (value: T | null) => {
    if (activeValue === undefined) {
      setInternalActiveValue(value);
    }
    onChange?.(value);
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
        {/* 전체 Chip */}
        {showAll && (
          <Pressable key="all">
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
                currentValue === null
                  ? 'font-bold bg-soso-500 text-white shadow-sm border-soso-600 dark:border-soso-600'
                  : 'bg-white hover:font-bold text-fontColor-gray2 dark:text-neutral-400 hover:border-soso-600 dark:hover:border-neutral-800 hover:text-soso-600 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:bg-neutral-800',
              )}
              onClick={() => handleChipClick(null)}
            >
              {allLabel}
            </button>
          </Pressable>
        )}

        {/* 일반 Chips */}
        {chips.map((chip) => (
          <Pressable key={String(chip.value)}>
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
                currentValue === chip.value
                  ? 'font-bold bg-soso-500 text-white shadow-sm border-soso-600 dark:border-soso-600'
                  : 'bg-white hover:font-bold text-fontColor-gray2 dark:text-neutral-400 hover:border-soso-600 dark:hover:border-neutral-800 hover:text-soso-600 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:bg-neutral-800',
              )}
              onClick={() => handleChipClick(chip.value)}
            >
              {chip.label}
            </button>
          </Pressable>
        ))}
      </div>
    </div>
  );
}
