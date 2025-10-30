// useOverlay.ts
'use client';

import { ReactNode } from 'react';
import {
  useOverlayStore,
  OverlayOptions,
  OverlayItem,
} from '@/stores/overlayStore';

/**
 * 전역 오버레이 표시/숨기기를 간편하게 사용할 수 있는 훅
 */
export const useOverlay = () => {
  // zustand 스토어에서 액션 가져오기
  const push = useOverlayStore((state) => state.push);
  const pop = useOverlayStore((state) => state.pop);
  const show = useOverlayStore((state) => state.showOverlay);
  const hide = useOverlayStore((state) => state.hideOverlay);

  /**
   * 오버레이 열기 (기존 API - 하위 호환)
   * @param element  띄우고 싶은 ReactNode (JSX)
   * @param options  disableInteraction, fullScreen 옵션
   */
  const openOverlay = (
    element: ReactNode,
    options?: OverlayOptions,
  ) => {
    show(element, options);
  };

  /** 오버레이 닫기 (기존 API - 하위 호환) */
  const closeOverlay = () => {
    hide();
  };

  /**
   * Promise 기반 오버레이 열기 (새로운 API)
   * @param renderer 렌더 함수 (close 함수를 받음)
   * @param options 오버레이 옵션
   * @returns Promise<T> 사용자가 close에 전달한 값
   *
   * @example
   * const confirmed = await open(({ close }) => (
   *   <Dialog onConfirm={() => close(true)} onCancel={() => close(false)} />
   * ));
   */
  const open = <T = unknown>(
    renderer: (props: { close: (result: T) => void }) => ReactNode,
    options?: OverlayOptions,
  ): Promise<T> => {
    return new Promise((resolve) => {
      const id = `overlay-${Date.now()}-${Math.random()}`;

      const close = (result: T) => {
        // 스택에서 제거
        pop(id);
        // Promise 완료
        resolve(result);
      };

      // renderer 실행하여 element 생성
      const element = renderer({ close });

      // 스택에 추가
      const item: OverlayItem<T> = {
        id,
        element,
        isOpen: true,
        options: options || {},
        resolve,
      };

      push(item);
    });
  };

  return {
    openOverlay, // 기존 API
    closeOverlay, // 기존 API
    open, // 새로운 Promise API
  };
};
