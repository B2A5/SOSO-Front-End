'use client';

/**
 * PopoverContent 컴포넌트
 * Popover 컨텐츠 (Framer Motion + 포지셔닝 + 키보드 네비게이션)
 */

import {
  AnimatePresence,
  motion,
  type Variants,
} from 'framer-motion';
import {
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { twMerge } from 'tailwind-merge';
import {
  usePopoverContext,
  type PopoverSide,
  type PopoverAlign,
} from './PopoverRoot';

// ============================================
// Types
// ============================================

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

// ============================================
// Animations
// ============================================

const contentVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
      staggerChildren: 0.02,
    },
  },
};

// ============================================
// Positioning Utilities
// ============================================

interface PositionConfig {
  side: PopoverSide;
  align: PopoverAlign;
  sideOffset: number;
  alignOffset: number;
  triggerRect: DOMRect;
}

function calculateFixedPosition({
  side,
  align,
  sideOffset,
  alignOffset,
  triggerRect,
}: PositionConfig): CSSProperties {
  const styles: CSSProperties = {
    position: 'fixed',
    zIndex: 50,
  };

  // Side positioning
  switch (side) {
    case 'top':
      styles.bottom = `${window.innerHeight - triggerRect.top + sideOffset}px`;
      break;
    case 'bottom':
      styles.top = `${triggerRect.bottom + sideOffset}px`;
      break;
    case 'left':
      styles.right = `${window.innerWidth - triggerRect.left + sideOffset}px`;
      break;
    case 'right':
      styles.left = `${triggerRect.right + sideOffset}px`;
      break;
  }

  // Align positioning
  const isVertical = side === 'top' || side === 'bottom';

  if (isVertical) {
    switch (align) {
      case 'start':
        styles.left = `${triggerRect.left + alignOffset}px`;
        break;
      case 'center':
        styles.left = `${triggerRect.left + triggerRect.width / 2}px`;
        styles.transform = 'translateX(-50%)';
        break;
      case 'end':
        styles.right = `${window.innerWidth - triggerRect.right + alignOffset}px`;
        break;
    }
  } else {
    switch (align) {
      case 'start':
        styles.top = `${triggerRect.top + alignOffset}px`;
        break;
      case 'center':
        styles.top = `${triggerRect.top + triggerRect.height / 2}px`;
        styles.transform = 'translateY(-50%)';
        break;
      case 'end':
        styles.bottom = `${window.innerHeight - triggerRect.bottom + alignOffset}px`;
        break;
    }
  }

  return styles;
}

function calculateRelativePosition({
  side,
  align,
  sideOffset,
  alignOffset,
}: Omit<PositionConfig, 'triggerRect'>): CSSProperties {
  const styles: CSSProperties = {
    position: 'absolute',
    zIndex: 50,
  };

  // Side positioning
  switch (side) {
    case 'top':
      styles.bottom = `calc(100% + ${sideOffset}px)`;
      break;
    case 'bottom':
      styles.top = `calc(100% + ${sideOffset}px)`;
      break;
    case 'left':
      styles.right = `calc(100% + ${sideOffset}px)`;
      break;
    case 'right':
      styles.left = `calc(100% + ${sideOffset}px)`;
      break;
  }

  // Align positioning
  const isVertical = side === 'top' || side === 'bottom';

  if (isVertical) {
    switch (align) {
      case 'start':
        styles.left = `${alignOffset}px`;
        break;
      case 'center':
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        break;
      case 'end':
        styles.right = `${alignOffset}px`;
        break;
    }
  } else {
    switch (align) {
      case 'start':
        styles.top = `${alignOffset}px`;
        break;
      case 'center':
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
        break;
      case 'end':
        styles.bottom = `${alignOffset}px`;
        break;
    }
  }

  return styles;
}

// ============================================
// Component
// ============================================

export function PopoverContent({
  children,
  className,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  closeOnEscape = true,
  closeOnOutsideClick = true,
}: PopoverContentProps) {
  const {
    open,
    setOpen,
    triggerRef,
    contentRef,
    contentId,
    triggerId,
  } = usePopoverContext();

  // Outside click handler
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        contentRef.current &&
        !contentRef.current.contains(target)
      ) {
        setOpen(false);
      }
    },
    [triggerRef, contentRef, setOpen],
  );

  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, closeOnOutsideClick, handleClickOutside]);

  // Escape key handler
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeOnEscape, setOpen, triggerRef]);

  // Position calculation (memoized)
  const positionStyles = useMemo(() => {
    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      return calculateFixedPosition({
        side,
        align,
        sideOffset,
        alignOffset,
        triggerRect,
      });
    }

    return calculateRelativePosition({
      side,
      align,
      sideOffset,
      alignOffset,
    });
  }, [open, side, align, sideOffset, alignOffset, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          id={contentId}
          aria-labelledby={triggerId}
          tabIndex={-1}
          initial="closed"
          animate="open"
          exit="closed"
          variants={contentVariants}
          style={positionStyles}
          className={twMerge(
            'min-w-[8rem] overflow-hidden rounded-md',
            'bg-white dark:bg-neutral-800',
            'border border-neutral-100 dark:border-neutral-700',
            'shadow-lg',
            'p-1',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

PopoverContent.displayName = 'PopoverContent';
