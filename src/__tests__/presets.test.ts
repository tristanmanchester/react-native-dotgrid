import {
  digits,
  empty,
  generateLoaderFrames,
  generateWaveFrames,
  generatePulseFrames,
  generateSnakeFrames,
  chevronLeft,
  chevronRight
} from '../presets';

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

  test('pulse frames keep values within range', () => {
    const frames = generatePulseFrames(3, 3, 8);
    expect(frames.length).toBe(8);
    for (const f of frames) {
      for (const v of f.flat()) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  test('snake frames visit each cell once with tail', () => {
    const rows = 3;
    const cols = 4;
    const tail = 3;
    const frames = generateSnakeFrames(rows, cols, tail);
    expect(frames.length).toBe(rows * cols);
    const seen = new Set<string>();
    for (let i = 0; i < frames.length; i += 1) {
      const f = frames[i];
      let nonZero = 0;
      let head = '';
      let maxVal = -1;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const v = f[r][c];
          if (v > 0) {
            nonZero += 1;
            if (v > maxVal) {
              maxVal = v;
              head = `${r}-${c}`;
            }
          }
        }
      }
      expect(nonZero).toBeGreaterThanOrEqual(1);
      expect(nonZero).toBeLessThanOrEqual(tail);
      seen.add(head);
    }
    expect(seen.size).toBe(rows * cols);
  });

  test('chevrons shape', () => {
    const l = chevronLeft(7, 7);
    const r = chevronRight(7, 7);
    expect(l.length).toBe(7);
    expect(l[0].length).toBe(7);
    expect(r.length).toBe(7);
    expect(r[0].length).toBe(7);
  });
});
