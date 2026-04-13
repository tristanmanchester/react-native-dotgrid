import { vu } from '../presets';
import { createVuFrame, normaliseFrames } from '../utils';

describe('vu mode and frames', () => {
  test('createVuFrame lights bottom rows instead of top rows', () => {
    const frame = createVuFrame(7, 1, [0.5]);

    expect(frame[0][0]).toBe(0);
    expect(frame[1][0]).toBe(0);
    expect(frame[2][0]).toBe(0);
    expect(frame[3][0]).toBeGreaterThan(0);
    expect(frame[4][0]).toBeGreaterThan(0);
    expect(frame[5][0]).toBeGreaterThan(0);
    expect(frame[6][0]).toBeGreaterThan(0);
  });

  test('vu preset uses the same bottom-up fill logic', () => {
    const frame = vu(1, [0.5]);

    expect(frame[0][0]).toBe(0);
    expect(frame[1][0]).toBe(0);
    expect(frame[2][0]).toBe(0);
    expect(frame[3][0]).toBeGreaterThan(0);
    expect(frame[4][0]).toBeGreaterThan(0);
    expect(frame[5][0]).toBeGreaterThan(0);
    expect(frame[6][0]).toBeGreaterThan(0);
  });

  test('normaliseFrames prefers pattern over frames in default mode', () => {
    const pattern = [
      [1, 0],
      [0, 1]
    ];
    const frames = [
      [
        [0, 0],
        [0, 0]
      ]
    ];
    const result = normaliseFrames(
      { pattern, frames, rows: 2, cols: 2, mode: 'default' },
      [
        [0, 0],
        [0, 0]
      ]
    );
    expect(result).toHaveLength(1);
    expect(result[0][0][0]).toBe(1);
    expect(result[0][1][1]).toBe(1);
  });

  test('normaliseFrames in vu mode ignores pattern/frames and uses levels', () => {
    const result = normaliseFrames(
      { pattern: [[1]], frames: [[[0]]], rows: 3, cols: 2, mode: 'vu', levels: [0.5, 0] },
      [[0]]
    );
    expect(result).toHaveLength(1);
    // first column should have some lights on
    const lit = result[0].map((r) => r[0]).filter((v) => v > 0).length;
    expect(lit).toBeGreaterThan(0);
  });
});
