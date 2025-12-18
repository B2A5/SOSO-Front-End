import { useEffect } from 'react';
import { Virtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

/**
 * useVirtualizerMeasure Hook
 *
 * Virtual List의 부모 컨테이너 크기 변화를 감지하고 virtualizer를 재측정합니다.
 *
 * ## 동작 프로세스:
 * 1. **ResizeObserver**: 부모 컨테이너의 크기 변화 감지 (가장 정확)
 * 2. **Window Resize**: 창 크기 변화 보조 감지 (브라우저 호환성)
 * 3. **rAF Throttle**: 측정 빈도를 프레임당 1회로 제한 (성능 최적화)
 *
 * @param options - 측정 옵션
 * @param options.virtualizer - @tanstack/react-virtual의 virtualizer 인스턴스
 * @param options.parentRef - 스크롤 컨테이너의 React ref
 * @param options.enabled - 측정 활성화 여부 (기본값: true)
 *
 * @example
 * ```tsx
 * const parentRef = useRef<HTMLDivElement>(null);
 * const virtualizer = useVirtualizer({ ... });
 *
 * useVirtualizerMeasure({
 *   virtualizer,
 *   parentRef,
 * });
 * ```
 */
export function useVirtualizerMeasure<
  TScrollElement extends Element,
  TItemElement extends Element,
>({
  virtualizer,
  parentRef,
  enabled = true,
}: {
  virtualizer: Virtualizer<TScrollElement, TItemElement>;
  parentRef: React.RefObject<TScrollElement>;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    const scrollContainerElement = parentRef.current;
    if (!scrollContainerElement) return;

    // 측정 빈도 제한: 프레임당 1회
    const measureOnNextAnimationFrame = rafThrottle(() => {
      virtualizer.measure();
    });

    // 부모 컨테이너 크기 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      measureOnNextAnimationFrame();
    });
    resizeObserver.observe(scrollContainerElement);

    // 창 리사이즈 보조 감지
    const handleWindowResize = () => {
      measureOnNextAnimationFrame();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      measureOnNextAnimationFrame.cancel?.(); // 대기 중인 rAF 취소
    };
  }, [parentRef, virtualizer, enabled]);
}
