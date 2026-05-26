#!/usr/bin/env bash
set -euo pipefail

APP_NAME="filebrowser"
OUT_DIR="release"
VERSION="${VERSION:-dev}"
COMMIT_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
HOST_GOOS="$(go env GOOS)"
HOST_GOARCH="$(go env GOARCH)"
GOCACHE="${GOCACHE:-$(pwd)/.cache/go-build}"
GOMODCACHE="${GOMODCACHE:-$(pwd)/.cache/go-mod}"
LDFLAGS="-s -w -X github.com/filebrowser/filebrowser/v2/version.Version=${VERSION} -X github.com/filebrowser/filebrowser/v2/version.CommitSHA=${COMMIT_SHA}"
export GOCACHE GOMODCACHE

build_target() {
  local goos="$1"
  local goarch="$2"
  local output="${OUT_DIR}/${APP_NAME}-${goos}-${goarch}"

  if [[ "$goos" == "windows" ]]; then
    output="${output}.exe"
  fi

  echo "==> Building ${goos}/${goarch}"
  CGO_ENABLED=0 GOOS="$goos" GOARCH="$goarch" go build \
    -ldflags "$LDFLAGS" \
    -o "$output" \
    .

  echo "  ${output}"
}

echo "==> Checking tools"
command -v go >/dev/null 2>&1 || { echo "go is required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "node is required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "pnpm is required"; exit 1; }

echo "==> Cleaning output"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

echo "==> Building frontend"
(
  cd frontend
  CI=true pnpm install --frozen-lockfile
  pnpm run build
)

echo "==> Building backend executables"
build_target "$HOST_GOOS" "$HOST_GOARCH"
build_target linux amd64

echo "==> Done"
echo "Executables:"
find "$OUT_DIR" -maxdepth 1 -type f -perm -111 -print | sort
echo "Run Linux x86_64 with:"
echo "  ./${OUT_DIR}/${APP_NAME}-linux-amd64 --address 127.0.0.1 --port 8080 --root ."
