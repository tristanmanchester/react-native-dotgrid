import type { PackedFrame } from './frameCompiler';

export type RgbChannels = {
  r: number;
  g: number;
  b: number;
};

export const clampValue = (value: number, min = 0, max = 1): number => {
  'worklet';

  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

export const clampForRender = clampValue;

export const clampFrameIndex = (
  progress: number,
  frameCount: number
): number => {
  'worklet';

  if (!Number.isFinite(progress) || frameCount <= 1) {
    return 0;
  }

  const index = Math.floor(progress) % frameCount;

  if (index < 0) {
    return 0;
  }

  if (index >= frameCount) {
    return frameCount - 1;
  }

  return index;
};

export const resolveFrameIndex = (
  index: number,
  frameCount: number
): number => {
  'worklet';

  if (!Number.isFinite(index) || frameCount <= 1) {
    return 0;
  }

  if (index < 0) {
    return 0;
  }

  if (index >= frameCount) {
    return frameCount - 1;
  }

  return index;
};

export const getPackedFrameAt = (
  frames: PackedFrame[],
  index: number
): PackedFrame => {
  'worklet';

  if (frames.length === 0) {
    return [];
  }

  return frames[resolveFrameIndex(index, frames.length)] ?? frames[0];
};

export const getPackedFrameValue = (
  frame: PackedFrame,
  index: number
): number => {
  'worklet';

  return frame[index] ?? 0;
};

export const computeDotOpacity = (
  value: number,
  brightness: number
): number => {
  'worklet';

  return clampValue(value * brightness);
};

export const rgbaFromChannels = (
  color: RgbChannels,
  alpha: number
): string => {
  'worklet';

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clampValue(alpha)})`;
};

export const toRgbaString = (
  red: number,
  green: number,
  blue: number,
  alpha: number
): string => {
  'worklet';

  return `rgba(${red}, ${green}, ${blue}, ${clampValue(alpha)})`;
};
