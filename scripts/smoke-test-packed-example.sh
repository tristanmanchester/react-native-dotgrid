#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/packages/react-native-dotgrid"
EXAMPLE_DIR="$ROOT_DIR/example"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/dotgrid-smoke.XXXXXX")"
TMP_EXAMPLE_DIR="$TMP_DIR/example"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Packing workspace package..."
cd "$ROOT_DIR"
npm run build -w react-native-dotgrid >/dev/null
rm -f "$ROOT_DIR"/react-native-dotgrid-*.tgz || true
TARBALL="$(npm pack --ignore-scripts --silent "$PACKAGE_DIR")"
TARBALL_PATH="$ROOT_DIR/$TARBALL"
echo "Packed: $TARBALL_PATH"

echo "Preparing temporary example app..."
cp -R "$EXAMPLE_DIR" "$TMP_EXAMPLE_DIR"
rm -rf "$TMP_EXAMPLE_DIR/node_modules" "$TMP_EXAMPLE_DIR/ios" "$TMP_EXAMPLE_DIR/package-lock.json"

TMP_PACKAGE_JSON="$TMP_EXAMPLE_DIR/package.json"
TMP_PACKAGE_JSON_NEXT="$TMP_EXAMPLE_DIR/package.json.next"
jq --arg tarball "$TARBALL_PATH" '.dependencies["react-native-dotgrid"] = $tarball' "$TMP_PACKAGE_JSON" > "$TMP_PACKAGE_JSON_NEXT"
mv "$TMP_PACKAGE_JSON_NEXT" "$TMP_PACKAGE_JSON"

echo "Installing temporary example dependencies..."
cd "$TMP_EXAMPLE_DIR"
npm install --no-workspaces

echo "Aligning temporary example dependencies with Expo..."
npx expo install --fix

echo "Checking resolved native/runtime versions..."
npm ls react react-native react-native-reanimated react-native-worklets react-native-svg @shopify/react-native-skia --depth=1

echo "Running Expo Doctor..."
npx expo-doctor

echo "Verifying iOS prebuild graph..."
npx expo prebuild --platform ios --clean --no-install

echo "Verifying web export..."
npx expo export --platform web --output-dir dist-web-smoke

echo "Packed artifact smoke test passed."
