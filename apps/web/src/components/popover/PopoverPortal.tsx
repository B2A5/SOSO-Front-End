'use client';

/**
 * PopoverPortal 컴포넌트
 * React Portal을 사용하여 자식을 document.body에 렌더링
 */

import { createPortal } from 'react-dom';
import { useEffect, useState, type ReactNode } from 'react';

// ============================================
// Types
// ============================================

export interface PopoverPortalProps {
  children: ReactNode;
  container?: Element | null;
}

// ============================================
// Component
// ============================================

export function PopoverPortal({
  children,
  container,
}: PopoverPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container || document.body);
}

PopoverPortal.displayName = 'PopoverPortal';
