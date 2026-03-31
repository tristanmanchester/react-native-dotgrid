import {
  clampForRender,
  computeDotOpacity,
  getPackedFrameAt,
  getPackedFrameValue,
  resolveFrameIndex,
  toRgbaString
} from '../workletUtils';

describe('workletUtils', () => {
  test('clampForRender enforces bounds', () => {
    expect(clampForRender(-1)).toBe(0);
    expect(clampForRender(0.25)).toBe(0.25);
    expect(clampForRender(2)).toBe(1);
  });

  test('resolveFrameIndex clamps to available frames', () => {
    expect(resolveFrameIndex(-1, 3)).toBe(0);
    expect(resolveFrameIndex(1, 3)).toBe(1);
    expect(resolveFrameIndex(99, 3)).toBe(2);
    expect(resolveFrameIndex(0, 0)).toBe(0);
  });

  test('getPackedFrameAt returns the nearest valid frame', () => {
    const frames = [[1, 0], [0, 1]];

    expect(getPackedFrameAt(frames, 0)).toEqual([1, 0]);
    expect(getPackedFrameAt(frames, 5)).toEqual([0, 1]);
    expect(getPackedFrameAt([], 0)).toEqual([]);
  });

  test('getPackedFrameValue falls back to 0', () => {
    expect(getPackedFrameValue([0.25, 0.5], 1)).toBe(0.5);
    expect(getPackedFrameValue([0.25, 0.5], 9)).toBe(0);
  });

  test('computeDotOpacity multiplies brightness safely', () => {
    expect(computeDotOpacity(0.5, 0.5)).toBe(0.25);
    expect(computeDotOpacity(2, 0.75)).toBe(1);
    expect(computeDotOpacity(0.5, -1)).toBe(0);
  });

  test('toRgbaString produces a clamped rgba color', () => {
    expect(toRgbaString(18, 244, 90, 2)).toBe('rgba(18, 244, 90, 1)');
    expect(toRgbaString(18, 244, 90, -1)).toBe('rgba(18, 244, 90, 0)');
  });
});
