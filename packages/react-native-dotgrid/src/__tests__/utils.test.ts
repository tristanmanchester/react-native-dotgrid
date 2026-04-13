import { getFrameDurationMs } from '../math';
import { clamp, createEmptyFrame, normaliseFrames } from '../utils';

describe('utils', () => {
  test('clamp enforces bounds', () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(0.5)).toBe(0.5);
    expect(clamp(2)).toBe(1);
  });

  test('createEmptyFrame shape', () => {
    const f = createEmptyFrame(3, 4, 1);
    expect(f.length).toBe(3);
    expect(f[0].length).toBe(4);
    expect(f.flat().every((v) => v === 1)).toBe(true);
  });

  test('getFrameDurationMs from fps and frames', () => {
    expect(getFrameDurationMs(10, 10)).toBe(1000);
    expect(getFrameDurationMs(12, 1)).toBe(0);
  });

  test('normaliseFrames fallback is normalized to the requested dimensions', () => {
    const result = normaliseFrames(
      { rows: 3, cols: 4, mode: 'default' },
      [
        [1, 1],
        [1, 1]
      ]
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ]);
  });
});
