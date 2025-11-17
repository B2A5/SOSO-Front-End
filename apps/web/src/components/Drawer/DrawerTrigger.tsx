'use client';

import React, { ReactNode } from 'react';
import { useDrawerContext } from './DrawerRoot';

/**
 * Drawer Trigger Props
 */
export interface DrawerTriggerProps {
  /** 자식 요소 (버튼 텍스트 등) */
  children: ReactNode;
  /** 추가 className */
  className?: string;
  /** asChild - true면 children을 직접 렌더링하고 onClick만 추가 */
  asChild?: boolean;
}

/**
 * Drawer Trigger Component
 *
 * Drawer를 여는 트리거 버튼입니다.
 * Context에서 setIsOpen을 가져와 클릭 시 Drawer를 엽니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *
 * // asChild 사용 (button 중첩 방지)
 * <Drawer.Trigger asChild>
 *   <button className="custom-button">Open</button>
 * </Drawer.Trigger>
 * ```
 */
export function DrawerTrigger({
  children,
  className,
  asChild = false,
}: DrawerTriggerProps) {
  const { setIsOpen } = useDrawerContext();

  // asChild가 true면 children을 복제하고 onClick 추가
  if (asChild) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        onClick: (e: React.MouseEvent) => {
          setIsOpen(true);
          // 기존 onClick이 있으면 함께 실행
          children.props.onClick?.(e);
        },
      } as unknown as React.ReactElement);
    }

    console.warn(
      'DrawerTrigger: asChild는 단일 React 요소를 필요로 합니다.',
    );
    return <>{children}</>;
  }

  // 기본: button으로 렌더링
  return (
    <button
      onClick={() => setIsOpen(true)}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}

DrawerTrigger.displayName = 'Drawer.Trigger';
