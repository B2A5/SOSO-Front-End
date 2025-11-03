'use client';

import { ReactNode } from 'react';
import { useDrawerContext } from './DrawerContext';
import { cn } from '@/utils/cn';

/**
 * Drawer Items Props
 */
export interface DrawerItemsProps {
  /** 자식 요소 (아이템 텍스트) */
  children: ReactNode;
  /** 추가 className */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 위험한 액션 여부 (삭제, 신고 등) */
  destructive?: boolean;
  /** 클릭 후 Drawer를 닫을지 여부 (기본: true) */
  closeOnClick?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * Drawer Items Component
 *
 * Drawer 내부의 메뉴 아이템입니다.
 * destructive prop으로 위험한 액션을 시각적으로 구분할 수 있습니다.
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Content>
 *     <Drawer.Items onClick={handleEdit}>수정하기</Drawer.Items>
 *     <Drawer.Items destructive onClick={handleDelete}>삭제하기</Drawer.Items>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export function DrawerItems({
  children,
  className,
  onClick,
  destructive = false,
  closeOnClick = true,
  disabled = false,
}: DrawerItemsProps) {
  const { setIsOpen } = useDrawerContext();

  const handleClick = () => {
    if (disabled) return;

    // 사용자가 제공한 onClick 실행
    onClick?.();

    // closeOnClick이 true면 Drawer 닫기
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        // 기본 스타일
        'w-full flex items-center justify-center px-4 py-4 rounded-2xl',
        'font-medium transition-colors duration-200',
        // 호버/액티브 상태
        'hover:bg-gray-50 active:bg-gray-100',
        // destructive 스타일
        destructive &&
          'text-red-600 hover:bg-red-50 active:bg-red-100',
        // 비활성화 스타일
        disabled && 'opacity-50 cursor-not-allowed',
        // 기본 텍스트 색상
        !destructive && !disabled && 'text-gray-900',
        className,
      )}
    >
      {children}
    </button>
  );
}

DrawerItems.displayName = 'Drawer.Items';
