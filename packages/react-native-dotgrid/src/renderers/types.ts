import type { SharedValue } from 'react-native-reanimated';

import type { PackedFrame } from '../frameCompiler';
import type { LayoutDot } from '../layout';
import type { MatrixMode, Palette } from '../types';

export type RendererCommonProps = {
  rows: number;
  cols: number;
  width: number;
  height: number;
  size: number;
  gap: number;
  dots: LayoutDot[];
  palette: Palette;
  brightness: number;
  fps: number;
  autoplay: boolean;
  loop: boolean;
  paused?: boolean;
  mode: MatrixMode;
  onFrame?: (index: number) => void;
  frameCount: number;
  isStatic: boolean;
  frames: PackedFrame[];
};

export type AnimatedFrameState = {
  framesSV: SharedValue<PackedFrame[]>;
  frameIndex: SharedValue<number>;
  brightnessSV: SharedValue<number>;
};
