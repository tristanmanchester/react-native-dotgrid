import { createEmptyFrame, normaliseFrame } from './utils';
import type { Frame } from './types';

export const empty = (rows: number, cols: number): Frame => createEmptyFrame(rows, cols, 0);

export const digits: Frame[] = [
  // 0
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  // 1
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  // 2
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  // 3
  [
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  // 4
  [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0]
  ],
  // 5
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  // 6
  [
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  // 7
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0]
  ],
  // 8
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  // 9
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0]
  ]
];

export function generateWaveFrames(rows: number, cols: number, options?: { length?: number; amplitude?: number }): Frame[] {
  const length = options?.length ?? cols;
  const amplitude = options?.amplitude ?? Math.max(1, Math.floor(rows / 3));
  const frames: Frame[] = [];
  for (let t = 0; t < length; t += 1) {
    const frame: Frame = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let c = 0; c < cols; c += 1) {
      const y = Math.floor(rows / 2 + Math.sin((2 * Math.PI * (c + t)) / length) * amplitude);
      if (y >= 0 && y < rows) {
        frame[y][c] = 1;
      }
    }
    frames.push(normaliseFrame(frame, rows, cols));
  }
  return frames;
}

export function generateLoaderFrames(rows: number, cols: number): Frame[] {
  const frames: Frame[] = [];
  const perimeter: [number, number][] = [];
  // Top row
  for (let c = 0; c < cols; c += 1) perimeter.push([0, c]);
  // Right col
  for (let r = 1; r < rows; r += 1) perimeter.push([r, cols - 1]);
  // Bottom row
  for (let c = cols - 2; c >= 0; c -= 1) perimeter.push([rows - 1, c]);
  // Left col
  for (let r = rows - 2; r > 0; r -= 1) perimeter.push([r, 0]);

  for (let i = 0; i < perimeter.length; i += 1) {
    const frame: Frame = Array.from({ length: rows }, () => Array(cols).fill(0));
    const [pr, pc] = perimeter[i];
    frame[pr][pc] = 1;
    frames.push(frame);
  }
  return frames.map((f) => normaliseFrame(f, rows, cols));
}

export const wave = (rows: number, cols: number) => generateWaveFrames(rows, cols);
export const loader = (rows: number, cols: number) => generateLoaderFrames(rows, cols);

