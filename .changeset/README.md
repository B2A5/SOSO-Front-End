# Changesets

이 프로젝트는 [Changesets](https://github.com/changesets/changesets)를 사용하여 버전 관리 및 배포를 자동화합니다.

## 📝 Changeset 생성하기

패키지를 변경한 후 다음 명령어를 실행하세요:

```bash
pnpm changeset
```

대화형 프롬프트가 나타나면:

1. 변경된 패키지 선택
2. 버전 범프 타입 선택 (major/minor/patch)
3. 변경사항 요약 작성

## 🔖 버전 업데이트

Release PR을 생성하려면:

```bash
pnpm version-packages
```

이 명령어는:

- 패키지 버전 업데이트
- CHANGELOG.md 생성
- changeset 파일 제거

## 🚀 배포

Release PR이 머지되면, GitHub Actions가 자동으로:

1. 패키지 빌드
2. npm에 배포
3. GitHub Release 생성

## 📚 Semantic Versioning

- **Major (1.0.0)**: Breaking changes
- **Minor (0.1.0)**: 새로운 기능 추가 (하위 호환)
- **Patch (0.0.1)**: 버그 수정

## 예시

### 1. 새로운 기능 추가

```bash
pnpm changeset
# Select: @soso/ui
# Bump: minor
# Summary: "Add Checkbox component"
```

### 2. 버그 수정

```bash
pnpm changeset
# Select: @soso/ui
# Bump: patch
# Summary: "Fix Button disabled state"
```

### 3. Breaking Change

```bash
pnpm changeset
# Select: @soso/ui
# Bump: major
# Summary: "Remove deprecated props from Button"
```
