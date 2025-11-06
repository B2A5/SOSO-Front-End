'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
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
 * Drawer Root Props
 */
export interface DrawerRootProps {
  children: ReactNode;

  // 열림 상태
  /** 제어 모드: 외부에서 제어하는 열림 상태 */
  open?: boolean;
  /** 비제어 모드: 초기 열림 상태 (기본값: false) */
  defaultOpen?: boolean;
  /** 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;

  // 스냅 포인트
  /** 스냅 포인트 배열 (화면 높이 기준 비율) */
  snapPoints?: SnapPoint[];
  /** 제어 모드: 외부에서 제어하는 활성 스냅 포인트 인덱스 */
  activeSnapPoint?: number;
  /** 스냅 포인트 변경 콜백 */
  onSnapPointChange?: (index: number) => void;

  // 동작 설정
  /** Drawer 위치 (기본 'bottom') */
  position?: DrawerPosition;
  /** 드래그로 닫기 허용 (기본 true) */
  dismissible?: boolean;
  /** 모달 모드: 배경 클릭으로 닫기 (기본 true) */
  modal?: boolean;
  /** 닫기 임계값 (0~1, 기본 0.5) */
  closeThreshold?: number;
  /** 스크롤 잠금 타임아웃 (ms, 기본 500) */
  scrollLockTimeout?: number;
}

/**
 * Drawer Root Component
 *
 * Drawer의 최상위 컴포넌트입니다.
 * Context Provider를 제공하며, 제어/비제어 모드를 모두 지원합니다.
 *
 * @supports 제어/비제어 모드
 * - 비제어 모드: defaultOpen만 제공, 내부 상태로 관리
 * - 제어 모드: open + onOpenChange 제공, 외부에서 상태 관리
 */
export function DrawerRoot({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  snapPoints = DEFAULT_SNAP_POINTS,
  activeSnapPoint,
  onSnapPointChange,
  position = 'bottom',
  dismissible = true,
  modal = true,
  closeThreshold = 0.5,
}: DrawerRootProps) {
  // 제어 모드 여부 판별
  const isControlled = open !== undefined;
  const isSnapPointControlled = activeSnapPoint !== undefined;

  // 초기 스냅 포인트 인덱스
  const initialSnapPointIndex =
    activeSnapPoint !== undefined
      ? activeSnapPoint
      : snapPoints.length - 1;

  // 열림/닫힘 상태 (비제어 모드에서만 사용)
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // 스냅 포인트 관련 상태 (비제어 모드에서만 사용)
  const [internalSnapPointIndex, setInternalSnapPointIndex] =
    useState(initialSnapPointIndex);

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

  // 제어 모드: 외부 상태 변경 시 내부 상태 동기화
  useEffect(() => {
    if (isControlled && open !== undefined) {
      setInternalOpen(open);
    }
  }, [isControlled, open]);

  // 제어 모드: 외부 스냅 포인트 변경 시 내부 상태 동기화
  useEffect(() => {
    if (isSnapPointControlled && activeSnapPoint !== undefined) {
      setInternalSnapPointIndex(activeSnapPoint);
    }
  }, [isSnapPointControlled, activeSnapPoint]);

  // 실제 사용할 상태 값 (제어/비제어 모드에 따라)
  const isOpen = isControlled ? open : internalOpen;
  const activeSnapPointIndexValue = isSnapPointControlled
    ? activeSnapPoint
    : internalSnapPointIndex;

  // 상태 변경 함수들을 useCallback으로 메모이제이션
  const handleSetIsOpen = useCallback(
    (newOpen: boolean) => {
      // 비제어 모드: 내부 상태 업데이트
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      // 제어/비제어 모두: 콜백 호출 (부모가 상태 관리)
      onOpenChange?.(newOpen);
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
      activeSnapPointIndex: activeSnapPointIndexValue,
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
      activeSnapPointIndexValue,
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

DrawerRoot.displayName = 'Drawer.Root';

/**
 * Drawer Context Hook
 *
 * Drawer 하위 컴포넌트에서 Context 값을 가져옵니다.
 * Drawer.Root 외부에서 사용하면 에러가 발생합니다.
 */
export function useDrawerContext() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(
      'useDrawerContext must be used within Drawer.Root',
    );
  }

  return context;
}
