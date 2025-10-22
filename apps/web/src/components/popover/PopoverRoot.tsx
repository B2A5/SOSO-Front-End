'use client';

/**
 * PopoverRoot 컴포넌트
 * Popover Primitive의 루트 컴포넌트
 * Dropdown, Select 등의 기반이 되는 공통 로직 제공
 */

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

// ============================================
// Types
// ============================================

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';
export type Direction = 'ltr' | 'rtl';

export interface PopoverRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  dir?: Direction;
}

export interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement>;
  contentRef: RefObject<HTMLDivElement>;
  contentId: string;
  triggerId: string;
  modal?: boolean;
  dir?: Direction;
  onOpenChange?: (open: boolean) => void;
}

// ============================================
// Context
// ============================================

export const PopoverContext =
  createContext<PopoverContextValue | null>(null);

PopoverContext.displayName = 'PopoverContext';

// ============================================
// Hook
// ============================================

export function usePopoverContext() {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error(
      'Popover 컴포넌트는 Popover.Root 내부에서 사용해야 합니다.',
    );
  }

  return context;
}

// ============================================
// Component
// ============================================

export function PopoverRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  dir = 'ltr',
}: PopoverRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const generatedId = useId();
  const triggerId = `popover-trigger-${generatedId}`;
  const contentId = `popover-content-${generatedId}`;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentRef,
      contentId,
      triggerId,
      modal,
      dir,
      onOpenChange,
    }),
    [open, setOpen, contentId, triggerId, modal, dir, onOpenChange],
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
}

PopoverRoot.displayName = 'PopoverRoot';
