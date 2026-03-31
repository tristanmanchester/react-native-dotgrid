import { compileFrames, createVuPackedFrame, packFrame } from '../frameCompiler';

describe('frameCompiler', () => {
  test('packFrame flattens row-major values', () => {
    const packed = packFrame(
      [
        [1, 0.5],
        [0.25, 0]
      ],
      2,
      2
    );

    expect(Array.from(packed)).toEqual([1, 0.5, 0.25, 0]);
  });

  test('compileFrames prefers pattern in default mode', () => {
    const compiled = compileFrames({
      rows: 2,
      cols: 2,
      mode: 'default',
      pattern: [
        [1, 0],
        [0, 1]
      ],
      frames: [
        [
          [0, 0],
          [0, 0]
        ]
      ]
    });

    expect(compiled.frameCount).toBe(1);
    expect(Array.from(compiled.frames[0])).toEqual([1, 0, 0, 1]);
    expect(compiled.isStatic).toBe(true);
  });

  test('compileFrames preserves animation sequences', () => {
    const compiled = compileFrames({
      rows: 1,
      cols: 3,
      mode: 'default',
      frames: [
        [[1, 0, 0]],
        [[0, 1, 0]],
        [[0, 0, 1]]
      ]
    });

    expect(compiled.frameCount).toBe(3);
    expect(Array.from(compiled.frames[1])).toEqual([0, 1, 0]);
    expect(compiled.isStatic).toBe(false);
  });

  test('createVuPackedFrame lights from the bottom', () => {
    const packed = createVuPackedFrame(3, 2, [1, 0.33]);

    expect(Array.from(packed)).toEqual([
      1,
      0,
      1,
      0,
      1,
      0.665
    ]);
  });
});
