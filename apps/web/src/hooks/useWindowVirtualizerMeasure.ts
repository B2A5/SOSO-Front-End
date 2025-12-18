import { useEffect } from 'react';
import { Virtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

/**
 * useWindowVirtualizerMeasure Hook
 *
 * Window Virtualizer의 컨테이너 크기 변화를 감지하고 virtualizer를 재측정합니다.
 * (window를 스크롤 컨테이너로 사용하는 경우)
 *
 * ## 동작 프로세스:
 * 1. **Window Resize**: 창 크기 변화 감지
 * 2. **Container ResizeObserver**: 컨테이너 요소의 크기 변화 감지 (옵션)
 * 3. **rAF Throttle**: 측정 빈도를 프레임당 1회로 제한 (성능 최적화)
 *
 * ## 왜 필요한가?
 * - 브라우저 창 크기가 변하면 virtualizer의 가상화 계산이 잘못될 수 있음
 * - 예: 반응형 레이아웃, 브라우저 창 크기 변경
 *
 * ## 성능 최적화:
 * - `rafThrottle`: ResizeObserver 콜백(매우 빈번) → 프레임당 1회로 제한
 *
 * @param options - 측정 옵션
 * @param options.virtualizer - @tanstack/react-virtual의 window virtualizer 인스턴스
 * @param options.containerRef - (옵션) 컨테이너 요소의 React ref (추가 리사이즈 감지용)
 * @param options.enabled - 측정 활성화 여부 (기본값: true)
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const virtualizer = useWindowVirtualizer({ ... });
 *
 * useWindowVirtualizerMeasure({
 *   virtualizer,
 *   containerRef, // 옵션: 컨테이너 리사이즈도 감지
 * });
 * ```
 */
export function useWindowVirtualizerMeasure<
  TItemElement extends Element,
>({
  virtualizer,
  containerRef,
  enabled = true,
}: {
  virtualizer: Virtualizer<Window, TItemElement>;
  containerRef?: React.RefObject<HTMLElement>;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    // 측정 빈도 제한: 프레임당 1회
    const measureOnNextAnimationFrame = rafThrottle(() => {
      virtualizer.measure();
    });

    // Window 리사이즈 감지
    const handleWindowResize = () => {
      measureOnNextAnimationFrame();
    };
    window.addEventListener('resize', handleWindowResize);

    // (옵션) 컨테이너 요소 크기 변화 감지
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        measureOnNextAnimationFrame();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver?.disconnect();
      measureOnNextAnimationFrame.cancel?.(); // 대기 중인 rAF 취소
    };
  }, [virtualizer, containerRef, enabled]);
}
