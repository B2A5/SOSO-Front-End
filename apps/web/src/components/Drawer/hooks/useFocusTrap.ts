import { RefObject, useEffect } from 'react';

/**
 * 포커스 트랩 훅
 *
 * 모달이나 Drawer가 열려 있을 때 포커스를 내부에 가두는 훅입니다.
 * Tab 키로 순환하며, Shift+Tab으로 역순 순환합니다.
 *
 * @param ref - 포커스를 가둘 요소의 ref
 * @param isActive - 포커스 트랩 활성화 여부
 *
 * @example
 * ```tsx
 * const contentRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(contentRef, isOpen);
 * ```
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  isActive: boolean,
) {
  useEffect(() => {
    if (!isActive) return;

    const element = ref.current;
    if (!element) return;

    // 포커스 가능한 요소 선택자
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const focusableElements =
      element.querySelectorAll(focusableSelector);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Tab 키 핸들러
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab: 역순 순환
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: 순환
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // 이벤트 리스너 등록
    element.addEventListener('keydown', handleTab);

    // 초기 포커스 설정
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTab);
    };
  }, [ref, isActive]);
}
