/**
 * Select 컴포넌트 (Composition Pattern)
 * Popover Primitive를 재사용하여 Select 의미론 + value 관리 제공
 */

import { PopoverPortal } from '../popover/PopoverPortal';
import {
  SelectRoot,
  useSelectContext,
  type SelectRootProps,
  type SelectContextValue,
} from './SelectRoot';
import {
  SelectTrigger,
  type SelectTriggerProps,
} from './SelectTrigger';
import { SelectContent } from './SelectContent';
import { SelectItem, type SelectItemProps } from './SelectItem';

// ============================================
// Composition Pattern
// ============================================

export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Portal: PopoverPortal,
  Content: SelectContent,
  Item: SelectItem,
});

// ============================================
// Re-export Types
// ============================================

export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectItemProps,
  SelectContextValue,
};

// ============================================
// Re-export Hook
// ============================================

export { useSelectContext };
