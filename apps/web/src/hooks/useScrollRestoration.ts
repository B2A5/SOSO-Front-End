import { useEffect } from 'react';
import { Virtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

/**
 * useScrollRestoration Hook
 *
 * Virtual List의 스크롤 위치를 sessionStorage에 저장하고 복원
 *
 * ## 동작 프로세스:
 * 1. **초기화**: sessionStorage에서 이전 스크롤 위치를 불러와 virtualizer의 initialOffset으로 전달 (별도 처리)
 * 2. **스크롤 중 저장**: rAF 쓰로틀로 프레임당 최대 1회 저장
 * 3. **페이지 이탈 대비**: visibilitychange, beforeunload, cleanup에서 flush
 *
 * @param options - 스크롤 복원 옵션
 * @param options.virtualizer - @tanstack/react-virtual의 virtualizer 인스턴스
 * @param options.parentRef - 스크롤 컨테이너의 React ref
 * @param options.storageKey - sessionStorage에 저장할 키 (기본값: 'virtual-list-scroll')
 * @param options.enabled - 스크롤 복원 활성화 여부 (기본값: true)
 *
 * @example
 * ```tsx
 * const parentRef = useRef<HTMLDivElement>(null);
 * const savedOffset = useScrollRestorationInitialOffset('my-list', !resetScroll);
 *
 * const virtualizer = useVirtualizer({
 *   // ...
 *   initialOffset: savedOffset,
 * });
 *
 * useScrollRestoration({
 *   virtualizer,
 *   parentRef,
 *   storageKey: 'my-list',
 *   enabled: !resetScroll,
 * });
 * ```
 */
export function useScrollRestoration<
  TScrollElement extends Element,
  TItemElement extends Element,
>({
  virtualizer,
  parentRef,
  storageKey = 'virtual-list-scroll',
  enabled = true,
}: {
  virtualizer: Virtualizer<TScrollElement, TItemElement>;
  parentRef: React.RefObject<TScrollElement>;
  storageKey?: string;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    const scrollContainerElement = parentRef.current;
    if (!scrollContainerElement) return;

    // 초기 측정
    virtualizer.measure();

    // 스크롤 중 저장: 프레임당 1회로 제한
    const saveScrollPosition = rafThrottle((offset: number) => {
      sessionStorage.setItem(storageKey, String(offset));
    });

    const handleScroll = () => {
      if (virtualizer.scrollOffset !== null) {
        saveScrollPosition(virtualizer.scrollOffset);
      }
    };

    // 스크롤 이벤트 리스닝
    scrollContainerElement.addEventListener('scroll', handleScroll, {
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

    // 탭 전환 시 저장
    document.addEventListener(
      'visibilitychange',
      flushLatestPosition,
    );
    // 페이지 닫기 직전 저장
    window.addEventListener('beforeunload', flushLatestPosition);

    // cleanup
    return () => {
      scrollContainerElement.removeEventListener(
        'scroll',
        handleScroll,
      );
      document.removeEventListener(
        'visibilitychange',
        flushLatestPosition,
      );
      window.removeEventListener('beforeunload', flushLatestPosition);
      flushLatestPosition();
    };
  }, [parentRef, storageKey, virtualizer, enabled]);
}

/**
 * useScrollRestorationInitialOffset Hook
 *
 * sessionStorage에서 저장된 스크롤 위치를 불러와 virtualizer의 initialOffset으로 사용합
 *
 * @param storageKey - sessionStorage에 저장된 키
 * @param enabled - 복원 활성화 여부 (false면 0 반환)
 * @returns 저장된 스크롤 오프셋 (없으면 0)
 *
 * @example
 * ```tsx
 * const savedOffset = useScrollRestorationInitialOffset('my-list', !resetScroll);
 *
 * const virtualizer = useVirtualizer({
 *   initialOffset: savedOffset,
 *   // ...
 * });
 * ```
 */
export function useScrollRestorationInitialOffset(
  storageKey: string = 'virtual-list-scroll',
  enabled: boolean = true,
): number {
  if (typeof window === 'undefined' || !enabled) return 0;
  return Number(sessionStorage.getItem(storageKey) ?? 0);
}
