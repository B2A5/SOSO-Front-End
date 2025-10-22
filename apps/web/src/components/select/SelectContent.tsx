'use client';

/**
 * SelectContent 컴포넌트
 * Popover.Content에 keyboard navigation 추가
 */

import { useEffect, useCallback } from 'react';
import {
  PopoverContent,
  type PopoverContentProps,
} from '../popover/PopoverContent';
import { usePopoverContext } from '../popover/PopoverRoot';

/**
 * SelectContent 컴포넌트의 Props
 */
interface SelectContentProps extends PopoverContentProps {
  /**
   * 아이템 간 간격 (Tailwind gap 클래스 값)
   * @default 1
   * @example
   * gap={2} // gap-2 클래스 적용
   */
  gap?: number;
}

/**
 * SelectContent 컴포넌트
 *
 * Select의 드롭다운 콘텐츠 컨테이너입니다.
 * PopoverContent를 기반으로 하며, Select에 특화된 키보드 네비게이션을 제공합니다.
 *
 * 주요 기능:
 * - 드롭다운 열릴 때 첫 번째 아이템에 자동 포커스
 * - 키보드 네비게이션 (ArrowUp, ArrowDown, Home, End)
 * - 순환 네비게이션 지원 (마지막 아이템에서 ArrowDown → 첫 아이템)
 * - Tab 키로 드롭다운 닫기
 * - PopoverContent의 모든 props 지원 (side, align, sideOffset 등)
 *
 * @component
 * @example
 * // 기본 사용법
 * <Select.Portal>
 *   <Select.Content>
 *     <Select.Item value="1">옵션 1</Select.Item>
 *     <Select.Item value="2">옵션 2</Select.Item>
 *     <Select.Item value="3">옵션 3</Select.Item>
 *   </Select.Content>
 * </Select.Portal>
 *
 * @example
 * // 위치 및 간격 조절
 * <Select.Content
 *   side="top"
 *   align="center"
 *   sideOffset={8}
 *   gap={2}
 * >
 *   <Select.Item value="1">옵션 1</Select.Item>
 *   <Select.Item value="2">옵션 2</Select.Item>
 * </Select.Content>
 *
 * @example
 * // 커스텀 스타일
 * <Select.Content className="min-w-[300px] max-h-[400px] overflow-auto">
 *   <Select.Item value="1">옵션 1</Select.Item>
 *   <Select.Item value="2">옵션 2</Select.Item>
 * </Select.Content>
 */
export function SelectContent({
  children,
  gap = 1,
  className,
  ...props
}: SelectContentProps) {
  const { open, setOpen, contentRef } = usePopoverContext();

  // 드롭다운 열릴 때 첫 번째 아이템에 포커스
  useEffect(() => {
    if (open && contentRef.current) {
      // 약간의 지연 후 포커스 (애니메이션 후)
      const timer = setTimeout(() => {
        const firstItem =
          contentRef.current?.querySelector<HTMLElement>(
            '[role="option"]',
          );
        firstItem?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open, contentRef]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!contentRef.current) return;

      const items = Array.from<HTMLElement>(
        contentRef.current.querySelectorAll('[role="option"]'),
      );
      const currentIndex = items.findIndex(
        (item) => item === document.activeElement,
      );

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < items.length - 1) {
            items[currentIndex + 1]?.focus();
          } else {
            items[0]?.focus(); // 순환
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1]?.focus();
          } else {
            items[items.length - 1]?.focus(); // 순환
          }
          break;

        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;

        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;

        case 'Tab':
          // Tab으로 포커스 이동 시 드롭다운 닫기
          setOpen(false);
          break;
      }
    },
    [contentRef, setOpen],
  );

  return (
    <PopoverContent
      {...props}
      className={className}
      onKeyDown={handleKeyDown}
    >
      <div role="listbox" className={`flex flex-col gap-${gap}`}>
        {children}
      </div>
    </PopoverContent>
  );
}

SelectContent.displayName = 'SelectContent';
