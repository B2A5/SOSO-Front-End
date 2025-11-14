'use client';

/**
 * SelectTrigger 컴포넌트
 * 선택된 값을 표시하는 트리거 버튼
 */

import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { type ReactNode } from 'react';
import { usePopoverContext } from '../popover/PopoverRoot';
import { useSelectContext, type SelectSize } from './SelectRoot';

// ============================================
// Types
// ============================================

/**
 * SelectTrigger 컴포넌트의 Props
 */
export interface SelectTriggerProps {
  /**
   * 트리거 버튼 내부에 표시될 커스텀 콘텐츠
   * 제공하지 않으면 선택된 값의 레이블 또는 placeholder가 표시됩니다
   */
  children?: ReactNode;

  /**
   * 값이 선택되지 않았을 때 표시될 텍스트
   * @example
   * placeholder="옵션을 선택하세요"
   */
  placeholder: string;

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
  sm: 'min-w-[120px] px-2 py-1 text-xs',
  md: 'min-w-[200px] px-4 py-2 text-sm',
  lg: 'min-w-[240px] px-5 py-3 text-base',
};

const iconSizeClasses: Record<SelectSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

// ============================================
// Component
// ============================================

/**
 * SelectTrigger 컴포넌트
 *
 * Select의 트리거 버튼으로, 선택된 값을 표시하고 드롭다운을 여는 역할을 합니다.
 * 클릭 및 키보드 조작(Enter, Space, ArrowDown, ArrowUp, Escape)을 지원합니다.
 *
 * 주요 기능:
 * - 선택된 값의 레이블 표시
 * - 값이 없을 경우 placeholder 표시
 * - size prop에 따른 크기 조절 (sm, md, lg)
 * - 키보드 네비게이션 지원
 * - 비활성화 상태 지원
 *
 * @component
 * @example
 * // 기본 사용법
 * <Select>
 *   <Select.Trigger placeholder="옵션을 선택하세요" />
 *   <Select.Portal>
 *     <Select.Content>
 *       <Select.Item value="1">옵션 1</Select.Item>
 *     </Select.Content>
 *   </Select.Portal>
 * </Select>
 *
 * @example
 * // 커스텀 스타일
 * <Select.Trigger
 *   placeholder="선택"
 *   className="w-full bg-blue-50"
 * />
 *
 * @example
 * // 커스텀 콘텐츠
 * <Select.Trigger placeholder="선택">
 *   <div className="flex items-center gap-2">
 *     <Icon />
 *     <span>커스텀 콘텐츠</span>
 *   </div>
 * </Select.Trigger>
 */
export function SelectTrigger({
  children,
  placeholder,
  className,
}: SelectTriggerProps) {
  const { open, setOpen, triggerRef, triggerId, contentId } =
    usePopoverContext();
  const { value, disabled, selectedLabel, size } = useSelectContext();

  const handleClick = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setOpen(!open);
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        setOpen(true);
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
    }
  };

  // children이 있으면 사용, 없으면 selectedLabel 또는 placeholder
  const displayContent = children || selectedLabel || placeholder;
  const hasValue = Boolean(value);

  return (
    <motion.button
      ref={triggerRef}
      id={triggerId}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={contentId}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={twMerge(
        'inline-flex items-center justify-between gap-2',
        'rounded-md',
        'bg-white dark:bg-neutral-800',
        'border border-neutral-200 dark:border-neutral-700',
        'hover:bg-gray-50 dark:hover:bg-neutral-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soso-600',
        'transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        !hasValue && 'text-gray-400 dark:text-neutral-500',
        className,
      )}
    >
      <span className="truncate">{displayContent}</span>

      {/* 화살표 아이콘 */}
      <svg
        className={twMerge(
          'transition-transform',
          iconSizeClasses[size],
          open && 'rotate-180',
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </motion.button>
  );
}

SelectTrigger.displayName = 'SelectTrigger';
