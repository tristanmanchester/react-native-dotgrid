# Changelog

## 0.3.0

### Changed
- Refactored the package into a workspace layout with the published library under `packages/react-native-dotgrid` and the Expo app under `example`.
- Switched the default Skia renderer to a worklet-safe `Picture` backend with a memoized static background and UI-thread-driven active foreground rendering.
- Split animation state management from renderer drawing so Skia and SVG share the same packed-frame and shared-value pipeline.
- Tightened npm packaging so the ESM build is explicitly marked as ESM, tests are excluded from published type declarations, and the tarball only ships built artifacts and docs.

### Fixed
- Fixed the native iOS startup crash caused by calling non-worklet helpers from UI-thread rendering paths.
- Removed worklet-unsafe helper usage from both Skia and SVG renderers.
- Stopped publishing test declaration files and raw source files in the npm package.

### Added
- Added dedicated worklet-safe renderer helpers and regression tests covering renderer import boundaries and worklet helper behavior.
- Added packed-artifact smoke testing for the published package against a temporary Expo app.

## 0.2.0

### Added
- **Pre-generated preset constants** for web API parity:
  - `waveFrames`, `loaderFrames`, `pulseFrames`, `snakeFrames`, `rippleFrames`
  - `chevronLeftFrame`, `chevronRightFrame`
- **New presets**:
  - `generatePulseFrames()` / `pulse()` – global brightness pulse animation
  - `generateSnakeFrames()` / `snake()` – snake traversal with fading tail
  - `generateRippleFrames()` / `ripple()` – concentric wave effect
  - `chevronLeft()`, `chevronRight()` – directional indicator frames
  - `vu()` helper function – create static VU meter patterns from levels array
- **Matrix component tests** – comprehensive test suite covering all props and modes
- `paused` prop for controlled animation playback
- `presetLabel` prop for additional accessibility labeling

### Changed
- **BREAKING**: Default `size` changed from 12 to 10 (matches web template.md)
- Documentation improvements:
  - Added examples for both pre-generated constants and dynamic generators
  - Documented VU meter modes (live vs static)
  - Added comprehensive preset reference with options
- Example app now includes ripple demo and 3x3 showcase grid

### Fixed
- Static patterns now render without Reanimated overhead
- Frame normalization handles mismatched dimensions correctly

## 0.1.0

### Added
- Initial release with SVG + Reanimated Matrix component
- Core presets: digits, wave generator, loader, empty
- TypeScript types and utilities
- VU meter mode with live level updates
- Jest + ESLint setup
- Example Expo app skeleton
