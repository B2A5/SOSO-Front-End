import { useEffect } from 'react';
import { useFocusTrap } from '../useFocusTrap';

export interface UseDrawerAccessibilityProps {
  isOpen: boolean;
  closeOnDrag: boolean;
  setIsOpen: (open: boolean) => void;
  contentRef: React.RefObject<HTMLElement>;
}

/**
 * Drawer 접근성 훅
 *
 * ESC 키로 닫기와 포커스 트랩을 처리합니다.
 *
 * @example
 * ```tsx
 * useDrawerAccessibility({
 *   isOpen,
 *   closeOnDrag,
 *   setIsOpen,
 *   contentRef,
 * });
 * ```
 */
export function useDrawerAccessibility({
  isOpen,
  closeOnDrag,
  setIsOpen,
  contentRef,
}: UseDrawerAccessibilityProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen || !closeOnDrag) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () =>
      document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnDrag, setIsOpen]);

  // 포커스 트랩
  useFocusTrap(contentRef, isOpen);
}
