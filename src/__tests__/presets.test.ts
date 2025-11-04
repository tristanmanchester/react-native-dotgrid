import { digits, empty, generateLoaderFrames, generateWaveFrames } from '../presets';

describe('presets', () => {
  test('digits are 7x5 frames', () => {
    expect(digits).toHaveLength(10);
    for (const d of digits) {
      expect(d.length).toBe(7);
      for (const row of d) {
        expect(row.length).toBe(5);
        for (const v of row) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  test('empty returns correct shape', () => {
    const f = empty(4, 3);
    expect(f.length).toBe(4);
    expect(f[0].length).toBe(3);
    expect(f.flat().every((v) => v === 0)).toBe(true);
  });

  test('wave frames shape and values', () => {
    const frames = generateWaveFrames(7, 7, { length: 7 });
    expect(frames.length).toBeGreaterThan(0);
    for (const frame of frames) {
      expect(frame.length).toBe(7);
      expect(frame[0].length).toBe(7);
      for (const v of frame.flat()) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  test('loader frames traverse perimeter', () => {
    const frames = generateLoaderFrames(5, 6);
    // Perimeter = 6 + 4 + 5 + 3 = 18
    expect(frames.length).toBe(18);
  });
});

