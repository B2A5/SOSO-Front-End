#!/usr/bin/env bash
set -euo pipefail

# 1. 항상 스크립트 위치(=레포 루트)에서 실행
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 2. output 폴더 초기화
rm -rf output
mkdir -p output

# 3. 의존 설치 & 웹앱만 빌드
pnpm install --frozen-lockfile
pnpm turbo run build --filter=apps/web

# 4. 빌드 산출물만 output/dist에 복사
mkdir -p output/dist
cp -R apps/web/.next        output/dist/.next
cp -R apps/web/public       output/dist/public
cp      apps/web/next.config.js output/dist/next.config.js || true
cp      apps/web/package.json   output/dist/package.json

echo "✅ output/dist 준비 완료"
