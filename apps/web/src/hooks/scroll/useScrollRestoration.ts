import { useEffect } from 'react';
import { Virtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

export interface ContainerScrollOptions<
  TScrollElement extends Element = Element,
  TItemElement extends Element = Element,
> {
  type: 'container';
  virtualizer: Virtualizer<TScrollElement, TItemElement>;
  parentRef: React.RefObject<TScrollElement>;
  storageKey?: string;
  enabled?: boolean;
}

export interface WindowScrollOptions<
  TItemElement extends Element = Element,
> {
  type: 'window';
  virtualizer: Virtualizer<Window, TItemElement>;
  parentRef?: React.RefObject<Element>;
  storageKey?: string;
  enabled?: boolean;
}

/**
 * useScrollRestoration Hook
 *
 * Virtual List의 스크롤 위치를 sessionStorage에 저장하고 복원합니다.
 * Container 기반과 Window 기반 모두 지원합니다.
 *
 * ## 동작 프로세스:
 * 1. **초기화**: sessionStorage에서 이전 스크롤 위치를 불러와 virtualizer의 initialOffset으로 전달 (별도 처리)
 * 2. **스크롤 중 저장**: rAF 쓰로틀로 프레임당 최대 1회 저장 (성능 최적화)
 * 3. **페이지 이탈 대비**: visibilitychange, beforeunload, cleanup에서 flush
 *
 *
 * @param options - 스크롤 복원 옵션
 * @param options.type - 스크롤 타입: 'container' (element 스크롤) 또는 'window' (전체 페이지 스크롤)
 * @param options.virtualizer - @tanstack/react-virtual의 virtualizer 인스턴스
 * @param options.parentRef - [container 타입 필수] 스크롤 컨테이너의 React ref
 * @param options.storageKey - sessionStorage에 저장할 키
 * @param options.enabled - 스크롤 복원 활성화 여부 (기본값: true)
 *
 */
export function useScrollRestoration<
  TScrollElement extends Element = Element,
  TItemElement extends Element = Element,
>(
  options:
    | ContainerScrollOptions<TScrollElement, TItemElement>
    | WindowScrollOptions<TItemElement>,
) {
  const {
    type,
    virtualizer,
    storageKey = type === 'window'
      ? 'virtual-window-scroll'
      : 'virtual-list-scroll',
    enabled = true,
  } = options;

  const parentRef =
    'parentRef' in options ? options.parentRef : undefined;

  useEffect(() => {
    if (!enabled) return;

    // 컨테이너 타입의 경우 parentRef 필수
    if (type === 'container' && !parentRef?.current) {
      console.error(
        '[useScrollRestoration] Container type requires parentRef',
      );
      return;
    }

    // 초기 측정
    virtualizer.measure();

    const saveScrollPosition = rafThrottle((offset: number) => {
      sessionStorage.setItem(storageKey, String(offset));
    });

    const handleScroll = () => {
      if (virtualizer.scrollOffset !== null) {
        saveScrollPosition(virtualizer.scrollOffset);
      }
    };

    // 스크롤 이벤트 리스닝
    const scrollTarget =
      type === 'container' ? parentRef!.current! : window;
    scrollTarget.addEventListener('scroll', handleScroll, {
      passive: true,
    } as AddEventListenerOptions);

    // 페이지 이탈 직전 최신 위치 강제 저장
    const flushLatestPosition = () => {
      saveScrollPosition.flush(); // 대기 중인 rAF 즉시 실행
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
    ); // 탭 전환
    window.addEventListener('beforeunload', flushLatestPosition); // 페이지 닫기

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      document.removeEventListener(
        'visibilitychange',
        flushLatestPosition,
      );
      window.removeEventListener('beforeunload', flushLatestPosition);
      flushLatestPosition();
    };
  }, [type, parentRef, storageKey, virtualizer, enabled]);
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
 */
export function useScrollRestorationInitialOffset(
  storageKey: string = 'virtual-list-scroll',
  enabled: boolean = true,
): number {
  if (typeof window === 'undefined' || !enabled) return 0;
  return Number(sessionStorage.getItem(storageKey) ?? 0);
}
