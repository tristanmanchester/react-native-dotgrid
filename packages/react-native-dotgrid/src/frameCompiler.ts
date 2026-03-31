import { clamp, createEmptyFrame } from './utils';
import type { Frame, MatrixMode } from './types';

export type PackedFrame = number[];

export interface CompiledFrames {
  frames: PackedFrame[];
  frameCount: number;
  isStatic: boolean;
}

type CompileOptions = {
  pattern?: Frame;
  frames?: Frame[];
  rows: number;
  cols: number;
  mode: MatrixMode;
  levels?: number[];
};

export const packFrame = (frame: Frame, rows: number, cols: number): PackedFrame => {
  const packed = new Array<number>(rows * cols).fill(0);

  for (let row = 0; row < rows; row += 1) {
    const sourceRow = frame[row] ?? [];
    for (let col = 0; col < cols; col += 1) {
      packed[row * cols + col] = clamp(sourceRow[col] ?? 0);
    }
  }

  return packed;
};

export const createVuPackedFrame = (rows: number, cols: number, levels?: number[]): PackedFrame => {
  const packed = new Array<number>(rows * cols).fill(0);

  if (!levels || levels.length === 0) {
    return packed;
  }

  for (let col = 0; col < cols; col += 1) {
    const level = clamp(levels[col] ?? 0);
    const activeRows = Math.round(level * rows);

    for (let row = 0; row < rows; row += 1) {
      const rowFromBottom = rows - 1 - row;
      packed[rowFromBottom * cols + col] = row < activeRows ? clamp(0.5 + level * 0.5) : 0;
    }
  }

  return packed;
};

export const compileFrames = (options: CompileOptions): CompiledFrames => {
  const { pattern, frames, rows, cols, mode, levels } = options;
  const fallback = createEmptyFrame(rows, cols);

  let compiledFrames: PackedFrame[];

  if (mode === 'vu') {
    compiledFrames = [createVuPackedFrame(rows, cols, levels)];
  } else if (pattern) {
    compiledFrames = [packFrame(pattern, rows, cols)];
  } else if (frames && frames.length > 0) {
    compiledFrames = frames.map((frame) => packFrame(frame, rows, cols));
  } else {
    compiledFrames = [packFrame(fallback, rows, cols)];
  }

  return {
    frames: compiledFrames,
    frameCount: compiledFrames.length,
    isStatic: mode === 'default' && compiledFrames.length <= 1
  };
};
