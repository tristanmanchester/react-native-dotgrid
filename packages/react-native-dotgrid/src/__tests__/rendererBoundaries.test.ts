import fs from 'fs';
import path from 'path';

const readSource = (relativePath: string) =>
  fs.readFileSync(path.resolve(__dirname, '..', relativePath), 'utf8');

describe('renderer boundaries', () => {
  test.each([
    'renderers/SkiaMatrixRenderer.tsx',
    'renderers/SvgMatrixRenderer.tsx',
    'renderers/useRendererFrameState.ts',
    'useMatrixAnimationDriver.ts'
  ])('%s does not import generic utils', (relativePath) => {
    const source = readSource(relativePath);

    expect(source).not.toMatch(/from ['"]\.\.?\/utils['"]/);
  });

  test('Matrix keeps SVG lazy-loaded', () => {
    const source = readSource('Matrix.tsx');

    expect(source).toMatch(/require\('\.\/renderers\/SvgMatrixRenderer'\)/);
    expect(source).not.toMatch(/from ['"]\.\/renderers\/SvgMatrixRenderer['"]/);
  });
});
