'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * 드롭다운 항목 타입
 *
 * @template T - 옵션의 값 타입
 */
interface Option<T> {
  /** 화면에 표시될 레이블 */
  label: string;
  /** 실제 값 */
  value: T;
}

/**
 * SelectDropdown 컴포넌트 Props
 *
 * @template T - 선택 값 타입 (string | number)
 */
interface SelectDropdownProps<T> {
  /** 드롭다운에 표시할 옵션 리스트 */
  options: readonly Option<T>[];
  /** 현재 선택된 값 */
  value: T | null;
  /** 값이 변경될 때 호출되는 콜백 */
  onChange: (value: T) => void;
  /** 접근성용 aria-label (기본값: '선택 드롭다운') */
  ariaLabel?: string;
  /** 값이 없을 때 보여줄 placeholder 텍스트*/
  placeholder?: string;
  className?: string;
}

/**
 * SelectDropdown 컴포넌트
 */
export default function SelectDropdown<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel = '선택 드롭다운',
  placeholder = '선택하세요',
  className,
}: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const isPlaceholder = value == null;
  const selectedLabel = selectedOption?.label ?? placeholder;

  const toggleDropdown = () => {
    if (!isOpen) {
      setIsMounted(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleTransitionEnd = () => {
    if (!isOpen) setIsMounted(false);
  };

  useEffect(() => {
    if (!isOpen) {
      toggleButtonRef.current?.focus();
      return;
    }
    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () =>
      document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const items = Array.from(
        menuRef.current.querySelectorAll<HTMLButtonElement>('button'),
      );
      const idx = options.findIndex((opt) => opt.value === value);
      items[idx >= 0 ? idx : 0]?.focus();
    }
  }, [isOpen, value, options]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLUListElement>,
  ) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        'button',
      ) ?? [],
    );
    const idx = items.findIndex(
      (btn) => btn === document.activeElement,
    );
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
        break;
      case 'Enter':
        e.preventDefault();
        items[idx]?.click();
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={twMerge(
        'relative inline-block text-left',
        className,
      )}
    >
      <button
        ref={toggleButtonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="select-dropdown-list"
        aria-label={ariaLabel}
        onClick={toggleDropdown}
        className={twMerge(
          'inline-flex justify-between items-center w-full px-4 py-2 bg-white border border-neutral-100 rounded-md text-fontColor-gray3 hover:bg-gray-50',
        )}
      >
        <span
          className={twMerge(isPlaceholder && 'text-fontColor-gray2')}
        >
          {selectedLabel}
        </span>
        <ChevronDown
          className={twMerge(
            'w-4 h-4 ml-1 transition-all duration-200 ease-in-out',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isMounted && (
        <ul
          id="select-dropdown-list"
          role="menu"
          ref={menuRef}
          onKeyDown={handleKeyDown}
          onTransitionEnd={handleTransitionEnd}
          className={twMerge(
            'absolute right-0 z-10 mt-[-1px] w-full bg-white border border-neutral-100 rounded-md text-sm origin-top-right transition-transform duration-200',
            isOpen
              ? 'scale-100 opacity-100'
              : 'scale-95 opacity-0 pointer-events-none',
          )}
        >
          {options.map((opt) => (
            <li key={String(opt.value)}>
              <button
                role="menuitem"
                tabIndex={opt.value === value ? 0 : -1}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={twMerge(
                  'w-full text-left px-4 py-2 transition-colors hover:bg-gray-100 focus:bg-gray-100',
                  'focus:outline-none',
                  opt.value === value &&
                    'font-semibold text-fontColor-gray3',
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
