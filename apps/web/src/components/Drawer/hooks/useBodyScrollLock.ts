import { useEffect } from 'react';

/**
 * Body 스크롤 잠금 훅
 *
 * Drawer가 열렸을 때 body 스크롤을 잠그고,
 * 닫힐 때 원래 스크롤 위치로 복원합니다.
 *
 * @param isOpen - Drawer 열림 상태
 *
 * @example
 * ```tsx
 * const MyDrawer = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *   useBodyScrollLock(isOpen);
 *   // ...
 * };
 * ```
 */
export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Body 스크롤 잠금
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    // 스크롤바 너비만큼 padding 추가 (레이아웃 시프트 방지)
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // 스크롤 복원
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';

      // 원래 스크롤 위치로 복원
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}
