/**
 * Popover 컴포넌트 (Composition Pattern)
 * Primitive 컴포넌트로 Dropdown, Select의 기반이 됨
 */

import {
  PopoverRoot,
  usePopoverContext,
  type PopoverRootProps,
  type PopoverSide,
  type PopoverAlign,
  type Direction,
  type PopoverContextValue,
} from './PopoverRoot';
import {
  PopoverTrigger,
  type PopoverTriggerProps,
} from './PopoverTrigger';
import {
  PopoverPortal,
  type PopoverPortalProps,
} from './PopoverPortal';
import {
  PopoverContent,
  type PopoverContentProps,
} from './PopoverContent';

// ============================================
// Composition Pattern
// ============================================

export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Content: PopoverContent,
});

// ============================================
// Re-export Types
// ============================================

export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverSide,
  PopoverAlign,
  Direction,
  PopoverContextValue,
};

// ============================================
// Re-export Hook
// ============================================

export { usePopoverContext };
