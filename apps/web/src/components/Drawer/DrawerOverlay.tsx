'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrawerContext } from './DrawerContext';
import { Z_INDEX } from './constants';
import { cn } from '@/utils/cn';

/**
 * Drawer Overlay Props
 */
export interface DrawerOverlayProps {
  /** 추가 className */
  className?: string;
  /** 자식 요소 */
  children?: ReactNode;
}

/**
 * Drawer Overlay Component
 *
 * Drawer의 배경 오버레이 컴포넌트입니다.
 * 모달 모드에서 배경을 어둡게 하고, 클릭 시 닫기를 처리합니다.
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Overlay />
 *   <Drawer.Content>...</Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export function DrawerOverlay({
  className,
  children,
}: DrawerOverlayProps) {
  const { isOpen, setIsOpen, modal, dismissible } =
    useDrawerContext();

  // 오버레이 클릭 핸들러
  const handleClick = () => {
    if (modal && dismissible) {
      setIsOpen(false);
    }
  };

  // 마우스 다운 이벤트 전파 방지 (Content 영역 드래그와 충돌 방지)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          className={cn(
            'fixed inset-0 bg-black/50',
            'touch-none', // 터치 이벤트 비활성화
            className,
          )}
          style={{
            zIndex: Z_INDEX.OVERLAY,
          }}
          aria-hidden="true"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DrawerOverlay.displayName = 'Drawer.Overlay';
