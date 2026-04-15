import {
  createEmptyFrame,
  createVuFrame,
  mapFrameInputs,
  normaliseFrame
} from './frameInternals';
import type { FrameInputOptions } from './internalTypes';
import type { Frame } from './types';

export { createEmptyFrame, createVuFrame, normaliseFrame };

export const normaliseFrames = (
  options: FrameInputOptions,
  fallbackFrame: Frame
): Frame[] =>
  mapFrameInputs(options, fallbackFrame, {
    mapFrame: normaliseFrame,
    mapVuFrame: createVuFrame
  });

export const deriveVuLevelsFrame = (rows: number, cols: number, levels?: number[]): Frame =>
  createVuFrame(rows, cols, levels);

export { clamp, getFrameDurationMs } from './math';
