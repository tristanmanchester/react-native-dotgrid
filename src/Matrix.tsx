import React, { useMemo, useEffect } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_FPS,
  DEFAULT_GAP,
  DEFAULT_PALETTE,
  DEFAULT_SIZE,
  MatrixProps
} from './types';
import { clamp, createEmptyFrame, deriveVuLevelsFrame, normaliseFrames, getFrameDurationMs } from './utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type LayoutDot = {
  key: string;
  cx: number;
  cy: number;
  r: number;
  row: number;
  col: number;
};

type DotProps = Omit<LayoutDot, 'key'> & {
  framesSV: SharedValue<number[][][]>;
  frameIndex: SharedValue<number>;
  brightnessSV: SharedValue<number>;
  fill: string;
};

const Dot: React.FC<DotProps> = ({ cx, cy, r, row, col, framesSV, frameIndex, brightnessSV, fill }) => {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    try {
      const idx = frameIndex.value;
      const framesArr = framesSV.value;
      const b = brightnessSV.value;
      const frame = framesArr[Math.min(idx, framesArr.length - 1)] || framesArr[0];
      const value = frame && frame[row] ? frame[row][col] ?? 0 : 0;
      const op = value * b;
      const clamped = op < 0 ? 0 : op > 1 ? 1 : op;
      return { opacity: clamped } as any;
    } catch (e) {
      return { opacity: 0 } as any;
    }
  }, []);

  return <AnimatedCircle cx={cx} cy={cy} r={r} fill={fill} animatedProps={animatedProps} opacity={0} />;
};

export const Matrix: React.FC<MatrixProps> = ({
  rows,
  cols,
  pattern,
  frames,
  fps = DEFAULT_FPS,
  gap = DEFAULT_GAP,
  size = DEFAULT_SIZE,
  palette = DEFAULT_PALETTE,
  brightness = DEFAULT_BRIGHTNESS,
  autoplay = true,
  loop = true,
  mode = 'default',
  levels,
  onFrame,
  accessibilityLabel,
  ariaLabel,
  presetLabel,
  paused,
  style,
  ...rest
}) => {
  const width = cols * size + (cols - 1) * gap;
  const height = rows * size + (rows - 1) * gap;
  const radius = size / 2;

  const fallback = useMemo(() => createEmptyFrame(rows, cols), [rows, cols]);

  const preparedFrames = useMemo(() => {
    return normaliseFrames(
      { pattern, frames, rows, cols, mode, levels },
      fallback
    );
  }, [pattern, frames, rows, cols, mode, levels, fallback]);

  const frameCount = preparedFrames.length;

  // Shared values to drive UI-thread animations
  const framesSV = useSharedValue(preparedFrames);
  const brightnessSV = useSharedValue(clamp(brightness));
  const progress = useSharedValue(0);

  // Keep shared values in sync with props
  useEffect(() => {
    framesSV.value = mode === 'vu' ? [deriveVuLevelsFrame(rows, cols, levels)] : preparedFrames;
  }, [preparedFrames, framesSV, mode, rows, cols, levels]);

  useEffect(() => {
    brightnessSV.value = clamp(brightness);
  }, [brightness, brightnessSV]);

  // Compute animation duration
  const duration = useMemo(() => getFrameDurationMs(fps, frameCount), [fps, frameCount]);

  // Start/stop animation
  useEffect(() => {
    const shouldAnimate = autoplay && !paused && frameCount > 1 && duration > 0 && mode !== 'vu';
    if (shouldAnimate) {
      progress.value = 0;
      progress.value = withRepeat(
        withTiming(frameCount, { duration, easing: Easing.linear }),
        loop ? -1 : 1,
        false
      );
    } else {
      // Pin to first frame
      progress.value = 0;
    }
    return () => {
      // No explicit cancel needed; new animations overwrite prior ones
    };
  }, [autoplay, paused, frameCount, duration, loop, mode, progress]);

  // Derive discrete frame index from progress
  const frameIndex = useDerivedValue(() => {
    const count = framesSV.value.length;
    if (count <= 1) return 0;
    const idx = Math.floor(progress.value) % count;
    return idx < 0 ? 0 : idx;
  }, []);

  // Notify onFrame when animation advances
  useAnimatedReaction(
    () => frameIndex.value,
    (idx, prev) => {
      if (onFrame && idx !== prev) {
        runOnJS(onFrame)(idx);
      }
    },
    [onFrame]
  );

  // Precompute dot layout positions
  const dots: LayoutDot[] = useMemo(() => {
    const items: LayoutDot[] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cx = c * (size + gap) + radius;
        const cy = r * (size + gap) + radius;
        items.push({ key: `d-${r}-${c}`, cx, cy, r: radius, row: r, col: c });
      }
    }
    return items;
  }, [rows, cols, size, gap, radius]);

  const label = ariaLabel || accessibilityLabel || presetLabel || 'Dot matrix display';

  useEffect(() => {
    // Announce for screen readers on initial mount
    AccessibilityInfo.announceForAccessibility?.(label);
  }, [label]);

  useEffect(() => {
    if (onFrame) onFrame(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[{ backgroundColor: palette.background }, style]}
      {...rest}
    >
      <Svg width={width} height={height}>
        {dots.map((d) => (
          <Circle key={`off-${d.key}`} cx={d.cx} cy={d.cy} r={d.r} fill={palette.off} />
        ))}
        {dots.map((d) => (
          <Dot
            key={`on-${d.key}`}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            row={d.row}
            col={d.col}
            framesSV={framesSV}
            frameIndex={frameIndex}
            brightnessSV={brightnessSV}
            fill={palette.on}
          />
        ))}
      </Svg>
    </View>
  );
};

export default Matrix;
