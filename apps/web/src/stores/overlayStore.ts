// overlayStore.ts
// zustand + immer를 사용해 스택 기반 오버레이 상태를 관리하는 스토어
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { ReactNode } from 'react';

export interface OverlayOptions {
  blockScroll?: boolean; // true면 배경 스크롤 차단
  backdrop?: boolean; // true면 전면 배경 반투명 처리
  closeOnBackdrop?: boolean; // true면 배경 클릭 시 닫기
}

export interface OverlayItem<T = unknown> {
  id: string; // 고유 ID
  element: ReactNode; // 렌더링할 요소
  isOpen: boolean; // 열림 상태
  options: OverlayOptions; // 옵션
  resolve?: (value: T) => void; // Promise resolve 함수
}

// 스토어에서 관리할 상태 타입
interface OverlayState {
  stack: OverlayItem<unknown>[]; // 오버레이 스택

  // 오버레이 추가 (스택에 push)
  push: <T = unknown>(item: OverlayItem<T>) => void;

  // 오버레이 제거 (ID로)
  pop: (id: string) => void;

  // 최상단 오버레이 제거
  popTop: () => void;

  // 특정 ID의 오버레이 업데이트
  updateItem: (
    id: string,
    updates: Partial<OverlayItem<unknown>>,
  ) => void;

  // 특정 ID의 오버레이 찾기
  find: (id: string) => OverlayItem<unknown> | undefined;

  // 현재 활성 오버레이 찾기 (Toss 패턴)
  getCurrent: () => OverlayItem<unknown> | undefined;

  // 하위 호환: 기존 API
  showOverlay: (el: ReactNode, opts?: OverlayOptions) => string; // ID 반환
  hideOverlay: () => void; // 최상단 닫기
}

let overlayIdCounter = 0;

// zustand 스토어 생성 (Immer + DevTools)
export const useOverlayStore: () => OverlayState =
  create<OverlayState>()(
    devtools(
      immer((set, get) => ({
        stack: [],

        push: <T = unknown>(item: OverlayItem<T>) =>
          set((state) => {
            state.stack.push(item as OverlayItem<unknown>);
          }),

        pop: (id: string) =>
          set((state) => {
            const index = state.stack.findIndex(
              (item) => item.id === id,
            );
            if (index !== -1) {
              state.stack.splice(index, 1);
            }
          }),

        popTop: () =>
          set((state) => {
            state.stack.pop();
          }),

        updateItem: (
          id: string,
          updates: Partial<OverlayItem<unknown>>,
        ) =>
          set((state) => {
            const item = state.stack.find((item) => item.id === id);
            if (item) {
              Object.assign(item, updates);
            }
          }),

        // 특정 ID 찾기
        find: (id: string) => {
          return get().stack.find((item) => item.id === id);
        },

        getCurrent: () => {
          const { stack } = get();
          // 역순으로 순회하여 isOpen === true인 첫 번째 찾기
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].isOpen) {
              return stack[i];
            }
          }
          return undefined;
        },

        // === 하위 호환: 기존 API ===

        // showOverlay: 스택에 추가하고 ID 반환
        showOverlay: (element, options = {}) => {
          const id = `overlay-${++overlayIdCounter}`;
          const item: OverlayItem<unknown> = {
            id,
            element,
            options,
            isOpen: true,
          };
          get().push(item);
          return id;
        },

        // hideOverlay: 최상단 제거
        hideOverlay: () => {
          get().popTop();
        },
      })),
      { name: 'OverlayStore' },
    ),
  );
