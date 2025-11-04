#!/usr/bin/env bash
set -euo pipefail

# From repo root, pack the library, install it into example/, and start Expo Go.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Cleaning previous tarballs..."
rm -f react-native-dotgrid-*.tgz || true

echo "Packing library..."
TARBALL=$(npm pack --silent)
echo "Created: $TARBALL"

echo "Installing in example app..."
cd example
npm install
npm install "../$TARBALL"

echo "Starting Expo (Expo Go, tunnel + clear cache)..."
exec npx expo start --tunnel -c
