import { parseColorChannels } from '../colorUtils';

describe('colorUtils', () => {
  test('parses valid 6-digit hex colors', () => {
    expect(parseColorChannels('#12f45a')).toEqual({ r: 18, g: 244, b: 90 });
  });

  test('falls back to the default active tint for invalid 6-digit hex characters', () => {
    expect(parseColorChannels('#FFOOOO')).toEqual({ r: 18, g: 244, b: 90 });
  });

  test('falls back to the default active tint for invalid 3-digit hex characters', () => {
    expect(parseColorChannels('#G0G')).toEqual({ r: 18, g: 244, b: 90 });
  });

  test('falls back to the default active tint for invalid rgb channel values', () => {
    expect(parseColorChannels('rgb(255, nope, 0)')).toEqual({ r: 18, g: 244, b: 90 });
  });

  test('parses rgb colors with whitespace', () => {
    expect(parseColorChannels('rgb( 255 , 128 , 64 )')).toEqual({ r: 255, g: 128, b: 64 });
  });
});
