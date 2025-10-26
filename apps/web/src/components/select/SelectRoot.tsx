'use client';

/**
 * SelectRoot 컴포넌트
 * Popover를 감싸서 value 상태 관리 추가
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {
  PopoverRoot,
  type PopoverRootProps,
} from '../popover/PopoverRoot';

// ============================================
// Types
// ============================================

/**
 * Select 컴포넌트의 크기
 * @typedef {'sm' | 'md' | 'lg'} SelectSize
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * SelectRoot 컴포넌트의 Props
 */
export interface SelectRootProps
  extends Omit<PopoverRootProps, 'children'> {
  /**
   * Select 내부의 자식 요소들
   * 일반적으로 Trigger, Portal, Content, Item 컴포넌트를 포함합니다
   */
  children: ReactNode;

  /**
   * 선택된 값 (제어 컴포넌트)
   * 제공하면 부모에서 선택 상태를 제어하는 제어 컴포넌트가 됩니다
   * @example
   * const [value, setValue] = useState('option1');
   * <Select value={value} onValueChange={setValue}>
   */
  value?: string;

  /**
   * 초기 선택 값 (비제어 컴포넌트)
   * value prop을 제공하지 않을 때만 사용됩니다
   * @example
   * <Select defaultValue="option1">
   */
  defaultValue?: string;

  /**
   * 값이 변경될 때 호출되는 콜백
   * @param value - 새로 선택된 값
   * @example
   * <Select onValueChange={(value) => console.log('Selected:', value)}>
   */
  onValueChange?: (value: string) => void;

  /**
   * Select의 비활성화 여부
   * true일 경우 선택이 불가능합니다
   * @default false
   */
  disabled?: boolean;

  /**
   * Select의 크기
   * 트리거 버튼과 아이템의 크기를 결정합니다
   * @default 'md'
   * @example
   * size="sm" // 작은 크기 (120px 최소 너비, 작은 패딩)
   * size="md" // 중간 크기 (200px 최소 너비, 기본 패딩)
   * size="lg" // 큰 크기 (240px 최소 너비, 큰 패딩)
   */
  size?: SelectSize;
}

/**
 * Select Context에서 제공되는 값
 * @internal
 */
export interface SelectContextValue {
  /** 현재 선택된 값 */
  value?: string;
  /** 값 변경 콜백 */
  onValueChange?: (value: string) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 선택된 아이템의 표시 레이블 */
  selectedLabel?: string;
  /** 선택된 레이블 설정 함수 */
  setSelectedLabel?: (label: string) => void;
  /** Select 크기 */
  size: SelectSize;
}

// ============================================
// Context
// ============================================

export const SelectContext = createContext<SelectContextValue | null>(
  null,
);

SelectContext.displayName = 'SelectContext';

// ============================================
// Hook
// ============================================

/**
 * Select Context에 접근하는 Hook
 * Select의 하위 컴포넌트에서 사용하여 선택 상태 및 설정에 접근합니다
 *
 * @throws {Error} Select.Root 외부에서 사용 시 에러 발생
 * @returns {SelectContextValue} Select의 상태 및 설정
 *
 * @example
 * function CustomItem() {
 *   const { value, onValueChange } = useSelectContext();
 *   return <button onClick={() => onValueChange('new-value')}>선택</button>;
 * }
 */
export function useSelectContext() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error(
      'Select 컴포넌트는 Select.Root 내부에서 사용해야 합니다.',
    );
  }

  return context;
}

// ============================================
// Component
// ============================================

/**
 * SelectRoot 컴포넌트
 *
 * Select의 최상위 컴포넌트로, 선택 상태 관리와 Context 제공을 담당합니다.
 * Popover를 기반으로 구축되어 드롭다운 형태의 선택 UI를 제공합니다.
 *
 * @component
 * @example
 * // 비제어 컴포넌트 (기본 사용법)
 * <Select>
 *   <Select.Trigger placeholder="옵션 선택" />
 *   <Select.Portal>
 *     <Select.Content>
 *       <Select.Item value="1">옵션 1</Select.Item>
 *       <Select.Item value="2">옵션 2</Select.Item>
 *       <Select.Item value="3">옵션 3</Select.Item>
 *     </Select.Content>
 *   </Select.Portal>
 * </Select>
 *
 * @example
 * // 제어 컴포넌트
 * const [value, setValue] = useState('1');
 * <Select value={value} onValueChange={setValue}>
 *   <Select.Trigger placeholder="옵션 선택" />
 *   <Select.Portal>
 *     <Select.Content>
 *       <Select.Item value="1">옵션 1</Select.Item>
 *       <Select.Item value="2">옵션 2</Select.Item>
 *     </Select.Content>
 *   </Select.Portal>
 * </Select>
 *
 * @example
 * // 크기 조절
 * <Select size="sm">
 *   <Select.Trigger placeholder="작은 선택" />
 *   <Select.Portal>
 *     <Select.Content>
 *       <Select.Item value="1">옵션 1</Select.Item>
 *     </Select.Content>
 *   </Select.Portal>
 * </Select>
 */
export function SelectRoot({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
  size = 'md',
  ...popoverProps
}: SelectRootProps) {
  // 제어/비제어 컴포넌트 패턴 (value)
  const [uncontrolledValue, setUncontrolledValue] =
    useState(defaultValue);
  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled
    ? controlledValue
    : uncontrolledValue;

  // 선택된 아이템의 label 저장
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  // Select Context value
  const selectContextValue = useMemo(
    () => ({
      value,
      onValueChange: (newValue: string) => {
        if (!isValueControlled) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
      },
      disabled,
      selectedLabel,
      setSelectedLabel,
      size,
    }),
    [
      value,
      onValueChange,
      disabled,
      isValueControlled,
      selectedLabel,
      size,
    ],
  );

  return (
    <SelectContext.Provider value={selectContextValue}>
      <PopoverRoot {...popoverProps}>{children}</PopoverRoot>
    </SelectContext.Provider>
  );
}

SelectRoot.displayName = 'SelectRoot';
