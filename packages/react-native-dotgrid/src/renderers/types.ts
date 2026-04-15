import type { SharedValue } from 'react-native-reanimated';

import type { MatrixAnimationDriverOptions, PackedFrame } from '../internalTypes';
import type { LayoutDot } from '../layout';
import type { Palette } from '../types';

type RendererLayoutProps = {
  rows: number;
  cols: number;
  width: number;
  height: number;
  size: number;
  gap: number;
  dots: LayoutDot[];
  palette: Palette;
  brightness: number;
};

export type RendererCommonProps = RendererLayoutProps &
  MatrixAnimationDriverOptions & {
  isStatic: boolean;
  frames: PackedFrame[];
  };

export type AnimatedFrameState = {
  framesSV: SharedValue<PackedFrame[]>;
  frameIndex: SharedValue<number>;
  brightnessSV: SharedValue<number>;
};
