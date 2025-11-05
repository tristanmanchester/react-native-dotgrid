# Changelog

## 0.2.0 (Unreleased)

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

