# react-native-dotgrid

Animated dot-matrix display for React Native using `react-native-svg` and Reanimated. Renders crisp circular cells and supports animated frames and a live VU meter mode.

## Installation

- Install the library and peer dependencies:

```
npm install react-native-dotgrid react-native-svg react-native-reanimated
```

- Configure Reanimated:
  - Add `react-native-reanimated/plugin` as the last plugin in your Babel config.
  - For Expo, see `example/babel.config.js` for a working setup.

## Quick Start

```tsx
import React from 'react';
import { View } from 'react-native';
import { Matrix, digits, generateWaveFrames } from 'react-native-dotgrid';

export default function Demo() {
  const frames = generateWaveFrames(7, 7);
  return (
    <View>
      <Matrix rows={7} cols={5} pattern={digits[5]} />
      <Matrix rows={7} cols={7} frames={frames} fps={20} loop />
    </View>
  );
}
```

### VU Meter

```tsx
<Matrix rows={7} cols={12} mode="vu" levels={[0.1, 0.6, 0.9, 0.2, 0.5, 0.7, 0.3, 0.8, 0.4, 0.9, 0.2, 0.1]} />
```

## API

Matrix props (high‑level):

- `rows`, `cols` number – grid dimensions (required)
- `pattern` Frame – single frame to display
- `frames` Frame[] – animation frames
- `fps` number – frames per second (default 12)
- `autoplay` boolean – start animation on mount (default true)
- `loop` boolean – repeat animation when it reaches the end (default true)
- `paused` boolean – pause animation without losing state
- `size` number – dot diameter (default 12)
- `gap` number – spacing between dots (default 2)
- `palette` { on, off, background? } – colors
- `brightness` number 0..1 – multiplies per‑cell brightness (default 1)
- `mode` 'default' | 'vu' – render animated frames or live VU columns
- `levels` number[] 0..1 – VU values per column when `mode="vu"`
- `onFrame(index)` – callback when frame index updates; called with 0 on mount
- `accessibilityLabel` | `ariaLabel` – label for screen readers

Types:

- `type Frame = number[][] // [row][col] brightness 0..1`

Performance:

- Grid positions are precomputed and memoized
- Only opacity is animated on the UI thread
- VU mode derives a single frame from `levels`

Accessibility:

- Wrapped in a `View` with `accessibilityRole="image"` and `accessibilityLabel`

## Presets

- `digits` – 7x5 numerals 0-9
- `generateWaveFrames(rows, cols, opts)` – sine wave animation
- `generateLoaderFrames(rows, cols)` – perimeter spinner
- `generatePulseFrames(rows, cols, count?)` – global brightness pulse
- `generateSnakeFrames(rows, cols)` – single dot traverses grid
- `chevronLeft(rows?, cols?)`, `chevronRight(rows?, cols?)` – directional static frames
- `empty(rows, cols)` – blank frame

## Expo Example

- See `example/` for a minimal Expo app with a preset selector.
- Ensure `react-native-reanimated/plugin` is the last Babel plugin.
- Works in Expo Go. For heavy animations, a custom dev client is recommended.

## Notes

- Library is JavaScript-only and compatible with Expo Go
- Animations run on UI-thread via Reanimated when possible
- SVG keeps visuals crisp at any size

## License

MIT
