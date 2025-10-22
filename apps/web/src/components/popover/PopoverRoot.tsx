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

/**
 * Popover 콘텐츠가 표시될 위치
 * @typedef {'top' | 'right' | 'bottom' | 'left'} PopoverSide
 */
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Popover 콘텐츠의 정렬 방식
 * @typedef {'start' | 'center' | 'end'} PopoverAlign
 */
export type PopoverAlign = 'start' | 'center' | 'end';

/**
 * 텍스트 방향 (왼쪽→오른쪽 또는 오른쪽→왼쪽)
 * @typedef {'ltr' | 'rtl'} Direction
 */
export type Direction = 'ltr' | 'rtl';

/**
 * PopoverRoot 컴포넌트의 Props
 */
export interface PopoverRootProps {
  /**
   * Popover 내부의 자식 요소들
   * 일반적으로 Trigger, Portal, Content 컴포넌트를 포함합니다
   */
  children: ReactNode;

  /**
   * Popover의 열림/닫힘 상태 (제어 컴포넌트)
   * 제공하면 부모에서 상태를 제어하는 제어 컴포넌트가 됩니다
   * @example
   * const [open, setOpen] = useState(false);
   * <Popover.Root open={open} onOpenChange={setOpen}>
   */
  open?: boolean;

  /**
   * Popover의 초기 열림 상태 (비제어 컴포넌트)
   * open prop을 제공하지 않을 때만 사용됩니다
   * @default false
   * @example
   * <Popover.Root defaultOpen={true}>
   */
  defaultOpen?: boolean;

  /**
   * Popover의 열림/닫힘 상태가 변경될 때 호출되는 콜백
   * @param open - 새로운 열림 상태
   * @example
   * <Popover.Root onOpenChange={(open) => console.log('Popover is', open ? 'open' : 'closed')}>
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * 모달 모드 활성화 여부
   * true일 경우 Popover가 열리면 배경이 어두워지고 외부 클릭 시 닫힙니다
   * @default false
   */
  modal?: boolean;

  /**
   * 텍스트 방향
   * @default 'ltr'
   */
  dir?: Direction;
}

/**
 * Popover Context에서 제공되는 값
 * @internal
 */
export interface PopoverContextValue {
  /** 현재 Popover의 열림/닫힘 상태 */
  open: boolean;
  /** Popover의 열림/닫힘 상태를 변경하는 함수 */
  setOpen: (open: boolean) => void;
  /** Trigger 요소의 ref */
  triggerRef: RefObject<HTMLButtonElement>;
  /** Content 요소의 ref */
  contentRef: RefObject<HTMLDivElement>;
  /** Content 요소의 고유 ID */
  contentId: string;
  /** Trigger 요소의 고유 ID */
  triggerId: string;
  /** 모달 모드 활성화 여부 */
  modal?: boolean;
  /** 텍스트 방향 */
  dir?: Direction;
  /** 상태 변경 콜백 */
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

/**
 * Popover Context에 접근하는 Hook
 * Popover의 하위 컴포넌트에서 사용하여 상태 및 ref에 접근합니다
 *
 * @throws {Error} Popover.Root 외부에서 사용 시 에러 발생
 * @returns {PopoverContextValue} Popover의 상태 및 ref
 *
 * @example
 * function CustomTrigger() {
 *   const { open, setOpen } = usePopoverContext();
 *   return <button onClick={() => setOpen(!open)}>Toggle</button>;
 * }
 */
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

/**
 * PopoverRoot 컴포넌트
 *
 * Popover의 최상위 컴포넌트로, 상태 관리와 Context 제공을 담당합니다.
 * Dropdown, Select 등 다양한 오버레이 UI의 기반이 됩니다.
 *
 * @component
 * @example
 * // 비제어 컴포넌트
 * <Popover.Root>
 *   <Popover.Trigger>Open</Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content>Content here</Popover.Content>
 *   </Popover.Portal>
 * </Popover.Root>
 *
 * @example
 * // 제어 컴포넌트
 * const [open, setOpen] = useState(false);
 * <Popover.Root open={open} onOpenChange={setOpen}>
 *   <Popover.Trigger>Toggle</Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content>Content here</Popover.Content>
 *   </Popover.Portal>
 * </Popover.Root>
 */
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
