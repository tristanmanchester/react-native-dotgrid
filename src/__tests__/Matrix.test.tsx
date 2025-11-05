import { Matrix } from '../Matrix';
import * as presets from '../presets';
import * as types from '../types';

describe('Matrix Component', () => {
  describe('Exports', () => {
    test('Matrix component is exported', () => {
      expect(Matrix).toBeDefined();
      expect(typeof Matrix).toBe('function');
    });

    test('Matrix has displayName or name', () => {
      expect(Matrix.displayName || Matrix.name).toBeTruthy();
    });
  });

  describe('Type Exports', () => {
    test('Frame type is available', () => {
      const frame: types.Frame = [[1, 0], [0, 1]];
      expect(frame.length).toBe(2);
      expect(frame[0].length).toBe(2);
    });

    test('MatrixMode type values', () => {
      const mode1: types.MatrixMode = 'default';
      const mode2: types.MatrixMode = 'vu';
      expect(mode1).toBe('default');
      expect(mode2).toBe('vu');
    });

    test('Palette type structure', () => {
      const palette: types.Palette = {
        on: '#fff',
        off: '#000',
        background: '#222'
      };
      expect(palette.on).toBe('#fff');
      expect(palette.off).toBe('#000');
      expect(palette.background).toBe('#222');
    });

    test('DEFAULT constants are exported', () => {
      expect(types.DEFAULT_FPS).toBe(12);
      expect(types.DEFAULT_SIZE).toBe(10);
      expect(types.DEFAULT_GAP).toBe(2);
      expect(types.DEFAULT_BRIGHTNESS).toBe(1);
      expect(types.DEFAULT_PALETTE).toBeDefined();
      expect(types.DEFAULT_PALETTE.on).toBeDefined();
      expect(types.DEFAULT_PALETTE.off).toBeDefined();
    });
  });

  describe('Preset Exports', () => {
    test('digits preset is exported as array', () => {
      expect(presets.digits).toBeDefined();
      expect(Array.isArray(presets.digits)).toBe(true);
      expect(presets.digits.length).toBe(10);
    });

    test('pre-generated frame constants are exported', () => {
      expect(presets.waveFrames).toBeDefined();
      expect(Array.isArray(presets.waveFrames)).toBe(true);

      expect(presets.loaderFrames).toBeDefined();
      expect(Array.isArray(presets.loaderFrames)).toBe(true);

      expect(presets.pulseFrames).toBeDefined();
      expect(Array.isArray(presets.pulseFrames)).toBe(true);

      expect(presets.snakeFrames).toBeDefined();
      expect(Array.isArray(presets.snakeFrames)).toBe(true);

      expect(presets.rippleFrames).toBeDefined();
      expect(Array.isArray(presets.rippleFrames)).toBe(true);
    });

    test('chevron frame constants are exported', () => {
      expect(presets.chevronLeftFrame).toBeDefined();
      expect(Array.isArray(presets.chevronLeftFrame)).toBe(true);

      expect(presets.chevronRightFrame).toBeDefined();
      expect(Array.isArray(presets.chevronRightFrame)).toBe(true);
    });

    test('generator functions are exported', () => {
      expect(typeof presets.generateWaveFrames).toBe('function');
      expect(typeof presets.generateLoaderFrames).toBe('function');
      expect(typeof presets.generatePulseFrames).toBe('function');
      expect(typeof presets.generateSnakeFrames).toBe('function');
      expect(typeof presets.generateRippleFrames).toBe('function');
    });

    test('convenience function aliases are exported', () => {
      expect(typeof presets.wave).toBe('function');
      expect(typeof presets.loader).toBe('function');
      expect(typeof presets.pulse).toBe('function');
      expect(typeof presets.snake).toBe('function');
      expect(typeof presets.ripple).toBe('function');
    });

    test('chevron functions are exported', () => {
      expect(typeof presets.chevronLeft).toBe('function');
      expect(typeof presets.chevronRight).toBe('function');
    });

    test('vu() helper function is exported', () => {
      expect(typeof presets.vu).toBe('function');
    });

    test('empty() function is exported', () => {
      expect(typeof presets.empty).toBe('function');
    });
  });

  describe('Pre-generated Constants - Dimensions', () => {
    test('waveFrames has correct dimensions', () => {
      expect(presets.waveFrames.length).toBe(24);
      expect(presets.waveFrames[0].length).toBe(7);
      expect(presets.waveFrames[0][0].length).toBe(7);
    });

    test('loaderFrames has correct dimensions', () => {
      // Loader for 7x7 has perimeter = 7 + 6 + 6 + 5 = 24 frames
      expect(presets.loaderFrames.length).toBeGreaterThan(0);
      expect(presets.loaderFrames[0].length).toBe(7);
      expect(presets.loaderFrames[0][0].length).toBe(7);
    });

    test('pulseFrames has correct dimensions', () => {
      expect(presets.pulseFrames.length).toBe(16);
      expect(presets.pulseFrames[0].length).toBe(7);
      expect(presets.pulseFrames[0][0].length).toBe(7);
    });

    test('snakeFrames has correct dimensions', () => {
      expect(presets.snakeFrames.length).toBe(49); // 7x7
      expect(presets.snakeFrames[0].length).toBe(7);
      expect(presets.snakeFrames[0][0].length).toBe(7);
    });

    test('rippleFrames has correct dimensions', () => {
      expect(presets.rippleFrames.length).toBe(24);
      expect(presets.rippleFrames[0].length).toBe(7);
      expect(presets.rippleFrames[0][0].length).toBe(7);
    });

    test('chevron frames have correct dimensions', () => {
      expect(presets.chevronLeftFrame.length).toBe(7);
      expect(presets.chevronLeftFrame[0].length).toBe(7);

      expect(presets.chevronRightFrame.length).toBe(7);
      expect(presets.chevronRightFrame[0].length).toBe(7);
    });
  });

  describe('API - vu() helper', () => {
    test('vu() returns a Frame', () => {
      const result = presets.vu(5, [0.5, 0.5, 0.5, 0.5, 0.5]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(7); // Default 7 rows
      expect(result[0].length).toBe(5);
    });

    test('vu() handles empty levels', () => {
      const result = presets.vu(5, []);
      expect(result.length).toBe(7);
      expect(result[0].length).toBe(5);
      // All values should be 0
      expect(result.flat().every(v => v === 0)).toBe(true);
    });

    test('vu() with varying levels', () => {
      const result = presets.vu(3, [0, 0.5, 1.0]);
      expect(result.length).toBe(7);
      expect(result[0].length).toBe(3);
      // First column should be all zeros
      expect(result.every(row => row[0] === 0)).toBe(true);
      // Third column should have some lit dots
      const col3Values = result.map(row => row[2]);
      expect(col3Values.some(v => v > 0)).toBe(true);
    });
  });
});
