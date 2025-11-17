# NPM 컴포넌트 라이브러리 아키텍처 설계

> **목표**: Drawer를 포함한 UI 컴포넌트를 NPM 패키지로 배포하면서, 기존 프로젝트의 Overlay/Portal 시스템과 유연하게 통합

---

## 📋 목차

1. [현재 상황 분석](#1-현재-상황-분석)
2. [NPM 패키지 아키텍처](#2-npm-패키지-아키텍처)
3. [Primitive 계층 설계](#3-primitive-계층-설계)
4. [Drawer 컴포넌트 개선](#4-drawer-컴포넌트-개선)
5. [프로젝트 통합 전략](#5-프로젝트-통합-전략)
6. [구현 로드맵](#6-구현-로드맵)
7. [예상 효과](#7-예상-효과)

---

## 1. 현재 상황 분석

### 1.1 기존 Overlay/Portal 시스템

#### A. 전역 Overlay 시스템

```
useOverlay (Zustand 기반)
    ↓
overlayStore (전역 상태)
    ↓
OverlayPortal (document.body)
    ↓
스택 기반 다중 오버레이
```

**특징**:

- Promise API 지원 (`await open(...)`)
- z-index 자동 관리 (2000 + index)
- 백드롭, 스크롤 차단, 애니메이션 지원

**사용 컴포넌트**:

- FloatingButton/Menu
- BottomSheetMenu (레거시)
- 향후 Dialog, Alert 등

#### B. Drawer 시스템 (독립적)

```
Drawer.Root (Context Provider)
    ↓
Drawer.Overlay (자체 구현, z-index: 2000)
    ↓
Drawer.Content (z-index: 2001)
```

**특징**:

- 합성 패턴 (Composition Pattern)
- 제어/비제어 모드
- 스냅 포인트, 드래그 지원
- **문제**: 전역 Overlay 시스템과 분리됨

#### C. Popover/Select 시스템

```
PopoverPortal (React Portal)
    ↓
document.body (또는 커스텀 컨테이너)
```

**특징**:

- 로컬 포지셔닝
- 독립적인 Portal
- **문제**: OverlayPortal과 별도

### 1.2 현재 문제점

1. **중복 구현**
   - Drawer의 Overlay ≠ OverlayPortal
   - PopoverPortal ≠ OverlayPortal
   - 각각 독립적인 z-index 관리

2. **NPM 배포 시 문제**
   - Drawer에 Overlay가 내장되어 있음
   - 외부 프로젝트에서 커스텀 Overlay 사용 불가

3. **번들 사이즈**
   - 중복 코드 (Portal, Overlay 로직)
   - 불필요한 의존성 포함

4. **유연성 부족**
   - 프로젝트별 Overlay 시스템 적용 어려움
   - z-index 충돌 가능성

---

## 2. NPM 패키지 아키텍처

### 2.1 패키지 구조

```
@your-org/ui-primitives/
├── package.json
├── tsconfig.json
├── rollup.config.js          # 번들러 설정
├── src/
│   ├── index.ts              # 메인 export
│   │
│   ├── primitives/           # 🔥 핵심 프리미티브
│   │   ├── Portal/
│   │   │   ├── Portal.tsx
│   │   │   ├── PortalContext.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Overlay/
│   │   │   ├── Overlay.tsx
│   │   │   ├── OverlayBackdrop.tsx
│   │   │   ├── OverlayContext.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── OverlayManager/
│   │       ├── OverlayManager.tsx
│   │       ├── OverlayStack.tsx
│   │       ├── useOverlayStack.ts
│   │       └── index.ts
│   │
│   ├── components/           # 🎨 컴포지션 컴포넌트
│   │   ├── Drawer/
│   │   │   ├── DrawerRoot.tsx
│   │   │   ├── DrawerPortal.tsx      # 🆕 신규 추가
│   │   │   ├── DrawerOverlay.tsx     # Overlay Primitive 사용
│   │   │   ├── DrawerContent.tsx
│   │   │   ├── DrawerTrigger.tsx
│   │   │   ├── DrawerItems.tsx
│   │   │   ├── DrawerHandle.tsx
│   │   │   ├── DrawerSnap.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Dialog/                   # 향후 추가
│   │   ├── Popover/                  # 향후 추가
│   │   └── Select/                   # 향후 추가
│   │
│   ├── hooks/                # 🪝 공통 훅
│   │   ├── usePortal.ts
│   │   ├── useOverlay.ts
│   │   ├── useOverlayStack.ts
│   │   ├── useBodyScrollLock.ts
│   │   ├── useFocusTrap.ts
│   │   └── index.ts
│   │
│   └── utils/                # 🛠️ 유틸리티
│       ├── z-index.ts        # z-index 관리
│       ├── animations.ts     # 공통 애니메이션
│       └── index.ts
│
└── examples/                 # 📚 사용 예제
    ├── basic-drawer.tsx
    ├── custom-overlay.tsx
    └── with-overlay-manager.tsx
```

### 2.2 패키지 Export 구조

```typescript
// @your-org/ui-primitives/index.ts

// Primitives
export * from './primitives/Portal';
export * from './primitives/Overlay';
export * from './primitives/OverlayManager';

// Components
export * from './components/Drawer';
export * from './components/Dialog';
export * from './components/Popover';
export * from './components/Select';

// Hooks
export * from './hooks';

// Utils
export * from './utils';
```

### 2.3 Tree-Shaking 지원

```json
{
  "name": "@your-org/ui-primitives",
  "version": "1.0.0",
  "sideEffects": false,
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./primitives": {
      "import": "./dist/esm/primitives/index.js",
      "require": "./dist/cjs/primitives/index.js",
      "types": "./dist/types/primitives/index.d.ts"
    },
    "./drawer": {
      "import": "./dist/esm/components/Drawer/index.js",
      "require": "./dist/cjs/components/Drawer/index.js",
      "types": "./dist/types/components/Drawer/index.d.ts"
    }
  }
}
```

**사용 예시**:

```typescript
// 필요한 것만 import (Tree-shaking)
import { Drawer } from '@your-org/ui-primitives/drawer';
import { Portal } from '@your-org/ui-primitives/primitives';
```

---

## 3. Primitive 계층 설계

### 3.1 Portal Primitive (최하위 계층)

#### 역할

- React Portal 추상화
- SSR 호환
- 커스텀 컨테이너 지원

#### API 설계

```typescript
// Portal.tsx
export interface PortalProps {
  children: ReactNode;
  container?: HTMLElement | null;  // 기본값: document.body
  disabled?: boolean;               // Portal 비활성화
}

export function Portal({
  children,
  container,
  disabled = false
}: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || disabled) {
    return <>{children}</>;
  }

  return createPortal(
    children,
    container || document.body
  );
}
```

#### 사용 예시

```tsx
// 기본 사용
<Portal>
  <div>Portal 콘텐츠</div>
</Portal>

// 커스텀 컨테이너
<Portal container={customContainer}>
  <div>커스텀 Portal</div>
</Portal>

// Portal 비활성화 (테스트용)
<Portal disabled={true}>
  <div>일반 렌더링</div>
</Portal>
```

---

### 3.2 Overlay Primitive (중간 계층)

#### 역할

- Portal 기반 오버레이
- 백드롭 지원
- 애니메이션 훅 제공
- z-index 관리

#### API 설계

```typescript
// OverlayContext.tsx
interface OverlayContextValue {
  isOpen: boolean;
  onClose: () => void;
  overlayId: string;
  zIndex: number;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function useOverlayContext() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within Overlay.Root');
  }
  return context;
}

// Overlay.tsx
export interface OverlayRootProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  overlayId?: string;
  zIndex?: number;
}

export function OverlayRoot({
  children,
  isOpen,
  onClose,
  overlayId = generateId(),
  zIndex = 2000,
}: OverlayRootProps) {
  const contextValue = useMemo(() => ({
    isOpen,
    onClose,
    overlayId,
    zIndex,
  }), [isOpen, onClose, overlayId, zIndex]);

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
    </OverlayContext.Provider>
  );
}

// OverlayPortal.tsx
export interface OverlayPortalProps {
  children: ReactNode;
  container?: HTMLElement | null;
}

export function OverlayPortal({
  children,
  container
}: OverlayPortalProps) {
  return (
    <Portal container={container}>
      {children}
    </Portal>
  );
}

// OverlayBackdrop.tsx
export interface OverlayBackdropProps {
  className?: string;
  onClick?: () => void;
  opacity?: number;  // 0~1
  blur?: boolean;
}

export function OverlayBackdrop({
  className,
  onClick,
  opacity = 0.5,
  blur = true,
}: OverlayBackdropProps) {
  const { isOpen, zIndex } = useOverlayContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          onClick={onClick}
          className={cn(
            'fixed inset-0 bg-black',
            blur && 'backdrop-blur-sm',
            className,
          )}
          style={{ zIndex }}
        />
      )}
    </AnimatePresence>
  );
}

// OverlayContent.tsx
export interface OverlayContentProps {
  children: ReactNode;
  className?: string;
}

export function OverlayContent({
  children,
  className
}: OverlayContentProps) {
  const { isOpen, zIndex } = useOverlayContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={className}
          style={{ zIndex: zIndex + 1 }}
        >
          {children}
        </div>
      )}
    </AnimatePresence>
  );
}
```

#### 합성 패턴 Export

```typescript
// Overlay/index.ts
export const Overlay = {
  Root: OverlayRoot,
  Portal: OverlayPortal,
  Backdrop: OverlayBackdrop,
  Content: OverlayContent,
};

export { useOverlayContext };
```

#### 사용 예시

```tsx
// 기본 사용
<Overlay.Root isOpen={isOpen} onClose={handleClose}>
  <Overlay.Portal>
    <Overlay.Backdrop onClick={handleClose} />
    <Overlay.Content>
      <div>오버레이 콘텐츠</div>
    </Overlay.Content>
  </Overlay.Portal>
</Overlay.Root>

// 커스텀 백드롭
<Overlay.Root isOpen={isOpen} onClose={handleClose}>
  <Overlay.Portal>
    <Overlay.Backdrop opacity={0.8} blur={false} />
    <Overlay.Content>
      <MyDialog />
    </Overlay.Content>
  </Overlay.Portal>
</Overlay.Root>
```

---

### 3.3 OverlayManager (상태 관리 계층)

#### 역할

- 다중 오버레이 스택 관리
- z-index 자동 할당
- Promise API 지원
- 상태 관리 라이브러리 어댑터

#### API 설계

```typescript
// OverlayStack.tsx
export interface OverlayItem {
  id: string;
  element: ReactNode;
  isOpen: boolean;
  zIndex: number;
  options: OverlayOptions;
  resolve?: (value: unknown) => void;
}

export interface OverlayOptions {
  backdrop?: boolean;
  backdropBlur?: boolean;
  closeOnBackdrop?: boolean;
  blockScroll?: boolean;
  container?: HTMLElement;
}

// useOverlayStack.ts (Adapter 패턴)
export interface OverlayStackAdapter {
  items: OverlayItem[];
  push: (item: OverlayItem) => void;
  pop: (id: string) => void;
  update: (id: string, updates: Partial<OverlayItem>) => void;
  clear: () => void;
}

// Zustand 어댑터
export function createZustandAdapter(): OverlayStackAdapter {
  const useStore = create<{
    items: OverlayItem[];
    push: (item: OverlayItem) => void;
    pop: (id: string) => void;
    update: (id: string, updates: Partial<OverlayItem>) => void;
    clear: () => void;
  }>((set) => ({
    items: [],
    push: (item) => set((state) => ({
      items: [...state.items, item]
    })),
    pop: (id) => set((state) => ({
      items: state.items.filter(item => item.id !== id)
    })),
    update: (id, updates) => set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
    clear: () => set({ items: [] }),
  }));

  return useStore;
}

// Context 어댑터 (의존성 없이 사용 가능)
export function createContextAdapter(): OverlayStackAdapter {
  // Context + useReducer 기반 구현
  // ...
}

// OverlayManager.tsx
export interface OverlayManagerProps {
  adapter?: OverlayStackAdapter;  // 기본값: Context 어댑터
  baseZIndex?: number;            // 기본값: 2000
}

export function OverlayManager({
  adapter,
  baseZIndex = 2000,
}: OverlayManagerProps) {
  const stack = adapter || createContextAdapter();
  const items = stack.items;

  return (
    <Portal>
      {items.map((item, index) => (
        <Overlay.Root
          key={item.id}
          isOpen={item.isOpen}
          onClose={() => {
            stack.update(item.id, { isOpen: false });
            setTimeout(() => {
              item.resolve?.(null);
              stack.pop(item.id);
            }, 300);
          }}
          overlayId={item.id}
          zIndex={baseZIndex + index * 2}
        >
          <Overlay.Portal container={item.options.container}>
            {item.options.backdrop && (
              <Overlay.Backdrop
                blur={item.options.backdropBlur}
                onClick={
                  item.options.closeOnBackdrop
                    ? () => stack.update(item.id, { isOpen: false })
                    : undefined
                }
              />
            )}
            <Overlay.Content>{item.element}</Overlay.Content>
          </Overlay.Portal>
        </Overlay.Root>
      ))}
    </Portal>
  );
}

// useOverlay.ts (훅 API)
export function useOverlay(adapter?: OverlayStackAdapter) {
  const stack = adapter || createContextAdapter();

  const open = useCallback(
    <T = unknown>(
      renderer: (props: { close: (value: T) => void }) => ReactNode,
      options: OverlayOptions = {},
    ): Promise<T> => {
      return new Promise((resolve) => {
        const id = generateId();

        const close = (value: T) => {
          stack.update(id, { isOpen: false });
          setTimeout(() => {
            resolve(value);
            stack.pop(id);
          }, 300);
        };

        stack.push({
          id,
          element: renderer({ close }),
          isOpen: true,
          zIndex: 0, // OverlayManager가 자동 할당
          options,
          resolve: resolve as (value: unknown) => void,
        });

        // 애니메이션을 위한 딜레이
        setTimeout(() => {
          stack.update(id, { isOpen: true });
        }, 10);
      });
    },
    [stack],
  );

  const closeAll = useCallback(() => {
    stack.clear();
  }, [stack]);

  return { open, closeAll };
}
```

#### 사용 예시

```tsx
// App.tsx (Zustand 어댑터)
const zustandAdapter = createZustandAdapter();

<OverlayManager adapter={zustandAdapter} />

// 컴포넌트에서 사용
const { open } = useOverlay(zustandAdapter);

const result = await open(
  ({ close }) => (
    <Dialog
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  ),
  { backdrop: true, closeOnBackdrop: true }
);

// Context 어댑터 (의존성 없이)
<OverlayManager />  // 기본값: Context 어댑터

const { open } = useOverlay();
await open(...);
```

---

## 4. Drawer 컴포넌트 개선

### 4.1 현재 Drawer 구조

```tsx
<Drawer.Root>
  <Drawer.Trigger>열기</Drawer.Trigger>
  <Drawer.Overlay /> {/* 자체 구현 */}
  <Drawer.Content>
    <Drawer.Items>항목</Drawer.Items>
  </Drawer.Content>
</Drawer.Root>
```

**문제점**:

- `Drawer.Overlay`가 독립적으로 구현됨
- Portal 없음 (항상 부모 위치에 렌더링)
- OverlayManager와 분리됨

### 4.2 개선된 Drawer 구조

#### A. Drawer.Portal 추가

```typescript
// DrawerPortal.tsx
export interface DrawerPortalProps {
  children: ReactNode;
  container?: HTMLElement | null;
  forceMount?: boolean;  // 항상 마운트 (애니메이션용)
}

export function DrawerPortal({
  children,
  container,
  forceMount = false,
}: DrawerPortalProps) {
  const { isOpen } = useDrawerContext();

  if (!forceMount && !isOpen) {
    return null;
  }

  return <Portal container={container}>{children}</Portal>;
}

DrawerPortal.displayName = 'Drawer.Portal';
```

#### B. Drawer.Overlay를 Overlay Primitive 기반으로 재구현

```typescript
// DrawerOverlay.tsx (개선 버전)
export interface DrawerOverlayProps {
  className?: string;
  asChild?: boolean;  // 커스텀 오버레이 사용
}

export function DrawerOverlay({
  className,
  asChild = false,
}: DrawerOverlayProps) {
  const { isOpen, setIsOpen, closeOnBackground } = useDrawerContext();

  // asChild가 true면 children을 그대로 렌더링 (커스텀 오버레이)
  if (asChild) {
    return <>{children}</>;
  }

  // 기본 Overlay 사용
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOnBackground ? () => setIsOpen(false) : undefined}
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm',
            className,
          )}
          style={{ zIndex: Z_INDEX.OVERLAY }}
        />
      )}
    </AnimatePresence>
  );
}

DrawerOverlay.displayName = 'Drawer.Overlay';
```

#### C. 합성 패턴 Export 업데이트

```typescript
// Drawer/index.ts
export const Drawer = {
  Root: DrawerRoot,
  Portal: DrawerPortal, // 🆕 신규 추가
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Trigger: DrawerTrigger,
  Items: DrawerItems,
  Handle: DrawerHandle,
  Snap: DrawerSnap,
};
```

### 4.3 사용 패턴

#### 패턴 1: 기본 사용 (내장 Portal/Overlay)

```tsx
<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
  <Drawer.Trigger>열기</Drawer.Trigger>

  <Drawer.Portal>
    {' '}
    {/* 🆕 Portal 추가 */}
    <Drawer.Overlay />
    <Drawer.Content>
      <Drawer.Items>항목 1</Drawer.Items>
      <Drawer.Items>항목 2</Drawer.Items>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

#### 패턴 2: Overlay Primitive 사용

```tsx
<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
  <Drawer.Trigger>열기</Drawer.Trigger>

  <Drawer.Portal>
    {/* Overlay Primitive 사용 */}
    <Overlay.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Overlay.Backdrop opacity={0.8} blur={true} />
    </Overlay.Root>

    <Drawer.Content>
      <Drawer.Items>항목 1</Drawer.Items>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

#### 패턴 3: 프로젝트의 OverlayManager 사용

```tsx
// 프로젝트에서 Drawer를 OverlayManager로 열기
const { open } = useOverlay(projectOverlayAdapter);

const result = await open(
  ({ close }) => (
    <Drawer.Root open={true} onOpenChange={close}>
      <Drawer.Content>
        <Drawer.Items onClick={() => close('item1')}>
          항목 1
        </Drawer.Items>
        <Drawer.Items onClick={() => close('item2')}>
          항목 2
        </Drawer.Items>
      </Drawer.Content>
    </Drawer.Root>
  ),
  {
    backdrop: true,
    closeOnBackdrop: true,
  },
);

console.log(result); // 'item1' or 'item2'
```

#### 패턴 4: Portal 없이 사용 (인라인)

```tsx
{
  /* Portal 없이 - 부모 위치에 렌더링 */
}
<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
  <Drawer.Trigger>열기</Drawer.Trigger>

  {/* Portal 없음 */}
  <Drawer.Overlay />
  <Drawer.Content>
    <Drawer.Items>항목 1</Drawer.Items>
  </Drawer.Content>
</Drawer.Root>;
```

---

## 5. 프로젝트 통합 전략

### 5.1 Phase 1: NPM 패키지 생성

#### A. 패키지 초기화

```bash
# 모노레포 구조
pnpm create vite @your-org/ui-primitives --template react-ts

# 의존성
pnpm add react react-dom framer-motion
pnpm add -D @types/react @types/react-dom typescript rollup
```

#### B. Rollup 설정 (Tree-shaking)

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: {
    index: 'src/index.ts',
    primitives: 'src/primitives/index.ts',
    drawer: 'src/components/Drawer/index.ts',
  },
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true, // Tree-shaking 지원
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types',
    }),
    terser(),
  ],
  external: ['react', 'react-dom', 'framer-motion'],
};
```

### 5.2 Phase 2: 기존 프로젝트에서 Primitive 추출

#### A. 마이그레이션 계획

```
1. Portal Primitive 추출
   apps/web/src/components/popover/PopoverPortal.tsx
   → packages/ui-primitives/src/primitives/Portal/Portal.tsx

2. Overlay Primitive 생성
   apps/web/src/components/overlayPortal.tsx (참고)
   → packages/ui-primitives/src/primitives/Overlay/

3. OverlayManager 생성
   apps/web/src/stores/overlayStore.ts (참고)
   apps/web/src/hooks/ui/useOverlay.ts (참고)
   → packages/ui-primitives/src/primitives/OverlayManager/

4. Drawer 이동 및 개선
   apps/web/src/components/Drawer/
   → packages/ui-primitives/src/components/Drawer/
   + DrawerPortal.tsx 추가
   + DrawerOverlay.tsx 개선
```

#### B. 어댑터 생성 (기존 프로젝트 연동)

```typescript
// apps/web/src/adapters/overlayAdapter.ts
import { create } from 'zustand';
import {
  createZustandAdapter,
  type OverlayStackAdapter,
} from '@your-org/ui-primitives';

// 기존 overlayStore와 연동
export const projectOverlayAdapter: OverlayStackAdapter =
  createZustandAdapter();

// 기존 useOverlay 훅을 래핑
export { useOverlay } from '@your-org/ui-primitives';
```

### 5.3 Phase 3: 프로젝트 구조 개선

#### A. 기존 컴포넌트 마이그레이션

```typescript
// FloatingButton.tsx (Before)
import { useOverlay } from '@/hooks/ui/useOverlay';

const { open } = useOverlay();
await open(
  ({ close }) => <FloatingMenu onClose={close} />,
  { backdrop: true }
);

// FloatingButton.tsx (After)
import { useOverlay } from '@your-org/ui-primitives';
import { projectOverlayAdapter } from '@/adapters/overlayAdapter';

const { open } = useOverlay(projectOverlayAdapter);
await open(
  ({ close }) => <FloatingMenu onClose={close} />,
  { backdrop: true }
);
```

#### B. Drawer 마이그레이션

```typescript
// Before
import { Drawer } from '@/components/Drawer';

<Drawer.Root>
  <Drawer.Overlay />
  <Drawer.Content>...</Drawer.Content>
</Drawer.Root>

// After (Option 1: 기본 Portal 사용)
import { Drawer } from '@your-org/ui-primitives/drawer';

<Drawer.Root>
  <Drawer.Portal>              {/* 🆕 */}
    <Drawer.Overlay />
    <Drawer.Content>...</Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>

// After (Option 2: OverlayManager 사용)
import { useOverlay } from '@your-org/ui-primitives';
import { Drawer } from '@your-org/ui-primitives/drawer';
import { projectOverlayAdapter } from '@/adapters/overlayAdapter';

const { open } = useOverlay(projectOverlayAdapter);
await open(
  ({ close }) => (
    <Drawer.Root open={true} onOpenChange={close}>
      <Drawer.Content>...</Drawer.Content>
    </Drawer.Root>
  ),
  { backdrop: true }
);
```

#### C. BottomSheetMenu 제거 (Drawer로 통합)

```typescript
// Before (레거시 BottomSheetMenu)
import { BottomSheetMenu } from '@/components/BottomSheet.Legacy';
import { useOverlay } from '@/hooks/ui/useOverlay';

const { openOverlay } = useOverlay();
openOverlay(
  <BottomSheetMenu isOpen={true} actions={actions} />,
  { backdrop: true }
);

// After (Drawer 사용)
import { Drawer } from '@your-org/ui-primitives/drawer';
import { useOverlay } from '@your-org/ui-primitives';
import { projectOverlayAdapter } from '@/adapters/overlayAdapter';

const { open } = useOverlay(projectOverlayAdapter);
const result = await open(
  ({ close }) => (
    <Drawer.Root open={true} onOpenChange={close}>
      <Drawer.Portal>
        <Drawer.Content>
          {actions.map(action => (
            <Drawer.Items
              key={action.id}
              onClick={() => close(action.id)}
            >
              {action.label}
            </Drawer.Items>
          ))}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  ),
  { backdrop: true, closeOnBackdrop: true }
);
```

### 5.4 Phase 4: 중복 코드 제거

#### A. 제거 대상

```
❌ apps/web/src/components/overlayPortal.tsx
   → @your-org/ui-primitives의 OverlayManager 사용

❌ apps/web/src/stores/overlayStore.ts
   → Adapter로 연결

❌ apps/web/src/hooks/ui/useOverlay.ts
   → @your-org/ui-primitives의 useOverlay 사용

❌ apps/web/src/components/BottomSheet.Legacy.tsx
   → Drawer로 대체

❌ apps/web/src/components/popover/PopoverPortal.tsx
   → @your-org/ui-primitives의 Portal 사용
```

#### B. 번들 사이즈 개선 예상

```
Before:
- overlayPortal.tsx: ~5KB
- overlayStore.ts: ~3KB
- useOverlay.ts: ~2KB
- BottomSheet.Legacy.tsx: ~4KB
- PopoverPortal.tsx: ~1KB
= 총 ~15KB

After:
- @your-org/ui-primitives (Tree-shaking):
  - Portal: ~1KB
  - Overlay: ~2KB
  - OverlayManager: ~2KB
  - Drawer: ~8KB
= 총 ~13KB

절감: ~2KB (13% 감소)
+ 중복 로직 제거로 유지보수성 향상
```

---

## 6. 구현 로드맵

### Phase 1: NPM 패키지 기반 구축 (Week 1-2)

#### Week 1

- [ ] 패키지 초기화 및 Rollup 설정
- [ ] Portal Primitive 구현
- [ ] Overlay Primitive 구현
- [ ] 유닛 테스트 작성

#### Week 2

- [ ] OverlayManager 구현
- [ ] Zustand 어댑터 구현
- [ ] Context 어댑터 구현
- [ ] useOverlay 훅 구현
- [ ] Storybook 예제 작성

### Phase 2: Drawer 개선 및 통합 (Week 3-4)

#### Week 3

- [ ] DrawerPortal 추가
- [ ] DrawerOverlay 개선 (Overlay Primitive 기반)
- [ ] Drawer → NPM 패키지로 이동
- [ ] E2E 테스트 업데이트

#### Week 4

- [ ] 프로젝트에 어댑터 생성
- [ ] Drawer 마이그레이션
- [ ] BottomSheetMenu 제거
- [ ] 테스트 및 버그 수정

### Phase 3: 프로젝트 통합 및 중복 제거 (Week 5-6)

#### Week 5

- [ ] FloatingButton/Menu 마이그레이션
- [ ] Popover/Select 마이그레이션
- [ ] 중복 코드 제거
- [ ] 번들 사이즈 측정

#### Week 6

- [ ] 문서 작성 (README, API 문서)
- [ ] 마이그레이션 가이드 작성
- [ ] 코드 리뷰 및 QA
- [ ] NPM 배포 (v1.0.0)

### Phase 4: 확장 및 안정화 (Week 7-8)

#### Week 7

- [ ] Dialog 컴포넌트 추가
- [ ] Alert 컴포넌트 추가
- [ ] 애니메이션 커스터마이징 지원

#### Week 8

- [ ] 프로젝트 전체 적용
- [ ] 성능 최적화
- [ ] 접근성(A11y) 개선
- [ ] v1.1.0 배포

---

## 7. 예상 효과

### 7.1 번들 사이즈 감소

```
Before: ~15KB (중복 코드 포함)
After:  ~13KB (Tree-shaking 적용)
절감:   ~2KB (13% 감소)
```

### 7.2 코드 재사용성

```
Before:
- Drawer: 독립적 Overlay
- BottomSheetMenu: 독립적 Overlay
- FloatingMenu: OverlayPortal 사용
= 3개의 서로 다른 오버레이 시스템

After:
- 모든 컴포넌트가 Overlay Primitive 사용
- 일관된 API (useOverlay)
- 단일 OverlayManager
```

### 7.3 유지보수성 향상

```
Before:
- 오버레이 관련 버그 수정 시 3곳 수정 필요
- z-index 충돌 가능성
- 일관성 없는 API

After:
- Primitive 수정 시 모든 컴포넌트 자동 개선
- z-index 자동 관리
- 통일된 API
```

### 7.4 확장성

```
Before:
- 새 오버레이 컴포넌트 추가 시 처음부터 구현

After:
- Primitive 재사용으로 빠른 개발
- Dialog, Alert, Sheet 등 쉽게 추가 가능
```

### 7.5 외부 프로젝트 적용

```
NPM 패키지 사용 시:
- 즉시 사용 가능한 Drawer
- 프로젝트 Overlay 시스템 연동 가능
- 커스터마이징 유연성
```

---

## 8. 리스크 및 대응 방안

### 8.1 리스크

1. **기존 코드 호환성**
   - 현재 프로젝트의 코드가 깨질 수 있음

   **대응**:
   - Phase별 점진적 마이그레이션
   - 어댑터 패턴으로 기존 API 유지
   - 충분한 테스트

2. **번들 사이즈 증가 가능성**
   - NPM 패키지 의존성 추가

   **대응**:
   - Tree-shaking 완벽 지원
   - Peer Dependencies 활용
   - 번들 분석 (rollup-plugin-visualizer)

3. **학습 곡선**
   - 팀원들이 새 API 학습 필요

   **대응**:
   - 상세한 문서 작성
   - 마이그레이션 가이드 제공
   - Storybook 예제

4. **성능 영향**
   - Primitive 계층 추가로 성능 저하 우려

   **대응**:
   - useMemo, useCallback 최적화
   - 프로파일링 및 성능 측정
   - E2E 테스트

### 8.2 롤백 계획

각 Phase마다 Git 태그 생성:

```
phase-1-primitives
phase-2-drawer
phase-3-integration
phase-4-extension
```

문제 발생 시 이전 Phase로 롤백 가능

---

## 9. 체크리스트

### NPM 패키지

- [ ] Rollup 설정 (Tree-shaking)
- [ ] TypeScript 타입 정의
- [ ] Portal Primitive
- [ ] Overlay Primitive
- [ ] OverlayManager
- [ ] Drawer (개선 버전)
- [ ] Storybook 문서
- [ ] 유닛 테스트 (90% 이상)
- [ ] package.json (exports, sideEffects)
- [ ] README.md
- [ ] CHANGELOG.md

### 프로젝트 통합

- [ ] Adapter 생성
- [ ] Drawer 마이그레이션
- [ ] FloatingButton/Menu 마이그레이션
- [ ] BottomSheetMenu 제거
- [ ] Popover/Select 마이그레이션
- [ ] overlayPortal.tsx 제거
- [ ] overlayStore.ts 어댑터 연결
- [ ] useOverlay 래핑
- [ ] E2E 테스트 업데이트
- [ ] 번들 사이즈 측정

### 문서

- [ ] API 문서
- [ ] 마이그레이션 가이드
- [ ] 사용 예제 (10개 이상)
- [ ] 트러블슈팅 가이드

---

## 10. 참고 자료

### 유사 라이브러리

- **Radix UI**: Headless UI primitives
- **Chakra UI**: Overlay Manager 패턴
- **Mantine**: Overlay 시스템
- **React Aria**: Adobe의 접근성 우선 UI

### 아키텍처 패턴

- **Compound Components** (합성 패턴)
- **Render Props**
- **Adapter Pattern**
- **Provider Pattern**

---

## 결론

이 계획은 다음을 달성합니다:

1. ✅ **NPM 배포 가능한 컴포넌트 라이브러리**
2. ✅ **재사용 가능한 Overlay/Portal Primitive**
3. ✅ **프로젝트와 유연한 통합**
4. ✅ **중복 코드 제거 및 번들 최적화**
5. ✅ **확장 가능한 아키텍처**

**다음 단계**: Phase 1 시작 - NPM 패키지 기반 구축
