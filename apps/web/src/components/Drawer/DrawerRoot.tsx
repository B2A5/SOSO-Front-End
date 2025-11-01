'use client';

import { ReactNode } from 'react';
import {
  DrawerProvider,
  DrawerPosition,
  SnapPoint,
} from './DrawerContext';

/**
 * Drawer Root Props
 */
export interface DrawerRootProps {
  /**
   * 열림/닫힘 상태
   * - 비제어 모드: 초기 상태만 설정 (기본 false)
   * - 제어 모드: onOpenChange와 함께 사용하여 외부에서 상태 관리
   */
  open?: boolean;
  /**
   * 상태 변경 콜백
   * - open과 함께 사용하면 제어 모드 활성화
   * - 비제어 모드에서도 상태 변경 알림 받을 수 있음
   */
  onOpenChange?: (open: boolean) => void;
  /** 스냅 포인트 배열 (화면 높이 기준 비율) */
  snapPoints?: SnapPoint[];
  /**
   * 활성 스냅 포인트 인덱스
   * - 비제어 모드: 초기 스냅 포인트만 설정
   * - 제어 모드: onSnapPointChange와 함께 사용하여 외부에서 관리
   */
  activeSnapPoint?: number;
  /**
   * 스냅 포인트 변경 콜백
   * - activeSnapPoint와 함께 사용하면 제어 모드 활성화
   * - 비제어 모드에서도 변경 알림 받을 수 있음
   */
  onSnapPointChange?: (index: number) => void;
  /** 닫기 임계값 (0~1, 기본 0.5) */
  closeThreshold?: number;
  /** 드래그로 닫기 허용 (기본 true) */
  dismissible?: boolean;
  /** 모달 모드 (배경 클릭으로 닫기, 기본 true) */
  modal?: boolean;
  /** 배경 스케일 애니메이션 (기본 false, TODO: Phase 6에서 구현 예정) */
  shouldScaleBackground?: boolean;
  /** Drawer 위치 (기본 'bottom') */
  position?: DrawerPosition;
  /** 자식 요소 */
  children: ReactNode;
}

/**
 * Drawer Root Component
 *
 * Drawer의 최상위 컴포넌트입니다.
 * Context Provider를 제공하며, 제어/비제어 모드를 모두 지원합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용 (닫힌 상태로 시작)
 * <Drawer.Root>
 *   <Drawer.Trigger>Open</Drawer.Trigger>
 *   <Drawer.Content>Content</Drawer.Content>
 * </Drawer.Root>
 *
 * // 초기에 열린 상태로 시작
 * <Drawer.Root open={true}>
 *   <Drawer.Trigger>Open</Drawer.Trigger>
 *   <Drawer.Content>Content</Drawer.Content>
 * </Drawer.Root>
 *
 * // 제어 모드: 외부에서 상태 관리
 * const [open, setOpen] = useState(false);
 * <Drawer.Root open={open} onOpenChange={setOpen}>
 *   <Drawer.Content>Content</Drawer.Content>
 * </Drawer.Root>
 *
 * // 외부에서 Drawer 제어 가능
 * <button onClick={() => setOpen(true)}>Open Drawer</button>
 * ```
 */
export function DrawerRoot({
  open = false,
  onOpenChange,
  snapPoints,
  activeSnapPoint,
  onSnapPointChange,
  closeThreshold = 0.5,
  dismissible = true,
  modal = true,
  // shouldScaleBackground, // TODO: Phase 6에서 구현 예정
  position = 'bottom',
  children,
}: DrawerRootProps) {
  // 제어 모드 여부 판별
  const isControlled = onOpenChange !== undefined;
  const isSnapPointControlled = onSnapPointChange !== undefined;

  // 초기 스냅 포인트 인덱스 (제공되지 않으면 마지막 인덱스 사용)
  const initialSnapPointIndex =
    activeSnapPoint !== undefined
      ? activeSnapPoint
      : snapPoints
        ? snapPoints.length - 1
        : 0;

  return (
    <DrawerProvider
      // 비제어 모드용
      initialOpen={open}
      initialSnapPointIndex={initialSnapPointIndex}
      // 제어 모드용
      controlledOpen={isControlled ? open : undefined}
      onOpenChange={onOpenChange}
      controlledSnapPointIndex={
        isSnapPointControlled ? activeSnapPoint : undefined
      }
      onSnapPointChange={onSnapPointChange}
      // 공통 props
      snapPoints={snapPoints}
      dismissible={dismissible}
      closeThreshold={closeThreshold}
      position={position}
      modal={modal}
    >
      {children}
    </DrawerProvider>
  );
}

/**
 * Phase 4: 제어 모드 구현 완료 ✅
 *
 * 제어/비제어 모드 지원:
 * - 비제어 모드: open/activeSnapPoint만 제공 → 초기 상태만 설정
 * - 제어 모드: onOpenChange/onSnapPointChange 함께 제공 → 외부에서 상태 관리
 *
 * 구현 내용:
 * - useEffect로 외부 상태 변경 감지 및 내부 상태 동기화
 * - 콜백 호출로 부모 컴포넌트에 상태 변경 알림
 * - 제어/비제어 모드 자동 판별
 */

DrawerRoot.displayName = 'Drawer.Root';
