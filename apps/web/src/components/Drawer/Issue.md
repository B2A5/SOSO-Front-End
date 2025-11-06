# Drawer 트러블슈팅 가이드

> 개발 중 발생한 이슈와 해결 방법을 기록한 문서입니다.

---

## 📑 목차

- [해결된 이슈 (Resolved)](#-해결된-이슈-resolved)
- [미해결 이슈 (Open)](#-미해결-이슈-open)
- [개선 제안 (Enhancement)](#-개선-제안-enhancement)

---

## 🟢 해결된 이슈 (Resolved)

### Issue #1: left/right position에서 드래그가 작동하지 않음 ✅

**파일**: `DrawerContent.tsx:405`
**발견 날짜**: 2025-01-05
**해결 날짜**: 2025-01-06

#### 문제

Left/Right position에서 Drawer를 드래그하려고 하면 아무 반응이 없었습니다.

**원인**:

```typescript
// DrawerContent.tsx (Before)
style={{
  y: position === 'bottom' || position === 'top' ? y : undefined,
  x: position === 'left' || position === 'right' ? y : undefined, // ⚠️ 버그: x에 y 할당
}}
```

X축 motion value를 생성하지 않고, style에서도 `x`에 `y` 값을 잘못 할당했습니다.

#### 해결 방법

**1단계: X축 motion value 추가**

```typescript
// useDragHandlers.ts
export function useDragHandlers({ position, ... }) {
  const y = useMotionValue(0);
  const x = useMotionValue(0); // ✅ X축 motion value 추가

  return { y, x, ... };
}
```

**2단계: Style 수정**

```typescript
// DrawerContent.tsx (After)
const { y, x, ... } = useDragHandlers({ ... });

<motion.div
  style={{
    y: position === 'bottom' || position === 'top' ? y : undefined,
    x: position === 'left' || position === 'right' ? x : undefined, // ✅ 수정
  }}
/>
```

**3단계: 드래그 핸들러 수정**

```typescript
// useDragHandlers.ts
const handleDrag = (_event: any, info: PanInfo) => {
  if (position === 'left' || position === 'right') {
    const currentX = x.get();
    // X축 드래그 처리
    if (position === 'left' && currentX < 0) {
      x.set(0);
    } else if (position === 'right' && currentX > 0) {
      x.set(0);
    }
  } else {
    // Y축 드래그 처리 (기존 로직)
    const currentY = y.get();
    // ...
  }
};
```

#### 결과

- ✅ Left/Right position에서 드래그 정상 작동
- ✅ Playwright 테스트 통과 (`positions.spec.ts`)

#### 관련 파일

- `useDragHandlers.ts` (수정)
- `DrawerContent.tsx` (수정)
- `__tests__/e2e/positions.spec.ts` (검증)

---

### Issue #2: Body 스크롤 잠금 미구현 ✅

**파일**: `DrawerContent.tsx`
**발견 날짜**: 2025-01-04
**해결 날짜**: 2025-01-06

#### 문제

Drawer가 열려있을 때 배경 콘텐츠를 스크롤할 수 있어서 UX가 좋지 않았습니다.

**기대 동작**: Drawer가 열리면 배경 스크롤이 잠겨야 함
**실제 동작**: 배경을 스크롤할 수 있음

#### 해결 방법

**`useBodyScrollLock` 커스텀 훅 구현**:

```typescript
// hooks/useBodyScrollLock.ts
export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // 1. 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // 2. Body 스크롤 잠금
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    // 3. 스크롤바 너비만큼 padding 추가 (레이아웃 시프트 방지)
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      // 4. 원상복구
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';

      // 5. 스크롤 위치 복원
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}
```

**사용**:

```typescript
// DrawerContent.tsx
useBodyScrollLock(isOpen);
```

#### 트러블슈팅 히스토리

**시도 1**: `overflow: hidden` 사용

```typescript
document.body.style.overflow = 'hidden';
```

- ❌ **문제**: iOS Safari에서 작동하지 않음
- ❌ **문제**: 스크롤 위치가 맨 위로 튀어올라감

**시도 2**: `position: fixed` (최종 해결)

```typescript
document.body.style.position = 'fixed';
document.body.style.top = `-${scrollY}px`;
```

- ✅ **장점**: iOS Safari 완벽 지원
- ✅ **장점**: 스크롤 위치 유지 가능
- ⚠️ **추가 작업 필요**: 스크롤바 너비 보정

**시도 3**: 스크롤바 너비 보정 추가

```typescript
const scrollbarWidth =
  window.innerWidth - document.documentElement.clientWidth;
document.body.style.paddingRight = `${scrollbarWidth}px`;
```

- ✅ **장점**: 레이아웃 시프트 방지
- ✅ **장점**: 스크롤바가 사라져도 콘텐츠 위치 유지

#### 결과

- ✅ 모든 브라우저에서 body 스크롤 잠금 작동
- ✅ iOS Safari 지원
- ✅ 레이아웃 시프트 없음
- ✅ 스크롤 위치 정확히 복원
- ✅ Playwright 테스트 통과 (`body-scroll-lock.spec.ts`)

#### 관련 파일

- `hooks/useBodyScrollLock.ts` (신규)
- `DrawerContent.tsx` (수정)
- `__tests__/e2e/body-scroll-lock.spec.ts` (검증)

---

### Issue #3: Date 객체 생성으로 인한 성능 저하 ✅

**파일**: `DrawerContent.tsx:89-100`
**발견 날짜**: 2025-01-05
**해결 날짜**: 2025-01-06

#### 문제

드래그 이벤트마다 Date 객체를 생성하여 불필요한 오버헤드가 발생했습니다.

**Before**:

```typescript
// 매 드래그마다 Date 객체 2개 생성
const lastTimeDragPrevented = useRef<Date | null>(null);

lastTimeDragPrevented.current = new Date();

const now = new Date();
const timeSinceLastPrevent =
  now.getTime() - lastTimeDragPrevented.current.getTime();
```

**문제점**:

- 드래그 이벤트는 초당 수십 번 발생 → 수십 개의 Date 객체 생성
- 가비지 컬렉션 부담 증가
- 불필요한 성능 비용

#### 해결 방법

**`Date.now()` 사용**:

```typescript
// After: 원시 값(number) 사용
const lastTimeDragPrevented = useRef<number | null>(null);

lastTimeDragPrevented.current = Date.now();

if (lastTimeDragPrevented.current) {
  const timeSinceLastPrevent =
    Date.now() - lastTimeDragPrevented.current;
  if (timeSinceLastPrevent < SCROLL_LOCK_TIMEOUT) {
    return false;
  }
}
```

#### 개선 효과

- ✅ Date 객체 생성 제거 → 메모리 효율 향상
- ✅ 가비지 컬렉션 부담 감소
- ✅ 드래그 성능 향상
- ✅ 코드 간결화

#### 관련 파일

- `useDragHandlers.ts` (수정)

---

### Issue #4: useEffect 의존성 배열 불완전 ✅

**파일**: `DrawerContent.tsx:209-228`
**발견 날짜**: 2025-01-05
**해결 날짜**: 2025-01-06

#### 문제

스냅 포인트 애니메이션 useEffect에서 `snapPoints`와 `activeSnapPointIndex`를 사용하지만 의존성 배열에 포함하지 않아 `eslint-disable` 주석이 필요했습니다.

**Before**:

```typescript
useEffect(() => {
  if (isOpen && snapPoints && snapPoints.length > 1) {
    const targetIndex = activeSnapPointIndex ?? snapPoints.length - 1;
    // ... 애니메이션 로직
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isOpen]); // ⚠️ snapPoints, activeSnapPointIndex 누락
```

**문제점**:

- `snapPoints`나 `activeSnapPointIndex`가 변경되어도 useEffect가 실행되지 않음
- `eslint-disable` 주석으로 경고를 무시하는 안티패턴

#### 해결 방법

**`useRef`로 최신 값 추적**:

```typescript
// hooks/useSnapPointAnimation.ts
export function useSnapPointAnimation({
  isOpen,
  snapPoints,
  activeSnapPointIndex,
  y,
  contentRef,
}) {
  // 1. ref로 최신 값 추적
  const snapPointsRef = useRef(snapPoints);
  const activeSnapIndexRef = useRef(activeSnapPointIndex);

  // 2. 값 변경 시 ref 업데이트
  useEffect(() => {
    snapPointsRef.current = snapPoints;
    activeSnapIndexRef.current = activeSnapPointIndex;
  }, [snapPoints, activeSnapPointIndex]);

  // 3. isOpen만 의존성에 포함 (초기 열림만 감지)
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const currentSnapPoints = snapPointsRef.current;
    const currentIndex =
      activeSnapIndexRef.current ?? currentSnapPoints.length - 1;

    // 애니메이션 로직
    const targetHeight =
      contentRef.current.offsetHeight *
      (1 - currentSnapPoints[currentIndex]);
    animate(y, -targetHeight, SPRING_CONFIG);
  }, [isOpen]); // ✅ eslint-disable 제거
}
```

#### 개선 효과

- ✅ eslint-disable 주석 제거
- ✅ React Hooks 규칙 준수
- ✅ 코드 의도가 명확해짐 (isOpen 시에만 애니메이션)

#### 관련 파일

- `hooks/useSnapPointAnimation.ts` (신규)
- `DrawerContent.tsx` (리팩토링)

---

### Issue #6: SCROLL_LOCK_TIMEOUT 하드코딩 ✅

**파일**: `DrawerContent.tsx:71`
**발견 날짜**: 2025-01-05
**해결 날짜**: 2025-01-06

#### 문제

스크롤 잠금 타임아웃이 하드코딩되어 있어 사용자가 커스터마이징할 수 없었습니다.

**Before**:

```typescript
const SCROLL_LOCK_TIMEOUT = 500; // 하드코딩
```

#### 해결 방법

**Props로 전달 가능하도록 수정**:

```typescript
// DrawerRoot.tsx
export interface DrawerRootProps {
  // ...
  scrollLockTimeout?: number; // 기본값: 500ms
}

<DrawerProvider
  scrollLockTimeout={scrollLockTimeout ?? 500}
  // ...
/>
```

```typescript
// useDragHandlers.ts
export function useDragHandlers({
  scrollLockTimeout = 500, // Context에서 전달받음
  // ...
}) {
  // 사용자 지정 타임아웃 사용
  if (timeSinceLastPrevent < scrollLockTimeout) {
    return false;
  }
}
```

#### 개선 효과

- ✅ 사용자가 타임아웃 커스터마이징 가능
- ✅ 기본값 유지 (500ms)
- ✅ 유연성 향상

#### 관련 파일

- `DrawerRoot.tsx` (수정)
- `DrawerContext.tsx` (수정)
- `useDragHandlers.ts` (수정)

---

### Issue #12: DrawerRoot와 Provider 분리로 인한 불필요한 추상화 ✅

**파일**: `DrawerRoot.tsx`, `DrawerContext.tsx`
**발견 날짜**: 2025-01-06
**해결 날짜**: 2025-01-06

#### 문제

DrawerRoot가 단순히 props를 DrawerProvider에 전달하기만 하는 얇은 wrapper였습니다.

**Before**:

```typescript
// DrawerRoot.tsx (97줄) - Props 전달만
export function DrawerRoot(props: DrawerRootProps) {
  return <DrawerProvider {...props} />;
}

// DrawerContext.tsx (235줄) - 실제 로직
export function DrawerProvider({ children, open, defaultOpen, ... }) {
  // 모든 상태 관리 로직
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  // Context 생성 및 제공
  return <DrawerContext.Provider value={...}>{children}</DrawerContext.Provider>;
}
```

**문제점**:

- DrawerRoot는 props를 전달하기만 함 (불필요한 추상화)
- Props 정의가 2개 파일에 중복
- 파일 간 이동 없이 전체 로직 파악 불가능
- 다른 라이브러리 패턴과 불일치 (Radix UI, Headless UI는 Root가 Provider 역할)

#### 해결 방법

**DrawerProvider 로직을 DrawerRoot로 통합**:

```typescript
// DrawerRoot.tsx (248줄) - Context + 로직 통합
const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerRoot({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  // ... 모든 props
}: DrawerRootProps) {
  // 제어 모드 감지
  const isControlled = open !== undefined;

  // 내부 상태 (비제어 모드)
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // 외부 상태 동기화 (제어 모드)
  useEffect(() => {
    if (isControlled && open !== undefined) {
      setInternalOpen(open);
    }
  }, [isControlled, open]);

  // 실제 사용할 상태 값
  const isOpen = isControlled ? open : internalOpen;

  // Context value
  const contextValue = useMemo<DrawerContextValue>(() => ({
    isOpen,
    setIsOpen: handleSetIsOpen,
    // ... 모든 context 값
  }), [dependencies]);

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

// Hook도 같은 파일에 export
export function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawerContext must be used within Drawer.Root');
  }
  return context;
}
```

**추가 작업**:

1. 모든 하위 컴포넌트의 import 경로 수정 (8개 파일)

   ```typescript
   // Before
   import { useDrawerContext } from './DrawerContext';

   // After
   import { useDrawerContext } from './DrawerRoot';
   ```

2. `DrawerContext.tsx` 파일 삭제

#### 트러블슈팅 히스토리

**고려사항 1**: 관심사 분리 감소?

- ✅ DrawerRoot가 원래 아무것도 하지 않았기 때문에 의미 있는 분리가 아니었음
- ✅ 실제로는 오히려 명확성이 증가 (Props → State → Context 흐름이 한 곳에)

**고려사항 2**: 파일 크기 증가?

- ✅ 97줄 + 235줄 = 332줄 → 248줄 (84줄 감소)
- ✅ 중복된 Props 정의 제거로 오히려 감소

**고려사항 3**: 타입 복잡도 증가?

- ✅ DrawerRootProps와 DrawerProviderProps 중복 제거
- ✅ 타입 정의가 단순화됨

#### 개선 효과

- ✅ 파일 개수 감소: 2개 → 1개 (DrawerContext.tsx 삭제)
- ✅ 전체 코드 라인 감소: 332줄 → 248줄 (25% 감소)
- ✅ Props 중복 제거 (단일 정의)
- ✅ 가독성 향상: Props → State → Context 흐름이 한 파일에서 완결
- ✅ 파일 네비게이션 감소: 로직 파악 시 2개 파일 → 1개 파일
- ✅ 다른 라이브러리 패턴과 일치 (Radix UI, Headless UI)
- ✅ Context 생성 위치가 명확해짐

#### 결과

- ✅ 모든 컴포넌트 정상 작동
- ✅ 타입 체크 통과 (TypeScript 에러 없음)
- ✅ Import 경로 일괄 변경 완료 (8개 파일)
- ✅ 기존 기능 100% 유지

#### 관련 파일

- `DrawerRoot.tsx` (통합 - 248줄)
- `DrawerContext.tsx` (삭제 - 235줄)
- `drawerAnimationUtils.ts` (import 경로 수정)
- `DrawerContent.tsx` (import 경로 수정)
- `DrawerTrigger.tsx` (import 경로 수정)
- `DrawerOverlay.tsx` (import 경로 수정)
- `DrawerItems.tsx` (import 경로 수정)
- `DrawerSnap.tsx` (import 경로 수정)
- `utils.ts` (import 경로 수정)
- `index.tsx` (export 경로 수정)

---

## 🔴 미해결 이슈 (Open)

### Issue #5: Portal 지원 없음

**우선순위**: P1 (High)
**영향**: z-index 충돌 가능성

#### 문제

현재 Drawer가 DOM 트리의 현재 위치에 렌더링되어 부모 요소의 `z-index`나 `overflow` 영향을 받을 수 있습니다.

#### 제안 해결 방법

**DrawerPortal 컴포넌트 추가**:

```typescript
// DrawerPortal.tsx
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDrawerContext } from './DrawerContext';

export interface DrawerPortalProps {
  children: ReactNode;
  container?: HTMLElement;
}

export function DrawerPortal({
  children,
  container = typeof document !== 'undefined' ? document.body : null,
}: DrawerPortalProps) {
  const { isOpen } = useDrawerContext();

  if (!isOpen || !container) return null;

  return createPortal(children, container);
}
```

**사용 예시**:

```tsx
<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content>...</Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

**예상 작업 시간**: 40분

---

### Issue #7: DrawerOverlay 불필요한 이벤트 핸들러

**우선순위**: P2 (Medium)
**영향**: 불필요한 코드

#### 문제

DrawerOverlay에 `handleMouseDown` 핸들러가 있지만 실제로 필요한지 검증되지 않았습니다.

**파일**: `DrawerOverlay.tsx:48`

```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
};
```

#### 제안

- 실제 필요성 검증 후 제거 또는 주석 보강

**예상 작업 시간**: 5분

---

### Issue #8: DrawerContext 불필요한 동기화 로직

**우선순위**: P2 (Medium)
**영향**: 불필요한 리렌더링 가능성

#### 문제

제어 모드에서 `internalOpen` 상태를 동기화하지만 실제로 사용되지 않습니다.

**파일**: `DrawerContext.tsx:127-142`

```typescript
useEffect(() => {
  if (isControlled && controlledOpen !== undefined) {
    setInternalOpen(controlledOpen); // 사용되지 않음
  }
}, [isControlled, controlledOpen]);
```

#### 제안

- 제어 모드에서는 `internalOpen`을 사용하지 않으므로 해당 로직 제거

**예상 작업 시간**: 5분

---

### Issue #10: DrawerItems 접근성 개선

**우선순위**: P2 (Medium)
**영향**: 스크린 리더 지원 부족

#### 문제

DrawerItems에 `role`과 `aria-label` 속성이 없어 스크린 리더 사용자에게 불편합니다.

**파일**: `DrawerItems.tsx:64`

**Before**:

```typescript
<button
  type="button"
  onClick={handleClick}
  disabled={disabled}
  // role, aria-label 없음
>
```

**제안**:

```typescript
<button
  type="button"
  role="menuitem"
  aria-disabled={disabled}
  aria-label={typeof children === 'string' ? children : undefined}
  onClick={handleClick}
  disabled={disabled}
>
```

**예상 작업 시간**: 10분

---

### Issue #11: iOS VH 변수 미사용

**우선순위**: P3 (Low)
**영향**: 불필요한 코드

#### 문제

`--vh` CSS 변수를 설정하지만 CSS에서 사용하지 않습니다.

**파일**: `useIOSOptimization.ts:8-15`

```typescript
const updateVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`); // 사용처 없음
};
```

#### 제안

- CSS에서 `--vh` 변수를 사용하거나
- 사용하지 않으면 해당 로직 제거

**예상 작업 시간**: 10분

---

## 💡 개선 제안 (Enhancement)

### Feature #1: 에러 바운더리

**우선순위**: P2
**목적**: Drawer 내부 에러가 전체 앱을 크래시시키지 않도록

#### 제안

```typescript
// DrawerErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class DrawerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Drawer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
```

**사용**:

```tsx
<DrawerErrorBoundary fallback={<div>Drawer 오류 발생</div>}>
  <Drawer.Root>{/* ... */}</Drawer.Root>
</DrawerErrorBoundary>
```

**예상 작업 시간**: 30분

---

### Feature #2: React.memo 최적화

**우선순위**: P2
**목적**: 불필요한 리렌더링 방지

#### 제안

```typescript
// 각 컴포넌트에 React.memo 적용
export const DrawerContent = React.memo(DrawerContentComponent);
export const DrawerOverlay = React.memo(DrawerOverlayComponent);
export const DrawerItems = React.memo(DrawerItemsComponent);
export const DrawerSnap = React.memo(DrawerSnapComponent);
```

**예상 작업 시간**: 20분

---

### Feature #3: MotionConfig 지원

**우선순위**: P3
**목적**: 사용자 접근성 설정 존중 (prefers-reduced-motion)

#### 제안

```typescript
import { MotionConfig } from 'motion/react';

<MotionConfig reducedMotion="user">
  <Drawer.Root>
    {/* ... */}
  </Drawer.Root>
</MotionConfig>
```

**효과**:

- `prefers-reduced-motion` 설정 시 애니메이션 자동 감소
- 접근성 향상

**예상 작업 시간**: 10분

---

## 📊 요약

### 해결된 이슈

| 이슈                   | 우선순위 | 해결 날짜  | 작업 시간 |
| ---------------------- | -------- | ---------- | --------- |
| #1 left/right 드래그   | P0       | 2025-01-06 | 30분      |
| #2 Body 스크롤 잠금    | P0       | 2025-01-06 | 20분      |
| #3 Date 객체 비효율    | P1       | 2025-01-06 | 10분      |
| #4 useEffect 의존성    | P1       | 2025-01-06 | 20분      |
| #6 scrollLockTimeout   | P1       | 2025-01-06 | 15분      |
| #12 Root+Provider 통합 | P1       | 2025-01-06 | 25분      |
| **총계**               | -        | -          | **2시간** |

### 미해결 이슈

| 이슈                      | 우선순위 | 예상 시간      | 상태 |
| ------------------------- | -------- | -------------- | ---- |
| #5 Portal 지원            | P1       | 40분           | Open |
| #7 불필요한 이벤트 핸들러 | P2       | 5분            | Open |
| #8 불필요한 동기화        | P2       | 5분            | Open |
| #10 접근성 개선           | P2       | 10분           | Open |
| #11 iOS VH 미사용         | P3       | 10분           | Open |
| **총계**                  | -        | **1시간 10분** | -    |

### 개선 제안

| 기능          | 우선순위 | 예상 시간 |
| ------------- | -------- | --------- |
| ErrorBoundary | P2       | 30분      |
| React.memo    | P2       | 20분      |
| MotionConfig  | P3       | 10분      |
| **총계**      | -        | **1시간** |

---

## 🎯 권장 수정 순서

1. **Phase 1 - High Priority** (이번 주):
   - Issue #5: Portal 구현

2. **Phase 2 - Medium Priority** (다음 주):
   - Issue #7, #8, #10: 코드 정리 및 접근성 개선

3. **Phase 3 - Low Priority** (시간 날 때):
   - Issue #11: 미사용 코드 정리

4. **Phase 4 - Features** (여유 있을 때):
   - ErrorBoundary, React.memo, MotionConfig

---

**Last Updated**: 2025-01-06
**Version**: 2.0 (Troubleshooting Focused)
**Maintainer**: @hwigeon
