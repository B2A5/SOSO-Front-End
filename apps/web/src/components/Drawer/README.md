# Drawer Component

> 접근성과 커스터마이징을 모두 갖춘 React Drawer (Bottom Sheet) 컴포넌트

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-61dafb)](https://react.dev/)
[![Motion](https://img.shields.io/badge/Motion-11.0-ff69b4)](https://motion.dev/)

---

## 📑 목차

- [빠른 시작](#-빠른-시작)
- [핵심 기능](#-핵심-기능)
- [API 레퍼런스](#-api-레퍼런스)
- [아키텍처](#-아키텍처)
- [테스트](#-테스트)
- [NPM 배포](#-npm-배포)

---

## 🚀 빠른 시작

### 기본 사용법

```tsx
import { Drawer } from '@/components/Drawer';

function App() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <button>Open Drawer</button>
      </Drawer.Trigger>

      <Drawer.Overlay />

      <Drawer.Content>
        <h1>Hello Drawer!</h1>
        <p>Drag me down to close</p>
      </Drawer.Content>
    </Drawer.Root>
  );
}
```

### 스냅 포인트 사용

```tsx
<Drawer.Root snapPoints={[0.3, 0.6, 1]} activeSnapPoint={1}>
  <Drawer.Trigger>Open with Snap Points</Drawer.Trigger>
  <Drawer.Overlay />
  <Drawer.Content>
    {/* 3개 높이로 스냅됩니다: 30%, 60%, 100% */}
  </Drawer.Content>
</Drawer.Root>
```

### 제어 모드

```tsx
function ControlledDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Overlay />
        <Drawer.Content>
          <button onClick={() => setOpen(false)}>Close</button>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
```

---

## 🎯 핵심 기능

### 1. 합성 컴포넌트 패턴

```tsx
<Drawer.Root>      {/* Context Provider */}
  <Drawer.Trigger> {/* 열기 버튼 */}
  <Drawer.Overlay> {/* 배경 오버레이 */}
  <Drawer.Content> {/* 드래그 가능한 콘텐츠 */}
  <Drawer.Handle>  {/* 드래그 핸들 */}
  <Drawer.Items>   {/* 액션 아이템 */}
  <Drawer.Snap>    {/* 스냅 포인트별 콘텐츠 */}
</Drawer.Root>
```

### 2. 드래그 제스처

- **방향 기반 드래그**: bottom/top (y축), left/right (x축)
- **스마트 닫기**: 거리(100px) 또는 속도(500px/s) 기반
- **탄성 애니메이션**: Spring 물리 기반 자연스러운 움직임
- **스크롤 충돌 방지**: 스크롤 가능 영역에서 드래그 차단

### 3. 스냅 포인트

```tsx
// 비제어 모드 (컴포넌트 내부 관리)
<Drawer.Root snapPoints={[0.3, 0.6, 1]}>

// 제어 모드 (외부에서 제어)
<Drawer.Root
  snapPoints={[0.3, 0.6, 1]}
  activeSnapPoint={snapIndex}
  onSnapPointChange={setSnapIndex}
>
```

### 4. Position 옵션

```tsx
<Drawer.Root position="bottom"> {/* 기본값 */}
<Drawer.Root position="top">
<Drawer.Root position="left">
<Drawer.Root position="right">
```

### 5. 접근성

- ✅ **Escape 키**: Drawer 닫기
- ✅ **포커스 트랩**: 모달 모드에서 포커스 제한
- ✅ **ARIA 속성**: `role="dialog"`, `aria-modal`, `aria-labelledby`
- ✅ **키보드 탐색**: Tab/Shift+Tab으로 이동

### 6. Body 스크롤 잠금

- Drawer 열림 시 배경 스크롤 자동 차단
- 스크롤바 너비만큼 padding 추가 (레이아웃 시프트 방지)
- 닫힘 시 원래 스크롤 위치로 복원

---

## 📚 API 레퍼런스

### Drawer.Root

최상위 컨테이너이자 Context Provider입니다.

```tsx
interface DrawerRootProps {
  // 상태 관리
  open?: boolean; // 제어 모드: 열림/닫힘 상태
  defaultOpen?: boolean; // 비제어 모드: 초기 상태 (기본값: false)
  onOpenChange?: (open: boolean) => void; // 상태 변경 콜백

  // 스냅 포인트
  snapPoints?: number[]; // 스냅 포인트 배열 (0~1, 예: [0.3, 0.6, 1])
  activeSnapPoint?: number; // 제어 모드: 현재 활성 스냅 인덱스
  onSnapPointChange?: (index: number) => void; // 스냅 포인트 변경 콜백

  // 동작 설정
  position?: 'bottom' | 'top' | 'left' | 'right'; // 위치 (기본값: 'bottom')
  dismissible?: boolean; // 드래그로 닫기 가능 여부 (기본값: true)
  modal?: boolean; // 모달 모드 (기본값: true)
  closeThreshold?: number; // 닫기 임계값 0~1 (기본값: 0.5)
  scrollLockTimeout?: number; // 스크롤 잠금 타임아웃 ms (기본값: 500)

  children: ReactNode;
}
```

**예시:**

```tsx
<Drawer.Root
  open={isOpen}
  onOpenChange={setIsOpen}
  snapPoints={[0.3, 0.6, 1]}
  position="bottom"
  dismissible={true}
  modal={true}
>
  {children}
</Drawer.Root>
```

### Drawer.Trigger

Drawer를 여는 트리거 버튼입니다.

```tsx
interface DrawerTriggerProps {
  asChild?: boolean; // true면 children에 onClick 주입
  className?: string;
  children: ReactNode;
}
```

**예시:**

```tsx
{
  /* 기본: button으로 렌더링 */
}
<Drawer.Trigger>Open</Drawer.Trigger>;

{
  /* asChild: 기존 요소에 기능 주입 */
}
<Drawer.Trigger asChild>
  <CustomButton>Open</CustomButton>
</Drawer.Trigger>;
```

### Drawer.Overlay

배경 오버레이입니다. Drawer.Content보다 먼저 렌더링되어야 합니다.

```tsx
interface DrawerOverlayProps {
  className?: string;
  children?: ReactNode; // Overlay 내부 커스텀 콘텐츠
}
```

**예시:**

```tsx
<Drawer.Overlay className="bg-black/60" />
```

### Drawer.Content

드래그 가능한 메인 콘텐츠입니다.

```tsx
interface DrawerContentProps {
  className?: string;
  showHandle?: boolean; // 드래그 핸들 표시 (기본값: true)
  preventScrollRestoration?: boolean; // 스크롤 복원 방지
  children: ReactNode;
}
```

**예시:**

```tsx
<Drawer.Content showHandle={true} className="max-h-[90vh]">
  <h1>Title</h1>
  <div className="overflow-y-auto">{/* 스크롤 가능한 콘텐츠 */}</div>
</Drawer.Content>
```

### Drawer.Handle

드래그 핸들입니다. (Drawer.Content가 `showHandle={true}`면 자동 포함)

```tsx
interface DrawerHandleProps {
  className?: string;
}
```

**예시:**

```tsx
<Drawer.Handle className="bg-gray-300" />
```

### Drawer.Items

액션 아이템 버튼입니다.

```tsx
interface DrawerItemsProps {
  onClick?: () => void;
  destructive?: boolean; // 위험한 작업 스타일 (빨간색)
  closeOnClick?: boolean; // 클릭 시 Drawer 닫기 (기본값: true)
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}
```

**예시:**

```tsx
<Drawer.Items onClick={handleSave}>
  저장
</Drawer.Items>

<Drawer.Items destructive onClick={handleDelete}>
  삭제
</Drawer.Items>
```

### Drawer.Snap

스냅 포인트별로 다른 콘텐츠를 렌더링합니다.

```tsx
interface DrawerSnapProps {
  snapIndex: number; // 이 콘텐츠를 표시할 스냅 인덱스
  keepMounted?: boolean; // 비활성 시에도 DOM 유지 (기본값: false)
  animation?: 'fade' | 'none'; // 전환 애니메이션 (기본값: 'fade')
  className?: string;
  children: ReactNode;
}
```

**예시:**

```tsx
<Drawer.Root snapPoints={[0.3, 0.6, 1]}>
  <Drawer.Content>
    <Drawer.Snap snapIndex={0}>
      <p>30% 높이 콘텐츠</p>
    </Drawer.Snap>

    <Drawer.Snap snapIndex={1}>
      <p>60% 높이 콘텐츠</p>
    </Drawer.Snap>

    <Drawer.Snap snapIndex={2}>
      <p>100% 높이 콘텐츠</p>
    </Drawer.Snap>
  </Drawer.Content>
</Drawer.Root>
```

---

## 🏗️ 아키텍처

### 설계 원칙

1. **합성 컴포넌트 패턴**: Radix UI와 동일한 패턴으로 유연성 제공
2. **제어/비제어 모드 지원**: React 표준 패턴 준수
3. **독립적 구조**: 외부 전역 상태 없이 완전히 독립 동작
4. **타입 안전성**: TypeScript 완벽 지원
5. **접근성 우선**: WCAG 2.1 AA 준수

### 핵심 로직

#### 1. 드래그 제스처 처리 (`useDragHandlers`)

```typescript
// apps/web/src/components/Drawer/hooks/useDragHandlers.ts

export function useDragHandlers({
  position,
  dismissible,
  snapPoints,
  closeThreshold,
  // ...
}) {
  const y = useMotionValue(0);
  const x = useMotionValue(0);

  // 스크롤 충돌 방지
  const shouldDrag = (event, info) => {
    const target = event.target;
    const scrollableParent = findScrollableParent(target);

    if (scrollableParent && hasScrollableContent(scrollableParent)) {
      return false; // 스크롤 가능 영역에서는 드래그 차단
    }
    return true;
  };

  // 드래그 종료 시 닫기/스냅 로직
  const handleDragEnd = (_event, info) => {
    const offset =
      position === 'bottom' || position === 'top'
        ? info.offset.y
        : info.offset.x;

    const velocity =
      position === 'bottom' || position === 'top'
        ? info.velocity.y
        : info.velocity.x;

    // 닫기 조건: 거리 또는 속도
    const shouldClose =
      Math.abs(offset) > 100 || Math.abs(velocity) > 500;

    if (shouldClose && dismissible) {
      setIsOpen(false);
    } else if (snapPoints) {
      // 가장 가까운 스냅 포인트로 이동
      const nearestSnap = findNearestSnapPoint(offset, snapPoints);
      animateToSnapPoint(nearestSnap);
    }
  };

  return { y, x, shouldDrag, handleDragEnd /* ... */ };
}
```

**특징:**

- `useMotionValue`: 리렌더링 없이 애니메이션 값 추적 (성능 최적화)
- 스크롤 충돌 방지: 스크롤 가능 영역에서는 드래그 차단
- 거리 + 속도 기반 닫기: 사용자 의도를 정확히 파악

#### 2. Body 스크롤 잠금 (`useBodyScrollLock`)

```typescript
// apps/web/src/components/Drawer/hooks/useBodyScrollLock.ts

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
      // 4. 스크롤 복원
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}
```

**특징:**

- `position: fixed` 방식: iOS Safari 호환성 최고
- 스크롤바 너비 보정: 레이아웃 시프트 방지
- 스크롤 위치 복원: 원래 위치로 정확히 복원

#### 3. 스냅 포인트 애니메이션 (`useSnapPointAnimation`)

```typescript
// apps/web/src/components/Drawer/hooks/useSnapPointAnimation.ts

export function useSnapPointAnimation({
  isOpen,
  snapPoints,
  activeSnapPointIndex,
  y,
  contentRef,
}) {
  // ref로 최신 값 추적 (의존성 배열 문제 해결)
  const snapPointsRef = useRef(snapPoints);
  const activeSnapIndexRef = useRef(activeSnapPointIndex);

  useEffect(() => {
    snapPointsRef.current = snapPoints;
    activeSnapIndexRef.current = activeSnapPointIndex;
  }, [snapPoints, activeSnapPointIndex]);

  // Drawer 열림 시 초기 스냅 포인트로 애니메이션
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const currentSnapPoints = snapPointsRef.current;
    const currentIndex =
      activeSnapIndexRef.current ?? currentSnapPoints.length - 1;
    const targetHeight =
      contentRef.current.offsetHeight *
      (1 - currentSnapPoints[currentIndex]);

    animate(y, -targetHeight, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  }, [isOpen]);
}
```

**특징:**

- `useRef`로 의존성 배열 문제 해결: eslint-disable 제거
- Spring 애니메이션: 자연스러운 움직임
- 스냅 포인트 비율(0~1)을 실제 픽셀로 변환

#### 4. 접근성 (`useDrawerAccessibility`)

```typescript
// apps/web/src/components/Drawer/hooks/useDrawerAccessibility.ts

export function useDrawerAccessibility({
  isOpen,
  dismissible,
  setIsOpen,
  contentRef,
}) {
  // ESC 키 처리
  useEffect(() => {
    if (!isOpen || !dismissible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () =>
      document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dismissible, setIsOpen]);

  // 포커스 트랩
  useFocusTrap(contentRef, isOpen);
}
```

**특징:**

- ESC 키로 닫기: WCAG 2.1 요구사항
- 포커스 트랩: 모달 모드에서 포커스 제한

#### 5. iOS 최적화 (`useIOSOptimization`)

```typescript
// apps/web/src/components/Drawer/hooks/useIOSOptimization.ts

export function useIOSOptimization({ isOpen, isDragging }) {
  // 동적 뷰포트 높이 대응
  useEffect(() => {
    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateVH();
    window.addEventListener('resize', updateVH);
    return () => window.removeEventListener('resize', updateVH);
  }, []);

  // 스크롤 bounce 제거
  useEffect(() => {
    if (!isOpen || !isDragging) return;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen, isDragging]);
}
```

**특징:**

- `--vh` CSS 변수: 동적 주소창 높이 대응
- `touchAction: none`: 불필요한 제스처 차단

### 컴포넌트 구조

```
Drawer/
├── DrawerRoot.tsx (97줄)          # Context Provider wrapper
├── DrawerContext.tsx (168줄)      # 상태 관리 & Context
├── DrawerContent.tsx (165줄)      # 메인 콘텐츠 (리팩토링됨)
├── DrawerOverlay.tsx (83줄)       # 배경 오버레이
├── DrawerTrigger.tsx (78줄)       # 트리거 버튼
├── DrawerHandle.tsx (29줄)        # 드래그 핸들
├── DrawerItems.tsx (76줄)         # 액션 아이템
├── DrawerSnap.tsx (100줄)         # 스냅 포인트별 콘텐츠
│
├── hooks/                         # 커스텀 훅 (재사용 가능)
│   ├── useBodyScrollLock.ts (23줄)
│   ├── useDragHandlers.ts (120줄)
│   ├── useSnapPointAnimation.ts (40줄)
│   ├── useDrawerAccessibility.ts (25줄)
│   └── useIOSOptimization.ts (35줄)
│
├── drawerAnimationUtils.ts (60줄) # 유틸리티 함수
├── useFocusTrap.ts (80줄)        # 포커스 트랩 훅
├── constants.ts (25줄)           # 상수
├── utils.ts (30줄)               # 헬퍼 함수
└── index.tsx (15줄)              # 합성 패턴 export
```

### 성능 최적화

1. **useMotionValue**: 리렌더링 없이 애니메이션 (60fps 유지)
2. **useMemo**: Context value 최적화
3. **Date.now()**: Date 객체 생성 제거 (Issue #3 해결)
4. **독립적 훅**: 각 기능을 독립 훅으로 분리 → 테스트 용이

**리팩토링 효과:**

- 432줄 → 165줄 (62% 감소)
- 5개 커스텀 훅으로 분리
- 재사용 가능한 구조

---

## 🧪 테스트

### 테스트 구조

```
__tests__/
└── e2e/
    ├── basic.spec.ts (38줄)              # 기본 열기/닫기
    ├── snap-points.spec.ts (139줄)       # 스냅 포인트
    ├── positions.spec.ts (130줄)         # Position 옵션
    ├── controlled-mode.spec.ts (52줄)    # 제어 모드
    ├── body-scroll-lock.spec.ts (157줄)  # 스크롤 잠금
    └── accessibility.spec.ts (44줄)      # 접근성
```

### 테스트 실행

```bash
# 전체 Drawer 테스트
pnpm test:e2e src/components/Drawer/__tests__/e2e

# 개별 테스트
pnpm test:e2e src/components/Drawer/__tests__/e2e/basic.spec.ts

# UI 모드 (시각적 확인)
pnpm test:e2e src/components/Drawer/__tests__/e2e --ui

# 병렬 실행 (빠름)
pnpm test:e2e src/components/Drawer/__tests__/e2e --workers=5
```

### 수동 테스트

테스트 페이지에서 모든 기능을 확인할 수 있습니다:

```
http://localhost:3000/main/test/drawer
```

**테스트 항목:**

- ✅ 드래그로 열기/닫기
- ✅ 스냅 포인트 (3개 이상)
- ✅ Left/Right Position 드래그
- ✅ Body 스크롤 잠금
- ✅ ESC 키로 닫기
- ✅ 포커스 트랩
- ✅ iOS Safari 동작

---

## 📦 NPM 배포

### 독립 패키지로 배포 가능

Drawer는 완전히 독립적으로 설계되어 NPM 패키지로 배포할 수 있습니다.

**특징:**

- ✅ **Zero 외부 의존성** (motion 제외)
- ✅ **전역 상태 불필요** (React Context만 사용)
- ✅ **작은 번들 크기** (~15KB gzipped)
- ✅ **Tree-shakable** (ESM 지원)

### 권장 배포 구조

```json
{
  "name": "@your-org/drawer",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "motion": "^11.0.0"
  },
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

### 사용 예시 (NPM 배포 후)

```bash
npm install @your-org/drawer motion
```

```tsx
import { Drawer } from '@your-org/drawer';
import '@your-org/drawer/styles.css';

function App() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Open</Drawer.Trigger>
      <Drawer.Overlay />
      <Drawer.Content>Hello!</Drawer.Content>
    </Drawer.Root>
  );
}
```

### OverlayPortal과의 통합

Drawer는 OverlayPortal/useOverlay와 **독립적**으로 동작합니다.

**이유:**

1. Drawer는 자체 Overlay 시스템 보유 (DrawerOverlay)
2. OverlayPortal은 Zustand 전역 상태 필요 (~30KB 추가)
3. 통합 시 불필요한 의존성 증가

**권장 방식:**

```bash
# 사용자가 선택적으로 설치
npm install @your-org/drawer          # Drawer만 (~15KB)
npm install @your-org/overlay zustand # Overlay만 (~30KB)
```

자세한 분석은 Issue.md의 "NPM 배포 전략" 섹션을 참고하세요.

---

## 📖 추가 문서

- **[Issue.md](./Issue.md)**: 트러블슈팅 및 해결된 이슈
- **[테스트 가이드](./__tests__/README.md)**: 테스트 실행 방법 (해당 파일이 존재하는 경우)

---

## 🤝 기여

이슈나 개선 사항은 GitHub Issues로 제보해주세요.

---

**Last Updated**: 2025-01-06
**Version**: 3.0 (Documentation Refactored)
**Maintainer**: @hwigeon
