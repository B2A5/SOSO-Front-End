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

/**
 * PopoverPortal 컴포넌트의 Props
 */
export interface PopoverPortalProps {
  /**
   * Portal을 통해 렌더링할 자식 요소
   * 일반적으로 PopoverContent 컴포넌트를 포함합니다
   */
  children: ReactNode;

  /**
   * Portal이 렌더링될 DOM 컨테이너
   * 지정하지 않으면 document.body에 렌더링됩니다
   * @default document.body
   * @example
   * const portalContainer = document.getElementById('portal-root');
   * <Popover.Portal container={portalContainer}>
   */
  container?: Element | null;
}

// ============================================
// Component
// ============================================

/**
 * PopoverPortal 컴포넌트
 *
 * React Portal을 사용하여 자식 요소를 DOM 트리의 다른 위치(보통 document.body)에 렌더링합니다.
 * 이를 통해 z-index, overflow 등의 CSS 제약을 우회할 수 있습니다.
 *
 * 주요 기능:
 * - 자식 요소를 지정된 컨테이너(기본값: document.body)에 렌더링
 * - 클라이언트 사이드에서만 렌더링 (SSR 호환)
 * - 오버레이, 모달, 드롭다운 등에 최적화
 *
 * @component
 * @example
 * // 기본 사용법 (document.body에 렌더링)
 * <Popover.Root>
 *   <Popover.Trigger>열기</Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content>콘텐츠</Popover.Content>
 *   </Popover.Portal>
 * </Popover.Root>
 *
 * @example
 * // 커스텀 컨테이너 지정
 * const portalRoot = document.getElementById('custom-portal');
 * <Popover.Portal container={portalRoot}>
 *   <Popover.Content>콘텐츠</Popover.Content>
 * </Popover.Portal>
 */
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
