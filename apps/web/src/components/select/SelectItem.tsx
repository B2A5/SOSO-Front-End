'use client';

import { motion, type Variants } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { type ReactNode } from 'react';
import { usePopoverContext } from '../popover/PopoverRoot';
import { useSelectContext, type SelectSize } from './SelectRoot';
import { Check } from 'lucide-react';

// ============================================
// Types
// ============================================

/**
 * SelectItem 컴포넌트의 Props
 */
export interface SelectItemProps {
  /**
   * 아이템 내부에 표시될 콘텐츠
   * 텍스트, 아이콘, 또는 다른 React 요소를 포함할 수 있습니다
   */
  children: ReactNode;

  /**
   * 아이템의 고유 값
   * 선택 시 이 값이 onValueChange 콜백에 전달됩니다
   * @example
   * value="option-1"
   */
  value: string;

  /**
   * 아이템의 비활성화 여부
   * true일 경우 선택할 수 없습니다
   * @default false
   */
  disabled?: boolean;

  /**
   * 추가 CSS 클래스명
   * Tailwind 클래스를 사용하여 스타일을 커스터마이징할 수 있습니다
   */
  className?: string;
}

// ============================================
// Size Variants
// ============================================

const sizeClasses: Record<SelectSize, string> = {
  sm: 'py-1 pl-6 pr-2 text-xs',
  md: 'py-1.5 pl-8 pr-2 text-sm',
  lg: 'py-2 pl-10 pr-3 text-base',
};

const checkSizeClasses: Record<SelectSize, string> = {
  sm: 'left-1.5 h-3 w-3',
  md: 'left-2 h-3.5 w-3.5',
  lg: 'left-3 h-4 w-4',
};

const iconSizeClasses: Record<SelectSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

// ============================================
// Animations
// ============================================

const itemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -10,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
    },
  },
};

// ============================================
// Component
// ============================================

/**
 * SelectItem 컴포넌트
 *
 * Select의 선택 가능한 아이템입니다.
 * 클릭 및 키보드 조작(Enter, Space)을 지원하며, 선택 시 체크마크가 표시됩니다.
 *
 * 주요 기능:
 * - 선택 시 자동으로 트리거에 레이블 표시
 * - 선택된 아이템에 체크마크 표시
 * - size prop에 따른 크기 조절
 * - 키보드 네비게이션 지원
 * - 비활성화 상태 지원
 * - 선택 시 자동으로 드롭다운 닫기
 *
 * @component
 * @example
 * // 기본 사용법
 * <Select.Content>
 *   <Select.Item value="1">옵션 1</Select.Item>
 *   <Select.Item value="2">옵션 2</Select.Item>
 *   <Select.Item value="3">옵션 3</Select.Item>
 * </Select.Content>
 *
 * @example
 * // 비활성화된 아이템
 * <Select.Item value="disabled" disabled>
 *   선택 불가
 * </Select.Item>
 *
 * @example
 * // 커스텀 콘텐츠와 스타일
 * <Select.Item
 *   value="custom"
 *   className="font-bold text-blue-600"
 * >
 *   <div className="flex items-center gap-2">
 *     <Icon />
 *     <span>커스텀 아이템</span>
 *   </div>
 * </Select.Item>
 */
export function SelectItem({
  children,
  value: itemValue,
  disabled = false,
  className,
}: SelectItemProps) {
  const { setOpen } = usePopoverContext();
  const {
    value: selectedValue,
    onValueChange,
    setSelectedLabel,
    size,
  } = useSelectContext();

  const isSelected = selectedValue === itemValue;

  const handleClick = () => {
    if (disabled) return;

    onValueChange?.(itemValue);

    // children이 문자열이면 그대로, 아니면 itemValue 사용
    const label = typeof children === 'string' ? children : itemValue;
    setSelectedLabel?.(label);

    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      aria-label={itemValue}
      tabIndex={disabled ? -1 : 0}
      variants={itemVariants}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={twMerge(
        'relative flex select-none items-center rounded-sm outline-none',
        'transition-colors',
        sizeClasses[size],
        disabled
          ? 'cursor-not-allowed opacity-50 pointer-events-none'
          : 'cursor-pointer focus:bg-gray-100 dark:focus:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700',
        isSelected && !disabled && 'bg-soso-100 dark:bg-blue-900/20',
        className,
      )}
    >
      {/* 체크마크 (선택된 항목에만 표시) */}
      <span
        className={twMerge(
          'absolute flex items-center justify-center',
          checkSizeClasses[size],
        )}
      >
        {isSelected && (
          <Check
            className={twMerge(
              'text-soso-500',
              iconSizeClasses[size],
            )}
          />
        )}
      </span>

      {children}
    </motion.div>
  );
}

SelectItem.displayName = 'SelectItem';
