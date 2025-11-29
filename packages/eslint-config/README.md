# @soso/eslint-config

SOSO 모노레포를 위한 공유 ESLint 설정 패키지

## 📦 포함된 설정

### index.cjs

Next.js 앱용 ESLint 설정

**사용 대상**:

- `apps/web`
- `apps/docs`

**특징**:

- Airbnb 스타일 가이드
- TypeScript 지원
- Next.js 규칙
- Prettier 통합

### library.cjs

React 라이브러리용 ESLint 설정

**사용 대상**:

- `packages/ui`
- `packages/hooks`
- `apps/storybook`

**특징**:

- Next.js 규칙 제외
- devDependencies import 허용
- 라이브러리 개발에 최적화

## 🔧 사용법

### Next.js 앱

```js
// apps/web/.eslintrc.cjs
module.exports = {
  root: true,
  extends: ['@soso/eslint-config'],
};
```

### React 라이브러리

```js
// packages/ui/.eslintrc.cjs
module.exports = {
  root: true,
  extends: ['@soso/eslint-config/library'],
};
```

## 📚 참고

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [터보레포 ESLint 설정](https://turborepo.com/docs/guides/tools/eslint)
