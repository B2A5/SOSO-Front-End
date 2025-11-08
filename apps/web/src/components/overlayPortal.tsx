// OverlayPortal.tsx
'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayStore } from '@/stores/overlayStore';
import { cn } from '@/utils/cn';

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
          <React.Fragment key={item.id}>
            {/* 백드롭 레이어 (블러 애니메이션) */}
            {item.options.backdrop && (
              <div
                className={cn(
                  'fixed inset-0',
                  'bg-overlay',
                  'pointer-events-auto',
                  item.isOpen
                    ? 'backdrop-blur-in'
                    : 'backdrop-blur-out',
                )}
                style={{
                  zIndex: 2000 + index,
                }}
                onClick={handleBackdropClick}
              />
            )}

            {/* 콘텐츠 레이어 (fade 애니메이션, 포지셔닝 방해 없음) */}
            <div
              className={cn(
                'fixed inset-0',
                'pointer-events-none', // 백드롭 클릭을 방해하지 않음
                item.isOpen ? 'fade-in' : 'fade-out',
              )}
              style={{
                zIndex: 2000 + index + 1, // 백드롭보다 위
              }}
            >
              <div
                className="pointer-events-auto" // 콘텐츠는 클릭 가능
                onClick={(e) => e.stopPropagation()}
              >
                {item.element}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </>,
    document.body,
  );
};
