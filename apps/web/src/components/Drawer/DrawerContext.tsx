'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { DEFAULT_SNAP_POINTS } from './constants';

/**
 * Drawer 위치
 */
export type DrawerPosition = 'bottom' | 'top' | 'left' | 'right';

/**
 * 스냅 포인트: 숫자(비율) 또는 문자열(퍼센트)
 * 예: 0.5 또는 "50%" = 화면 높이의 50%
 */
export type SnapPoint = number | string;

/**
 * Drawer Context 값
 */
export interface DrawerContextValue {
  /** 열림 상태 */
  isOpen: boolean;
  /** 열기/닫기 함수 */
  setIsOpen: (open: boolean) => void;
  /** 스냅 포인트 배열 */
  snapPoints: SnapPoint[];
  /** 현재 활성 스냅 포인트 인덱스 */
  activeSnapPointIndex: number;
  /** 스냅 포인트 변경 */
  setActiveSnapPointIndex: (index: number) => void;
  /** 드래그 중 여부 */
  isDragging: boolean;
  /** 드래그 중 여부 설정 */
  setIsDragging: (dragging: boolean) => void;
  /** 현재 드래그 Y 위치 (px) */
  dragY: number;
  /** 드래그 Y 위치 설정 */
  setDragY: (y: number) => void;
  /** 드래그로 닫기 허용 */
  dismissible: boolean;
  /** 닫기 임계값 */
  closeThreshold: number;
  /** Drawer 위치 */
  position: DrawerPosition;
  /** 모달 모드 */
  modal: boolean;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

/**
 * Drawer Context Provider Props
 */
interface DrawerProviderProps {
  children: React.ReactNode;
  /** 초기 열림 상태 */
  initialOpen?: boolean;
  /** 제어 모드: 외부에서 제어하는 열림 상태 */
  controlledOpen?: boolean;
  /** 제어 모드: 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
  /** 스냅 포인트 배열 */
  snapPoints?: SnapPoint[];
  /** 초기 활성 스냅 포인트 인덱스 */
  initialSnapPointIndex?: number;
  /** 제어 모드: 외부에서 제어하는 스냅 포인트 인덱스 */
  controlledSnapPointIndex?: number;
  /** 제어 모드: 스냅 포인트 변경 콜백 */
  onSnapPointChange?: (index: number) => void;
  /** 드래그로 닫기 허용 */
  dismissible?: boolean;
  /** 닫기 임계값 (0~1) */
  closeThreshold?: number;
  /** Drawer 위치 */
  position?: DrawerPosition;
  /** 모달 모드 */
  modal?: boolean;
}

/**
 * Drawer Context Provider
 *
 * Drawer의 모든 상태를 관리하는 Context Provider입니다.
 * Root 컴포넌트 내부에서 사용됩니다.
 *
 * @supports 제어/비제어 모드
 * - 비제어 모드: initialOpen만 제공, 내부 상태로 관리
 * - 제어 모드: controlledOpen + onOpenChange 제공, 외부에서 상태 관리
 */
export function DrawerProvider({
  children,
  initialOpen = false,
  controlledOpen,
  onOpenChange,
  snapPoints = DEFAULT_SNAP_POINTS,
  initialSnapPointIndex = snapPoints.length - 1,
  controlledSnapPointIndex,
  onSnapPointChange,
  dismissible = true,
  closeThreshold = 0.5,
  position = 'bottom',
  modal = true,
}: DrawerProviderProps) {
  // 제어 모드 여부 판별
  const isControlled = controlledOpen !== undefined;
  const isSnapPointControlled =
    controlledSnapPointIndex !== undefined;

  // 열림/닫힘 상태 (비제어 모드에서만 사용)
  const [internalOpen, setInternalOpen] = useState(initialOpen);

  // 스냅 포인트 관련 상태 (비제어 모드에서만 사용)
  const [internalSnapPointIndex, setInternalSnapPointIndex] =
    useState(initialSnapPointIndex);

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

  // 제어 모드: 외부 상태 변경 시 내부 상태 동기화
  useEffect(() => {
    if (isControlled && controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [isControlled, controlledOpen]);

  // 제어 모드: 외부 스냅 포인트 변경 시 내부 상태 동기화
  useEffect(() => {
    if (
      isSnapPointControlled &&
      controlledSnapPointIndex !== undefined
    ) {
      setInternalSnapPointIndex(controlledSnapPointIndex);
    }
  }, [isSnapPointControlled, controlledSnapPointIndex]);

  // 실제 사용할 상태 값 (제어/비제어 모드에 따라)
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const activeSnapPointIndex = isSnapPointControlled
    ? controlledSnapPointIndex
    : internalSnapPointIndex;

  // 상태 변경 함수들을 useCallback으로 메모이제이션
  const handleSetIsOpen = useCallback(
    (open: boolean) => {
      // 비제어 모드: 내부 상태 업데이트
      if (!isControlled) {
        setInternalOpen(open);
      }
      // 제어/비제어 모두: 콜백 호출 (부모가 상태 관리)
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange],
  );

  const handleSetActiveSnapPointIndex = useCallback(
    (index: number) => {
      // 비제어 모드: 내부 상태 업데이트
      if (!isSnapPointControlled) {
        setInternalSnapPointIndex(index);
      }
      // 제어/비제어 모두: 콜백 호출 (부모가 상태 관리)
      onSnapPointChange?.(index);
    },
    [isSnapPointControlled, onSnapPointChange],
  );

  const handleSetIsDragging = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  const handleSetDragY = useCallback((y: number) => {
    setDragY(y);
  }, []);

  // Context 값을 useMemo로 메모이제이션하여 불필요한 리렌더링 방지
  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      isOpen,
      setIsOpen: handleSetIsOpen,
      snapPoints,
      activeSnapPointIndex,
      setActiveSnapPointIndex: handleSetActiveSnapPointIndex,
      isDragging,
      setIsDragging: handleSetIsDragging,
      dragY,
      setDragY: handleSetDragY,
      dismissible,
      closeThreshold,
      position,
      modal,
    }),
    [
      isOpen,
      handleSetIsOpen,
      snapPoints,
      activeSnapPointIndex,
      handleSetActiveSnapPointIndex,
      isDragging,
      handleSetIsDragging,
      dragY,
      handleSetDragY,
      dismissible,
      closeThreshold,
      position,
      modal,
    ],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawerContext() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(
      'useDrawerContext must be used within Drawer.Root',
    );
  }

  return context;
}
