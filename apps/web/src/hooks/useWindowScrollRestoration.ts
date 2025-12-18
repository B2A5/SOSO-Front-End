import { useEffect } from 'react';
import { Virtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

/**
 * useWindowScrollRestoration Hook
 *
 * Window Virtualizer의 스크롤 위치를 sessionStorage에 저장하고 복원합니다.
 *
 *
 * @param options - 스크롤 복원 옵션
 * @param options.virtualizer - @tanstack/react-virtual의 window virtualizer 인스턴스
 * @param options.storageKey - sessionStorage에 저장할 키 (기본값: 'virtual-window-scroll')
 * @param options.enabled - 스크롤 복원 활성화 여부 (기본값: true)
 *
 * @example
 * ```tsx
 * const savedOffset = useScrollRestorationInitialOffset('my-list', !resetScroll);
 *
 * const virtualizer = useWindowVirtualizer({
 *   // ...
 *   initialOffset: savedOffset,
 * });
 *
 * useWindowScrollRestoration({
 *   virtualizer,
 *   storageKey: 'my-list',
 *   enabled: !resetScroll,
 * });
 * ```
 */
export function useWindowScrollRestoration<
  TItemElement extends Element,
>({
  virtualizer,
  storageKey = 'virtual-window-scroll',
  enabled = true,
}: {
  virtualizer: Virtualizer<Window, TItemElement>;
  storageKey?: string;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    // 초기 측정
    virtualizer.measure();

    // 스크롤 중 저장
    const saveScrollPosition = rafThrottle((offset: number) => {
      sessionStorage.setItem(storageKey, String(offset));
    });

    const handleScroll = () => {
      if (virtualizer.scrollOffset !== null) {
        saveScrollPosition(virtualizer.scrollOffset);
      }
    };

    // Window 스크롤 이벤트 리스닝
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    // 페이지 이탈 직전 최신 위치 강제 저장
    const flushLatestPosition = () => {
      saveScrollPosition.flush();
      if (virtualizer.scrollOffset !== null) {
        sessionStorage.setItem(
          storageKey,
          String(virtualizer.scrollOffset),
        );
      }
    };

    document.addEventListener(
      'visibilitychange',
      flushLatestPosition,
    );
    window.addEventListener('beforeunload', flushLatestPosition); // 페이지 닫기

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener(
        'visibilitychange',
        flushLatestPosition,
      );
      window.removeEventListener('beforeunload', flushLatestPosition);
      flushLatestPosition();
    };
  }, [storageKey, virtualizer, enabled]);
}
