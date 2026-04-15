import path from 'path';

const {
  parseCliArgs,
  resolveOutputDir
} = require('../../scripts/generate-demos.js') as {
  parseCliArgs: (args: string[]) => { target: string; formats: string[] };
  resolveOutputDir: (baseDir?: string) => string;
};

describe('generate-demos script helpers', () => {
  test('defaults the target to all when only format flags are provided', () => {
    expect(parseCliArgs(['--gif'])).toEqual({
      target: 'all',
      formats: ['gif']
    });
  });

  test('reads the first positional argument as the target', () => {
    expect(parseCliArgs(['--webp', 'snake'])).toEqual({
      target: 'snake',
      formats: ['webp']
    });
  });

  test('resolves demo output to the repository root demos directory', () => {
    const scriptDir = path.resolve(__dirname, '..', '..', 'scripts');
    const expected = path.resolve(__dirname, '..', '..', '..', '..', 'demos');

    expect(resolveOutputDir(scriptDir)).toBe(expected);
  });
});
