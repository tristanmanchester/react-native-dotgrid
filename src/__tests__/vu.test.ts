import { createVuFrame, normaliseFrames } from '../utils';

describe('vu mode and frames', () => {
  test('createVuFrame lights from bottom', () => {
    const f = createVuFrame(5, 3, [0, 0.6, 1]);
    // Rightmost column fully on
    expect(f.map((r) => r[2]).reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
    // Middle column partially on
    const midCol = f.map((r) => r[1]).filter((v) => v > 0).length;
    expect(midCol).toBeGreaterThan(0);
    expect(midCol).toBeLessThan(5);
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

