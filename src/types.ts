import type { ViewProps } from 'react-native';

export type Frame = number[][];

export type MatrixMode = 'default' | 'vu';

export interface Palette {
  on: string;
  off: string;
  background?: string;
}

export interface MatrixProps extends ViewProps {
  rows: number;
  cols: number;
  /**
   * Static pattern to render when animation is not required.
   * Takes priority over `frames`.
   */
  pattern?: Frame;
  /**
   * Animated frame sequence rendered at the specified FPS.
   */
  frames?: Frame[];
  /**
   * Frames per second for the animation loop.
   * @default 12
   */
  fps?: number;
  /**
   * Gap between dots (in logical pixels).
   * @default 2
   */
  gap?: number;
  /**
   * Dot diameter in logical pixels.
   * @default 10
   */
  size?: number;
  /**
   * Palette colors for active/inactive dots.
   */
  palette?: Palette;
  /**
   * Global brightness multiplier (0..1).
   * @default 1
   */
  brightness?: number;
  /**
   * Whether to start the animation automatically.
   * @default true
   */
  autoplay?: boolean;
  /**
   * Whether to loop animated frames.
   * @default true
   */
  loop?: boolean;
  /**
   * Rendering mode. Defaults to `default`.
   */
  mode?: MatrixMode;
  /**
   * Live audio levels for VU meter mode. Values are clamped to 0..1.
   */
  levels?: number[];
  /**
   * Invoked when the current frame index updates.
   */
  onFrame?: (index: number) => void;
  /**
   * Provide custom accessibility label for assistive technologies.
   */
  accessibilityLabel?: string;
  /**
   * Alias for accessibilityLabel for parity with web docs.
   */
  ariaLabel?: string;
  /**
   * Additional label describing the dot-grid preset.
   */
  presetLabel?: string;
  /**
   * Render the matrix paused; useful for controlled playback.
   */
  paused?: boolean;
}

export const DEFAULT_FPS = 12;
export const DEFAULT_SIZE = 10;
export const DEFAULT_GAP = 2;
export const DEFAULT_BRIGHTNESS = 1;

export const DEFAULT_PALETTE: Palette = {
  on: '#12f45a',
  off: '#0d1a12',
  background: 'transparent'
};
