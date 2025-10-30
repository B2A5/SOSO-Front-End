// overlayStore.ts
// zustand를 사용해 스택 기반 오버레이 상태를 관리하는 스토어
import { create } from 'zustand';
import { ReactNode } from 'react';

// 오버레이 옵션 타입 정의
export interface OverlayOptions {
  blockScroll?: boolean; // true면 배경 스크롤 차단
  backdrop?: boolean; // true면 전면 배경 반투명 처리
  closeOnBackdrop?: boolean; // true면 배경 클릭 시 닫기
}

// 개별 오버레이 아이템
export interface OverlayItem<T = unknown> {
  id: string; // 고유 ID
  element: ReactNode; // 렌더링할 요소
  options: OverlayOptions; // 옵션
  resolve?: (value: T) => void; // Promise resolve 함수
}

// 스토어에서 관리할 상태 타입
interface OverlayState {
  stack: OverlayItem<unknown>[]; // 오버레이 스택 (any 타입 허용)

  // 오버레이 추가 (스택에 push)
  push: <T = unknown>(item: OverlayItem<T>) => void;

  // 오버레이 제거 (ID로)
  pop: (id: string) => void;

  // 최상단 오버레이 제거
  popTop: () => void;

  // 특정 ID의 오버레이 찾기
  find: (id: string) => OverlayItem<unknown> | undefined;

  // 하위 호환: 기존 API
  showOverlay: (el: ReactNode, opts?: OverlayOptions) => string; // ID 반환
  hideOverlay: () => void; // 최상단 닫기
}

let overlayIdCounter = 0;

// zustand 스토어 생성
export const useOverlayStore = create<OverlayState>((set, get) => ({
  stack: [], // 초기에는 빈 스택

  // 스택에 오버레이 추가
  push: <T = unknown>(item: OverlayItem<T>) =>
    set((state) => ({
      stack: [...state.stack, item as OverlayItem<unknown>],
    })),

  // 특정 ID의 오버레이 제거
  pop: (id) =>
    set((state) => ({
      stack: state.stack.filter((item) => item.id !== id),
    })),

  // 최상단 오버레이 제거
  popTop: () =>
    set((state) => ({
      stack: state.stack.slice(0, -1),
    })),

  // 특정 ID 찾기
  find: (id) => {
    return get().stack.find((item) => item.id === id);
  },

  // === 하위 호환: 기존 API ===

  // showOverlay: 스택에 추가하고 ID 반환
  showOverlay: (element, options = {}) => {
    const id = `overlay-${++overlayIdCounter}`;
    const item: OverlayItem<unknown> = { id, element, options };
    get().push(item);
    return id;
  },

  // hideOverlay: 최상단 제거
  hideOverlay: () => {
    get().popTop();
  },
}));
