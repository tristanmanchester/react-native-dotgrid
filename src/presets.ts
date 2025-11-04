import type { Frame } from './types';
import { clamp, createEmptyFrame, normaliseFrame } from './utils';

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

// Pulse: global brightness pulse in place (no motion), from 0.2→1.0→0.2
export function generatePulseFrames(rows: number, cols: number, count = 16): Frame[] {
  const sequence: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i / (count - 1)) * Math.PI; // 0..pi
    const b = 0.2 + 0.8 * Math.sin(t);
    sequence.push(clamp(b));
  }
  return sequence.map((b) => {
    const f = createEmptyFrame(rows, cols, b);
    return normaliseFrame(f, rows, cols);
  });
}

// Snake: single dot traverses the grid row by row (boustrophedon)
export function generateSnakeFrames(rows: number, cols: number, tail = 6): Frame[] {
  const frames: Frame[] = [];
  const path: Array<[number, number]> = [];
  for (let r = 0; r < rows; r += 1) {
    const range = r % 2 === 0 ? [...Array(cols).keys()] : [...Array(cols).keys()].reverse();
    for (const c of range) path.push([r, c]);
  }
  for (let i = 0; i < path.length; i += 1) {
    const f = createEmptyFrame(rows, cols, 0);
    for (let t = 0; t < tail; t += 1) {
      const idx = i - t;
      if (idx < 0) break;
      const [rr, cc] = path[idx];
      const b = clamp(1 - t / tail);
      f[rr][cc] = b;
    }
    frames.push(normaliseFrame(f, rows, cols));
  }
  return frames;
}

// Chevrons: static left/right pointing chevrons for indicators
export function chevronLeft(rows = 7, cols = 7): Frame {
  const mid = Math.floor(rows / 2);
  const f = createEmptyFrame(rows, cols, 0);
  for (let i = 0; i < mid; i += 1) {
    const r1 = mid - i;
    const r2 = mid + i;
    const c = i;
    if (r1 >= 0 && r1 < rows) f[r1][c] = 1;
    if (r2 >= 0 && r2 < rows) f[r2][c] = 1;
  }
  return normaliseFrame(f, rows, cols);
}

export function chevronRight(rows = 7, cols = 7): Frame {
  const mid = Math.floor(rows / 2);
  const f = createEmptyFrame(rows, cols, 0);
  for (let i = 0; i < mid; i += 1) {
    const r1 = mid - i;
    const r2 = mid + i;
    const c = cols - 1 - i;
    if (r1 >= 0 && r1 < rows) f[r1][c] = 1;
    if (r2 >= 0 && r2 < rows) f[r2][c] = 1;
  }
  return normaliseFrame(f, rows, cols);
}

export const pulse = (rows: number, cols: number, count?: number) => generatePulseFrames(rows, cols, count);
export const snake = (rows: number, cols: number, tail?: number) => generateSnakeFrames(rows, cols, tail);
