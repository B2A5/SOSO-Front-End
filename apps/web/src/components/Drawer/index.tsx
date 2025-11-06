/**
 * Drawer Component
 *
 * 드래그 가능한 Drawer 컴포넌트입니다.
 * Vaul/Shadcn Drawer를 참고하여 제작되었으며, Framer Motion을 사용합니다.
 *
 * @features
 * - Framer Motion 기반 드래그 제스처
 * - 스냅 포인트 지원
 * - iOS Safari 최적화
 * - 제어/비제어 모드 지원
 * - 합성 컴포넌트 패턴
 * - Context 기반 상태 관리
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *
 *   <Drawer.Overlay className="fixed inset-0 bg-black/40" />
 *   <Drawer.Content>
 *     <Drawer.Items>수정하기</Drawer.Items>
 *     <Drawer.Items destructive onClick={handleDelete}>삭제하기</Drawer.Items>
 *   </Drawer.Content>
 * </Drawer>
 * ```
 */

import { DrawerRoot } from './DrawerRoot';
import { DrawerTrigger } from './DrawerTrigger';
import { DrawerContent } from './DrawerContent';
import { DrawerOverlay } from './DrawerOverlay';
import { DrawerHandle } from './DrawerHandle';
import { DrawerItems } from './DrawerItems';
import { DrawerSnap } from './DrawerSnap';

// 합성 컴포넌트 패턴으로 export
export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Overlay: DrawerOverlay,
  Handle: DrawerHandle,
  Items: DrawerItems,
  Snap: DrawerSnap,
});

// Context와 Hook
export { useDrawerContext } from './DrawerRoot';

// 타입 exports
export type { DrawerRootProps } from './DrawerRoot';
export type { DrawerTriggerProps } from './DrawerTrigger';
export type { DrawerContentProps } from './DrawerContent';
export type { DrawerOverlayProps } from './DrawerOverlay';
export type { DrawerItemsProps } from './DrawerItems';
export type { DrawerSnapProps } from './DrawerSnap';
export type {
  DrawerPosition,
  SnapPoint,
  DrawerContextValue,
} from './DrawerRoot';

// 상수 exports
export {
  CLOSE_THRESHOLD,
  VELOCITY_THRESHOLD,
  DEFAULT_SNAP_POINTS,
  IS_IOS,
  SPRING_CONFIG,
  DRAG_HANDLE,
  Z_INDEX,
} from './constants';

// 유틸 함수 exports
export {
  parseSnapPoint,
  findClosestSnapPoint,
  snapPointToY,
} from './utils';

// Default export
export default Drawer;
