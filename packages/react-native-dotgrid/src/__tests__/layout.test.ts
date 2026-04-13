import { createDotLayout, getMatrixAxisSize, normaliseGridDimension } from '../layout';

describe('layout', () => {
  test('normaliseGridDimension clamps invalid values to zero', () => {
    expect(normaliseGridDimension(Infinity)).toBe(0);
    expect(normaliseGridDimension(Number.NaN)).toBe(0);
    expect(normaliseGridDimension(-5)).toBe(0);
    expect(normaliseGridDimension(2.8)).toBe(2);
  });

  test('getMatrixAxisSize returns zero for invalid dimensions', () => {
    expect(getMatrixAxisSize(Infinity, 10, 2)).toBe(0);
    expect(getMatrixAxisSize(0, 10, 2)).toBe(0);
  });

  test('createDotLayout returns an empty array for invalid dimensions', () => {
    expect(createDotLayout(Infinity, 3, 10, 2)).toEqual([]);
    expect(createDotLayout(3, Infinity, 10, 2)).toEqual([]);
    expect(createDotLayout(3.8, 2.2, 10, 2)).toHaveLength(6);
  });
});
