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
 * Immer 기반 스토어와 통합되어 더 우아한 상태 관리를 지원합니다.
 */
export const useOverlay = () => {
  // zustand 스토어에서 액션과 상태 가져오기
  const {
    stack,
    push,
    pop,
    updateItem,
    getCurrent,
    showOverlay,
    hideOverlay,
  } = useOverlayStore();

  /**
   * 오버레이 열기 (기존 API - 하위 호환)
   * @param element  띄우고 싶은 ReactNode (JSX)
   * @param options  disableInteraction, fullScreen 옵션
   */
  const openOverlay = (
    element: ReactNode,
    options?: OverlayOptions,
  ) => {
    showOverlay(element, options);
  };

  /** 오버레이 닫기 (기존 API - 하위 호환) */
  const closeOverlay = () => {
    hideOverlay();
  };

  /**
   * Promise 기반 오버레이 열기 (새로운 API)
   * @param renderer 렌더 함수 (close 함수를 받음)
   * @param options 오버레이 옵션
   * @returns Promise<T> 사용자가 close에 전달한 값
   *
   * @example
   * // 기본: fadeOut 애니메이션 포함 (300ms)
   * const confirmed = await open(({ close }) => (
   *   <Dialog onConfirm={() => close(true)} onCancel={() => close(false)} />
   * ));
   *
   * @example
   * // fadeOut 지속 시간 커스텀
   * const result = await open(({ close }) => (
   *   <Modal onClose={() => close(null, { duration: 500 })} />
   * ));
   *
   * @example
   * // fadeOut 비활성화 (즉시 닫기)
   * const result = await open(({ close }) => (
   *   <Toast onClose={() => close(null, { fadeOut: false })} />
   * ));
   */
  const open = <T = unknown>(
    renderer: (props: {
      close: (
        result: T,
        closeOptions?: { fadeOut?: boolean; duration?: number },
      ) => void;
    }) => ReactNode,
    options?: OverlayOptions,
  ): Promise<T> => {
    return new Promise((resolve) => {
      const id = `overlay-${crypto.randomUUID()}`;

      const close = (
        result: T,
        closeOptions: { fadeOut?: boolean; duration?: number } = {},
      ) => {
        const { fadeOut = true, duration = 300 } = closeOptions;

        if (!fadeOut) {
          pop(id);
          resolve(result);
        } else {
          updateItem(id, { isOpen: false });
          setTimeout(() => {
            pop(id);
          }, duration);
          resolve(result);
        }
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

  /**
   * 현재 활성화된 오버레이 가져오기 (Toss 패턴)
   * @returns 현재 활성화된 오버레이 또는 undefined
   */
  const getCurrentOverlay = () => {
    return getCurrent();
  };

  /**
   * 모든 오버레이 닫기
   * @param withAnimation 애니메이션 적용 여부
   * @param duration 애니메이션 지속 시간 (ms)
   */
  const closeAll = (withAnimation = false, duration = 300) => {
    if (!withAnimation) {
      // 즉시 모든 오버레이 제거
      stack.forEach((item) => {
        pop(item.id);
      });
    } else {
      // 애니메이션과 함께 제거
      stack.forEach((item) => {
        updateItem(item.id, { isOpen: false });
      });
      setTimeout(() => {
        stack.forEach((item) => {
          pop(item.id);
        });
      }, duration);
    }
  };

  return {
    // 기존 API (하위 호환)
    openOverlay,
    closeOverlay,

    // Promise API
    open,

    // 유틸리티 메서드
    getCurrentOverlay,
    closeAll,
  };
};
