# react-native-dotgrid Implementation Plan (SVG + Reanimated)

## 1. Objectives
- Deliver a reusable React Native library that renders animated dot-matrix displays using `react-native-svg` for rendering and Reanimated for UI-thread animations.
- Parity with the existing web API: `rows`, `cols`, `pattern`, `frames`, `fps`, `palette`, `brightness`, `mode="vu"`, `levels`, `onFrame`, and presets (`wave`, `vu`, `digits`, etc.).
- Keep the core implementation JavaScript-only to remain compatible with Expo Go; explicitly avoid Skia in the initial release.
- Anchor design decisions on the original reference implementation documented in `template.md`.

## 2. Package Architecture
- Monorepo structure with:
  - `/src` for the library source (`Matrix` component, types, presets, utilities).
  - `/example` Expo project showcasing static, animated, and VU meter demos.
- Public surface exports via `src/index.ts` (`Matrix`, types, preset generators).
- TypeScript build pipeline targeting CommonJS + ESModule outputs (`tsc` with dual outputs).

## 3. Library Setup
- Scaffold with `react-native-builder-bob` (or equivalent) to bootstrap TypeScript, linting, Jest config.
- Configure `package.json`:
  - `peerDependencies`: `react`, `react-native`, `react-native-svg`, `react-native-reanimated`.
  - `devDependencies`: `typescript`, typings, lint tools.
- Ensure `sideEffects: false` for tree-shaking and include `files: ["dist", "src", ...]`.
- Add build scripts (`tsc -p tsconfig.json`, `clean`, `lint`).

## 4. Core Component Implementation (`src/Matrix.tsx`)
- Render a fixed grid of SVG `<Circle>` elements:
  - Precompute cell positions (`rows × cols`) with memoization.
  - Draw background "off" circle layer (static fill).
  - Overlay animated circles whose opacity is driven via Reanimated worklets.
- Manage animation state:
  - Use shared values for `frames`, `mode`, `levels`, `brightness`.
  - Implement frame clock with `withTiming` + `withRepeat` at `fps`; derive `frameIndex`.
  - Support `autoplay`, `loop`, and `onFrame` callback via `useAnimatedReaction`.
  - Handle `mode="vu"` by lighting columns bottom-up based on live `levels`.
- Accessibility:
  - Wrap SVG in `View` with `accessible`, `accessibilityRole="image"`, `accessibilityLabel`.

## 5. Types & Constants (`src/types.ts`)
- Define `Frame`, `MatrixMode`, `Palette`, and `MatrixProps`.
- Provide defaults for palette, size, gap, fps, autoplay, loop, brightness.
- Document props inline with TSDoc for generated `.d.ts`.

## 6. Presets & Utilities (`src/presets.ts`)
- Port procedural generators: `wave`, `vu`, `empty`, plus static datasets (`digits`, `loader`, `pulse`, `snake`, directional chevrons).
- Ensure presets return `Frame` arrays compatible with the component without runtime conversions.
- Export via `src/index.ts`.

## 7. Example Expo App (`example/`)
- Create Expo SDK 52 project demonstrating:
  - Static digit display.
  - Animated wave (`frames`, `fps`, `loop`).
  - Live VU meter using random level updates.
- Configure consumer `babel.config.js` with `react-native-reanimated/plugin` (last entry).
- Include readme instructions for running `npx expo start`.

## 8. Documentation
- Author comprehensive `README.md`:
  - Installation instructions (library + peer dependencies).
  - Babel configuration requirements for Reanimated.
  - Quick start code snippets mirroring the web API.
  - Preset catalogue.
  - Accessibility guidance and performance notes.
- Add `CHANGELOG.md` and initial `0.1.0` entry.
- Document Expo Go vs custom dev client considerations and future `renderer="skia"` roadmap (explicitly optional).

## 9. Quality & Testing
- Unit tests (Jest) for:
  - Preset generators (frame shapes, ranges).
  - Utility functions (e.g., `empty`, clamp logic).
- Visual regression / smoke tests:
  - Use Expo example for manual verification of 7×7 and 16×16 grids at target FPS.
- ESLint + TypeScript checks integrated into CI (GitHub Actions).

## 10. Release Checklist
- Run `npm pack` to confirm published artifacts (dist bundle, types, readme).
- Validate example app builds on iOS & Android simulators (Expo Go).
- Tag `v0.1.0`, publish to npm, announce installation + usage notes.
- Plan follow-up milestones: additional presets, worklet frame generators, optional Skia renderer (future).
