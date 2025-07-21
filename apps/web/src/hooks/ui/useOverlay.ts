// useOverlay.ts
'use client';

import { ReactNode } from 'react';
import {
  useOverlayStore,
  OverlayOptions,
} from '@/stores/overlayStore';

/**
 * 전역 오버레이 표시/숨기기를 간편하게 사용할 수 있는 훅
 */
export const useOverlay = () => {
  // zustand 스토어에서 액션 가져오기
  const show = useOverlayStore((state) => state.showOverlay);
  const hide = useOverlayStore((state) => state.hideOverlay);

  /**
   * 오버레이 열기
   * @param element  띄우고 싶은 ReactNode (JSX)
   * @param options  disableInteraction, fullScreen 옵션
   */
  const openOverlay = (
    element: ReactNode,
    options?: OverlayOptions,
  ) => {
    show(element, options);
  };

  /** 오버레이 닫기 */
  const closeOverlay = () => {
    hide();
  };

  return { openOverlay, closeOverlay };
};
