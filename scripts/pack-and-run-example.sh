#!/usr/bin/env bash
set -euo pipefail

# From repo root, pack the workspace package, install it into example/, and start Expo.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/packages/react-native-dotgrid"
EXAMPLE_DIR="$ROOT_DIR/example"

echo "Cleaning previous tarballs..."
rm -f "$PACKAGE_DIR"/react-native-dotgrid-*.tgz || true

echo "Building workspace package..."
cd "$ROOT_DIR"
npm run build -w react-native-dotgrid >/dev/null

echo "Packing library..."
cd "$ROOT_DIR"
TARBALL=$(npm pack --ignore-scripts --silent "$PACKAGE_DIR")
echo "Created: $TARBALL"

echo "Installing in example app..."
cd "$EXAMPLE_DIR"
npm install --no-workspaces
npm install --no-workspaces "$ROOT_DIR/$TARBALL"

echo "Starting Expo (dev client, clear cache)..."
exec npx expo start --dev-client --clear
