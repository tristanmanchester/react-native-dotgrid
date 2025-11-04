# react-native-dotgrid

Animated dot-matrix display for React Native using `react-native-svg` and Reanimated. Renders crisp circular cells and supports animated frames and a live VU meter mode.

## Installation

- Install the library and peer dependencies:

```
npm install react-native-dotgrid react-native-svg react-native-reanimated
```

- Configure Reanimated: add `react-native-reanimated/plugin` as the last plugin in your Babel config.

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

## Props

- `rows`, `cols` – grid dimensions
- `pattern` – single frame to display
- `frames` – array of frames for animation
- `fps` – frames per second (default 12)
- `autoplay`, `loop`, `paused`
- `palette` – `{ on, off }` colors
- `size`, `gap`
- `brightness` – 0..1 multiplier
- `mode` – `default` | `vu`
- `levels` – numbers 0..1 per column in `vu` mode
- `onFrame` – callback on frame index change

## Presets

- `digits` – 7x5 numerals 0-9
- `generateWaveFrames(rows, cols, opts)` – sine wave animation
- `generateLoaderFrames(rows, cols)` – perimeter spinner
- `empty(rows, cols)` – blank frame

## Expo Example

See `example/` for a minimal Expo app using the component. Make sure the example's `babel.config.js` includes the Reanimated plugin as the last entry.

## Notes

- Library is JavaScript-only and compatible with Expo Go
- Animations run on UI-thread via Reanimated when possible
- SVG keeps visuals crisp at any size

## License

MIT

