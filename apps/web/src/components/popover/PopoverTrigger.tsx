'use client';

/**
 * PopoverTrigger 컴포넌트
 * Popover를 여는 트리거 버튼
 */

import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { type ReactNode } from 'react';
import { usePopoverContext } from './PopoverRoot';

// ============================================
// Types
// ============================================

export interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
}

// ============================================
// Component
// ============================================

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
