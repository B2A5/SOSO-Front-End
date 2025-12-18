import { useEffect } from 'react';
import { Virtualizer } from '@tanstack/react-virtual';
import { rafThrottle } from '@/utils/rafThrottle';

export interface ContainerMeasureOptions<
  TScrollElement extends Element = Element,
  TItemElement extends Element = Element,
> {
  type: 'container';
  virtualizer: Virtualizer<TScrollElement, TItemElement>;
  parentRef: React.RefObject<TScrollElement>;
  enabled?: boolean;
}

export interface WindowMeasureOptions<
  TItemElement extends Element = Element,
> {
  type: 'window';
  virtualizer: Virtualizer<Window, TItemElement>;
  containerRef?: React.RefObject<Element>;
  enabled?: boolean;
}

/**
 * useVirtualizerMeasure Hook
 *
 * Virtual List의 컨테이너 크기 변화를 감지하고 virtualizer를 재측정합니다.
 * Container 기반과 Window 기반 모두 지원합니다.
 *
 * ## 동작 프로세스:
 * 1. **ResizeObserver**: 컨테이너의 크기 변화 감지 (가장 정확)
 * 2. **Window Resize**: 창 크기 변화 감지
 * 3. **rAF Throttle**: 측정 빈도를 프레임당 1회로 제한 (성능 최적화)
 *
 * @param options - 측정 옵션
 * @param options.type - 스크롤 타입: 'container' (element 스크롤) 또는 'window' (전체 페이지 스크롤)
 * @param options.virtualizer - @tanstack/react-virtual의 virtualizer 인스턴스
 * @param options.parentRef - [container 타입 필수] 스크롤 컨테이너의 React ref
 * @param options.containerRef - [window 타입 옵션] 추가로 관찰할 컨테이너 ref
 * @param options.enabled - 측정 활성화 여부 (기본값: true)
 *
 */
export function useVirtualizerMeasure<
  TScrollElement extends Element = Element,
  TItemElement extends Element = Element,
>(
  options:
    | ContainerMeasureOptions<TScrollElement, TItemElement>
    | WindowMeasureOptions<TItemElement>,
) {
  const { type, virtualizer, enabled = true } = options;

  const parentRef =
    'parentRef' in options ? options.parentRef : undefined;
  const containerRef =
    'containerRef' in options ? options.containerRef : undefined;

  useEffect(() => {
    if (!enabled) return;

    if (type === 'container' && !parentRef?.current) {
      console.error(
        '[useVirtualizerMeasure] Container type requires parentRef',
      );
      return;
    }

    const measureOnNextAnimationFrame = rafThrottle(() => {
      virtualizer.measure();
    });

    let resizeObserver: ResizeObserver | null = null;

    if (type === 'container' && parentRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        measureOnNextAnimationFrame();
      });
      resizeObserver.observe(parentRef.current);
    }

    if (type === 'window' && containerRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        measureOnNextAnimationFrame();
      });
      resizeObserver.observe(containerRef.current);
    }

    // Window 리사이즈 감지
    const handleWindowResize = () => {
      measureOnNextAnimationFrame();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      measureOnNextAnimationFrame.cancel?.(); // 대기 중인 rAF 취소
    };
  }, [type, parentRef, containerRef, virtualizer, enabled]);
}
