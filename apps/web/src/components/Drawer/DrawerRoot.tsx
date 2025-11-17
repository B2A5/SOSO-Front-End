'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { DEFAULT_SNAP_POINTS } from './constants';

/**
 * Drawer 위치
 */
export type DrawerPosition = 'bottom' | 'top' | 'left' | 'right';

/**
 * 스냅 포인트: 숫자(비율)
 * 0 ~ 1 사이의 값으로 화면 높이/너비 대비 비율을 나타냅니다.
 */
export type SnapPoint = number;

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
  closeOnDrag: boolean;
  /** 닫기 임계값 */
  closeThreshold: number;
  /** Drawer 위치 */
  position: DrawerPosition;
  /** 백드롭으로 닫기 */
  closeOnBackground: boolean;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

/**
 * Drawer Root Props
 */
export interface DrawerRootProps {
  children: ReactNode;
  // 열림 상태 및 콜백
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // 스냅 포인트
  /** 스냅 포인트 배열 (화면 높이 기준 비율) */
  snapPoints?: SnapPoint[];
  /** 외부에서 제어하는 활성 스냅 포인트 인덱스 */
  activeSnapPoint?: number;
  /** 스냅 포인트 변경 콜백 */
  onSnapPointChange?: (index: number) => void;

  // 동작 설정
  /** Drawer 위치 (기본 'bottom') */
  position?: DrawerPosition;
  /** 드래그로 닫기 허용 (기본 true) */
  closeOnDrag?: boolean;
  /** 배경 클릭으로 닫기 (기본 true) */
  closeOnBackground?: boolean;
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
 */
export function DrawerRoot({
  children,
  open,
  onOpenChange,
  snapPoints = DEFAULT_SNAP_POINTS,
  activeSnapPoint,
  onSnapPointChange,
  position = 'bottom',
  closeOnDrag = true,
  closeOnBackground = true,
  closeThreshold = 0.5,
}: DrawerRootProps) {
  // 열림/닫힘 상태
  const [internalOpen, setInternalOpen] = useState(false);

  // 초기 스냅 포인트 인덱스
  const initialSnapPointIndex =
    activeSnapPoint !== undefined
      ? activeSnapPoint
      : snapPoints.length - 1;

  // 스냅 포인트 관련 상태
  const [internalSnapPointIndex, setInternalSnapPointIndex] =
    useState(initialSnapPointIndex);

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);

  // 실제 사용할 상태 값 (제어/비제어 모드에 따라)
  const isOpen = open !== undefined ? open : internalOpen;
  const activeSnapPointIndexValue =
    activeSnapPoint !== undefined
      ? activeSnapPoint
      : internalSnapPointIndex;

  const handleSetIsOpen = useCallback(
    (newOpen: boolean) => {
      // 비제어 모드: 내부 상태 업데이트
      if (open === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange],
  );

  const handleSetActiveSnapPointIndex = useCallback(
    (index: number) => {
      // 비제어 모드: 내부 상태 업데이트
      if (activeSnapPoint === undefined) {
        setInternalSnapPointIndex(index);
      }
      onSnapPointChange?.(index);
    },
    [activeSnapPoint, onSnapPointChange],
  );

  const handleSetIsDragging = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  const handleSetDragY = useCallback((y: number) => {
    setDragY(y);
  }, []);

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
      closeOnDrag,
      closeOnBackground,
      closeThreshold,
      position,
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
      closeOnDrag,
      closeOnBackground,
      closeThreshold,
      position,
    ],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

DrawerRoot.displayName = 'Drawer.Root';

export function useDrawerContext() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(
      'useDrawerContext must be used within Drawer.Root',
    );
  }

  return context;
}
