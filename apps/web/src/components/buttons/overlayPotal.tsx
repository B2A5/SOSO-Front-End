// OverlayPortal.tsx
'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayStore } from '@/stores/overlayStore'; // 실제 경로로 수정

/**
 * 전역 오버레이를 document.body 아래에 포탈로 렌더링
 * - options.disableInteraction: true면 body scroll 잠금
 * - options.fullScreen: true면 반투명 백드롭 표시
 */
export const OverlayPortal: React.FC = () => {
  const { element, options } = useOverlayStore();

  // 스크롤 잠금/해제
  useEffect(() => {
    document.body.style.overflow = options.disableInteraction
      ? 'hidden'
      : 'auto';
  }, [options.disableInteraction]);

  // 표시할 element 없으면 렌더 안 함
  if (!element) return null;

  // 포탈로 최상단에 렌더
  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000, // 네비게이션보다 위로
        background: options.fullScreen
          ? 'rgba(0,0,0,0.5)'
          : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      {element}
    </div>,
    document.body,
  );
};
