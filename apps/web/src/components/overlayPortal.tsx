// OverlayPortal.tsx
'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayStore } from '@/stores/overlayStore';

export const OverlayPortal: React.FC = () => {
  const { element, options, hideOverlay } = useOverlayStore();

  useEffect(() => {
    document.body.style.overflow = options.blockScroll
      ? 'hidden'
      : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [options.blockScroll]);

  if (!element) return null;

  const handleBackdropClick = () => {
    if (options.closeOnBackdrop) {
      hideOverlay();
    }
  };

  return createPortal(
    <div
      className={`
        fixed inset-0 z-[2000]
        flex items-end md:items-center justify-center
        ${options.backdrop ? 'bg-overlay' : 'bg-transparent'}
        pointer-events-auto
      `}
      onClick={handleBackdropClick}
    >
      <div onClick={(e) => e.stopPropagation()}>{element}</div>
    </div>,
    document.body,
  );
};
