'use client';

/**
 * PopoverTrigger 컴포넌트
 * Popover를 여는 트리거 버튼
 */

import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { type ReactNode } from 'react';
import { usePopoverContext } from './PopoverRoot';

// ============================================
// Types
// ============================================

/**
 * PopoverTrigger 컴포넌트의 Props
 */
export interface PopoverTriggerProps {
  /**
   * 트리거 버튼 내부에 표시될 콘텐츠
   * 텍스트, 아이콘, 또는 다른 React 컴포넌트를 포함할 수 있습니다
   */
  children: ReactNode;

  /**
   * 자식 요소를 그대로 렌더링할지 여부
   * true일 경우 button 태그 대신 children을 직접 렌더링합니다
   * @default false
   * @note 현재 구현되지 않음
   */
  asChild?: boolean;

  /**
   * 추가 CSS 클래스명
   * Tailwind 클래스를 사용하여 스타일을 커스터마이징할 수 있습니다
   * @example
   * <Popover.Trigger className="bg-blue-500 text-white">
   */
  className?: string;

  /**
   * 트리거 버튼의 비활성화 여부
   * true일 경우 클릭이나 키보드 조작이 불가능합니다
   * @default false
   */
  disabled?: boolean;
}

// ============================================
// Component
// ============================================

/**
 * PopoverTrigger 컴포넌트
 *
 * Popover를 열고 닫는 트리거 버튼입니다.
 * 클릭 및 키보드 조작(Enter, Space, ArrowDown, Escape)을 지원합니다.
 *
 * @component
 * @example
 * <Popover.Root>
 *   <Popover.Trigger>
 *     클릭하세요
 *   </Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content>내용</Popover.Content>
 *   </Popover.Portal>
 * </Popover.Root>
 *
 * @example
 * // 커스텀 스타일 적용
 * <Popover.Trigger className="bg-soso-500 text-white px-6 py-3">
 *   열기
 * </Popover.Trigger>
 *
 * @example
 * // 비활성화된 트리거
 * <Popover.Trigger disabled>
 *   비활성화됨
 * </Popover.Trigger>
 */
export function PopoverTrigger({
  children,
  asChild = false,
  className,
  disabled = false,
}: PopoverTriggerProps) {
  const { open, setOpen, triggerRef, triggerId, contentId } =
    usePopoverContext();

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

  if (asChild) {
    console.warn('asChild prop은 아직 구현되지 않았습니다.');
  }

  return (
    <motion.button
      ref={triggerRef}
      id={triggerId}
      type="button"
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={contentId}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={twMerge(
        'inline-flex items-center justify-between',
        'px-4 py-2 rounded-md',
        'bg-white dark:bg-neutral-800',
        'text-fontColor-gray3 dark:text-neutral-200',
        'hover:bg-gray-50 dark:hover:bg-neutral-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soso-600',
        'transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

PopoverTrigger.displayName = 'PopoverTrigger';
