'use client';

/**
 * PopoverContent 컴포넌트
 * Popover 컨텐츠 (Framer Motion + 포지셔닝 + 키보드 네비게이션)
 */

import { AnimatePresence, motion, type Variants } from 'motion/react';
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

/**
 * PopoverContent 컴포넌트의 Props
 */
export interface PopoverContentProps {
  /**
   * 콘텐츠 내부에 표시될 요소들
   * 메뉴 아이템, 폼, 텍스트 등 다양한 콘텐츠를 포함할 수 있습니다
   */
  children: ReactNode;

  /**
   * 추가 CSS 클래스명
   * Tailwind 클래스를 사용하여 스타일을 커스터마이징할 수 있습니다
   */
  className?: string;

  /**
   * Popover가 표시될 위치 (트리거 기준)
   * @default 'bottom'
   * @example
   * side="top" // 트리거 위쪽에 표시
   * side="bottom" // 트리거 아래쪽에 표시
   */
  side?: PopoverSide;

  /**
   * 트리거와 콘텐츠 사이의 간격 (픽셀 단위)
   * @default 4
   * @example
   * sideOffset={8} // 8px 간격
   */
  sideOffset?: number;

  /**
   * Popover의 정렬 방식
   * @default 'start'
   * @example
   * align="start" // 트리거의 시작점에 정렬
   * align="center" // 트리거의 중앙에 정렬
   * align="end" // 트리거의 끝점에 정렬
   */
  align?: PopoverAlign;

  /**
   * 정렬 위치의 오프셋 (픽셀 단위)
   * @default 0
   * @example
   * alignOffset={10} // 정렬 위치에서 10px 이동
   */
  alignOffset?: number;

  /**
   * ESC 키를 눌렀을 때 Popover를 닫을지 여부
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Popover 외부를 클릭했을 때 닫을지 여부
   * @default true
   */
  closeOnOutsideClick?: boolean;

  /**
   * 키보드 이벤트 핸들러
   * 커스텀 키보드 네비게이션을 구현할 때 사용합니다
   */
  onKeyDown?: (e: React.KeyboardEvent) => void;
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

/**
 * PopoverContent 컴포넌트
 *
 * Popover의 콘텐츠를 표시하는 컴포넌트입니다.
 * Framer Motion 애니메이션, 자동 포지셔닝, 키보드 네비게이션을 지원합니다.
 *
 * 주요 기능:
 * - 자동 위치 계산 (fixed 또는 absolute positioning)
 * - ESC 키로 닫기
 * - 외부 클릭으로 닫기
 * - 부드러운 애니메이션 효과
 *
 * @component
 * @example
 * // 기본 사용법
 * <Popover.Portal>
 *   <Popover.Content>
 *     <div>콘텐츠 내용</div>
 *   </Popover.Content>
 * </Popover.Portal>
 *
 * @example
 * // 위치 및 정렬 커스터마이징
 * <Popover.Content
 *   side="top"
 *   align="center"
 *   sideOffset={8}
 *   alignOffset={0}
 * >
 *   <div>위쪽 중앙에 표시</div>
 * </Popover.Content>
 *
 * @example
 * // 외부 클릭 무시
 * <Popover.Content closeOnOutsideClick={false}>
 *   <form>폼 콘텐츠</form>
 * </Popover.Content>
 */
export function PopoverContent({
  children,
  className,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  onKeyDown,
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
          onKeyDown={onKeyDown}
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
