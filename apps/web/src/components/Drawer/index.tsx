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
