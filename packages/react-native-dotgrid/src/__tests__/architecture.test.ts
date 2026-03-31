import fs from 'node:fs';
import path from 'node:path';

const readSource = (relativePath: string) =>
  fs.readFileSync(path.resolve(__dirname, '..', relativePath), 'utf8');

describe('renderer architecture guardrails', () => {
  test('worklet-bearing renderer files do not import generic utils', () => {
    const files = [
      'renderers/SkiaMatrixRenderer.tsx',
      'renderers/SvgMatrixRenderer.tsx',
      'useMatrixAnimationDriver.ts'
    ];

    for (const file of files) {
      const source = readSource(file);
      expect(source).not.toMatch(/from ['"]\.\.?\/utils['"]/);
    }
  });

  test('Matrix keeps the SVG renderer lazily required', () => {
    const source = readSource('Matrix.tsx');
    expect(source).toContain("require('./renderers/SvgMatrixRenderer')");
  });
});
