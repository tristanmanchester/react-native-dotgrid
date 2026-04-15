import { fillVuColumns, createEmptyFrame, mapFrameInputs } from './frameInternals';
import type { FrameInputOptions, PackedFrame } from './internalTypes';
import { clamp } from './math';
import type { Frame } from './types';

type CompiledFrames = {
  frames: PackedFrame[];
  frameCount: number;
  isStatic: boolean;
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

  fillVuColumns(rows, cols, levels, (row, col, value) => {
    packed[row * cols + col] = value;
  });

  return packed;
};

export const compileFrames = (options: FrameInputOptions): CompiledFrames => {
  const { rows, cols, mode } = options;
  const compiledFrames = mapFrameInputs(options, createEmptyFrame(rows, cols), {
    mapFrame: packFrame,
    mapVuFrame: createVuPackedFrame
  });

  return {
    frames: compiledFrames,
    frameCount: compiledFrames.length,
    isStatic: mode === 'default' && compiledFrames.length <= 1
  };
};
