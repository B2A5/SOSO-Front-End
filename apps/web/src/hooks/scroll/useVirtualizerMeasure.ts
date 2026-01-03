import { useEffect } from 'react';
import { Virtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

/**
 * useVirtualizerMeasure Hook의 옵션 타입
 *
 * @template TScrollElement - 스크롤 요소 타입 (Element 또는 Window)
 * @template TItemElement - 아이템 요소 타입
 */
export interface VirtualizerMeasureOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> {
  /** @tanstack/react-virtual의 virtualizer 인스턴스 */
  virtualizer: Virtualizer<TScrollElement, TItemElement>;
  /** ResizeObserver로 관찰할 컨테이너의 React ref */
  observeRef: React.RefObject<Element>;
  /** 측정 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

/**
 * useVirtualizerMeasure Hook
 *
 * Virtual List의 컨테이너 크기 변화를 감지하고 virtualizer를 재측정합니다.
 * Container 기반과 Window 기반 virtualizer 모두 지원합니다.
 *
 */
export function useVirtualizerMeasure<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
>({
  virtualizer,
  observeRef,
  enabled = true,
}: VirtualizerMeasureOptions<TScrollElement, TItemElement>) {
  useEffect(() => {
    if (!enabled) return;

    // 관찰할 ref 결정
    const measure = rafThrottle(() => {
      virtualizer.measure();
    });

    let resizeObserver: ResizeObserver | null = null;

    if (observeRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        measure();
      });
      resizeObserver.observe(observeRef.current);
    }

    // Window 리사이즈 감지
    const handleWindowResize = () => {
      measure();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      measure.cancel?.(); // 대기 중인 rAF 취소
    };
  }, [virtualizer, observeRef, enabled]);
}
