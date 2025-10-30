// OverlayPortal.tsx
'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayStore } from '@/stores/overlayStore';

export const OverlayPortal: React.FC = () => {
  const { stack, pop } = useOverlayStore();

  // 스택에 하나라도 blockScroll이 있으면 스크롤 차단
  const shouldBlockScroll = stack.some(
    (item) => item.options.blockScroll,
  );

  useEffect(() => {
    document.body.style.overflow = shouldBlockScroll
      ? 'hidden'
      : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [shouldBlockScroll]);

  if (stack.length === 0) return null;

  return createPortal(
    <>
      {stack.map((item, index) => {
        const handleBackdropClick = () => {
          if (item.options.closeOnBackdrop) {
            pop(item.id);
          }
        };

        return (
          <div
            key={item.id}
            className={`
              fixed inset-0
              flex items-end md:items-center justify-center
              ${item.options.backdrop ? 'bg-overlay' : 'bg-transparent'}
              pointer-events-auto
              ${item.isOpen ? 'fade-in' : 'fade-out'}
            `}
            style={{
              zIndex: 2000 + index, // 스택 순서대로 z-index 증가
            }}
            onClick={handleBackdropClick}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {item.element}
            </div>
          </div>
        );
      })}
    </>,
    document.body,
  );
};
