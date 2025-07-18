// overlayStore.ts
// zustand를 사용해 단일 오버레이 상태를 관리하는 스토어
import { create } from 'zustand';
import { ReactNode } from 'react';

// 오버레이 옵션 타입 정의
export interface OverlayOptions {
  disableInteraction?: boolean; // true면 배경 스크롤 차단
  fullScreen?: boolean; // true면 전면 배경 반투명 처리
}

// 스토어에서 관리할 상태 타입
interface OverlayState {
  element: ReactNode | null; // 현재 렌더링할 오버레이 요소
  options: OverlayOptions; // 현재 오버레이 옵션
  showOverlay: (el: ReactNode, opts?: OverlayOptions) => void; // 오버레이 표시
  hideOverlay: () => void; // 오버레이 숨기기
}

// zustand 스토어 생성
export const useOverlayStore = create<OverlayState>((set) => ({
  element: null, // 초기에는 오버레이 없음
  options: {}, // 기본 옵션 빈 객체

  // showOverlay: element와 options 설정
  showOverlay: (element, options = {}) => set({ element, options }),

  // hideOverlay: element를 null로 변경하여 포탈에서 제거
  hideOverlay: () => set({ element: null, options: {} }),
}));
