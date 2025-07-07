#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# 0. Ensure pnpm is available                                                 #
###############################################################################
if ! command -v pnpm &> /dev/null; then
  echo "▶ pnpm not found – installing via Corepack"
  # Node 16.14+ 런타임에는 corepack이 포함되어 있습니다.
  corepack enable
  corepack prepare pnpm@9.15.9 --activate   # 원하는 pnpm 버전 지정
fi

###############################################################################
# 1. Always run from repo root                                                #
###############################################################################
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

###############################################################################
# 2. Build                                                                    #
###############################################################################
echo "▶ Clean output"
rm -rf output && mkdir output

echo "▶ Install deps"
pnpm install --frozen-lockfile --ignore-scripts

echo "▶ Turbo build"
pnpm turbo run build --filter=apps/web

###############################################################################
# 3. Copy artifacts                                                           #
###############################################################################
echo "▶ Copy artifacts"
cp -R apps/web/.next          output/.next
cp -R apps/web/public         output/public
cp    apps/web/package.json   output/
cp    apps/web/next.config.*  output/ || true

echo "✅ output/ ready"
