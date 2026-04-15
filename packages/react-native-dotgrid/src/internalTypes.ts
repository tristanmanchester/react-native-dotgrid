import type { Frame, MatrixMode } from './types';

export type PackedFrame = number[];

export type RgbChannels = {
  r: number;
  g: number;
  b: number;
};

export type FrameInputOptions = {
  pattern?: Frame;
  frames?: Frame[];
  rows: number;
  cols: number;
  mode: MatrixMode;
  levels?: number[];
};

export type MatrixAnimationDriverOptions = {
  autoplay: boolean;
  fps: number;
  frameCount: number;
  loop: boolean;
  mode: MatrixMode;
  onFrame?: (index: number) => void;
  paused?: boolean;
};
