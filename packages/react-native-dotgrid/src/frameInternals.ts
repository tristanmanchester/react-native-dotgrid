import type { FrameInputOptions } from './internalTypes';
import { clamp } from './math';
import type { Frame } from './types';

type FrameMapper<T> = {
  mapFrame: (frame: Frame, rows: number, cols: number) => T;
  mapVuFrame: (rows: number, cols: number, levels?: number[]) => T;
};

export const createEmptyFrame = (rows: number, cols: number, fill = 0): Frame =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));

export const normaliseFrame = (frame: Frame, rows: number, cols: number): Frame => {
  const normalised = createEmptyFrame(rows, cols);

  for (let row = 0; row < rows; row += 1) {
    const sourceRow = frame[row] ?? [];
    for (let col = 0; col < cols; col += 1) {
      normalised[row][col] = clamp(sourceRow[col] ?? 0);
    }
  }

  return normalised;
};

export const fillVuColumns = (
  rows: number,
  cols: number,
  levels: number[] | undefined,
  setCell: (row: number, col: number, value: number) => void
): void => {
  if (!levels || levels.length === 0) {
    return;
  }

  for (let col = 0; col < cols; col += 1) {
    const level = clamp(levels[col] ?? 0);
    const activeRows = Math.round(level * rows);
    const brightness = clamp(0.5 + (level * 0.5));

    for (let offset = 0; offset < activeRows; offset += 1) {
      setCell(rows - 1 - offset, col, brightness);
    }
  }
};

export const createVuFrame = (rows: number, cols: number, levels?: number[]): Frame => {
  const frame = createEmptyFrame(rows, cols);

  fillVuColumns(rows, cols, levels, (row, col, value) => {
    frame[row][col] = value;
  });

  return frame;
};

export const mapFrameInputs = <T>(
  options: FrameInputOptions,
  fallbackFrame: Frame,
  { mapFrame, mapVuFrame }: FrameMapper<T>
): T[] => {
  const { pattern, frames, rows, cols, mode, levels } = options;

  if (mode === 'vu') {
    return [mapVuFrame(rows, cols, levels)];
  }

  if (pattern) {
    return [mapFrame(pattern, rows, cols)];
  }

  if (frames && frames.length > 0) {
    return frames.map((frame) => mapFrame(frame, rows, cols));
  }

  return [mapFrame(fallbackFrame, rows, cols)];
};
