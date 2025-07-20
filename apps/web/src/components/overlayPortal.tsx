// OverlayPortal.tsx
'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayStore } from '@/stores/overlayStore';

export const OverlayPortal: React.FC = () => {
  const { element, options } = useOverlayStore();

  useEffect(() => {
    document.body.style.overflow = options.blockScroll
      ? 'hidden'
      : 'auto';
  }, [options.blockScroll]);

  if (!element) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-[2000]
        flex items-center justify-center
        ${options.backdrop ? 'bg-overlay' : 'bg-transparent'}
        pointer-events-auto
      `}
    >
      {element}
    </div>,
    document.body,
  );
};
