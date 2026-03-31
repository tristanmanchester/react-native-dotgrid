import { clamp as clampValue } from './math';
import type { Frame, MatrixMode } from './types';

export const createEmptyFrame = (rows: number, cols: number, fill = 0): Frame =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));

export const normaliseFrame = (frame: Frame, rows: number, cols: number): Frame => {
  const normalised = createEmptyFrame(rows, cols);
  for (let r = 0; r < rows; r += 1) {
    const row = frame[r] ?? [];
    for (let c = 0; c < cols; c += 1) {
      normalised[r][c] = clampValue(row[c] ?? 0);
    }
  }
  return normalised;
};

export const normaliseFrames = (
  options: {
    pattern?: Frame;
    frames?: Frame[];
    rows: number;
    cols: number;
    mode: MatrixMode;
    levels?: number[];
  },
  fallbackFrame: Frame
): Frame[] => {
  const { pattern, frames, rows, cols, mode, levels } = options;

  if (mode === 'vu') {
    return [createVuFrame(rows, cols, levels)];
  }

  if (pattern) {
    return [normaliseFrame(pattern, rows, cols)];
  }

  if (frames && frames.length > 0) {
    return frames.map((frame) => normaliseFrame(frame, rows, cols));
  }

  return [fallbackFrame];
};

export const createVuFrame = (rows: number, cols: number, levels?: number[]): Frame => {
  const frame = createEmptyFrame(rows, cols);
  if (!levels || levels.length === 0) {
    return frame;
  }

  for (let c = 0; c < cols; c += 1) {
    const level = clampValue(levels[c] ?? 0);
    const activeRows = Math.round(level * rows);
    for (let r = 0; r < rows; r += 1) {
      const rowFromBottom = rows - 1 - r;
      frame[rowFromBottom][c] = r < activeRows ? clampValue(0.5 + (level * 0.5)) : 0;
    }
  }
  return frame;
};

export const deriveVuLevelsFrame = (rows: number, cols: number, levels?: number[]): Frame =>
  createVuFrame(rows, cols, levels);

export { clamp, getFrameDurationMs } from './math';
