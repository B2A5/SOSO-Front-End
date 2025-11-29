# @soso/tsconfig

SOSO 모노레포를 위한 공유 TypeScript 설정 패키지

## 📦 포함된 설정

### base.json

기본 TypeScript 설정 (모든 패키지의 기반)

**특징**:

- Strict 모드 활성화
- ES2020 타겟
- 증분 컴파일 지원
- 타입 선언 파일 자동 생성

### nextjs.json

Next.js 앱용 설정

**사용 대상**:

- `apps/web`
- `apps/docs` (Nextra)

**특징**:

- JSX preserve
- Next.js 플러그인 지원
- DOM 타입 포함

### react-library.json

React 라이브러리용 설정

**사용 대상**:

- `packages/ui`
- `packages/hooks`

**특징**:

- JSX react-jsx (자동 import)
- bundler 모듈 해석
- noEmit (빌드 도구가 처리)

## 🔧 사용법

### Next.js 앱

```json
{
  "extends": "@soso/tsconfig/nextjs.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### React 라이브러리

```json
{
  "extends": "@soso/tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests", "__tests__"]
}
```

## 📚 참고

- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript 모노레포 베스트 프랙티스](hhttps://turborepo.com/docs/guides/tools/typescript)
