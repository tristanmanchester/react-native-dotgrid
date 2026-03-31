import type { RgbChannels } from './workletUtils';

const DEFAULT_ACTIVE_TINT: RgbChannels = {
  r: 18,
  g: 244,
  b: 90
};

const parseHexColor = (value: string): RgbChannels | null => {
  const hex = value.slice(1);

  if (hex.length === 3) {
    return {
      r: Number.parseInt(`${hex[0]}${hex[0]}`, 16),
      g: Number.parseInt(`${hex[1]}${hex[1]}`, 16),
      b: Number.parseInt(`${hex[2]}${hex[2]}`, 16)
    };
  }

  if (hex.length === 6 || hex.length === 8) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16)
    };
  }

  return null;
};

const parseRgbColor = (value: string): RgbChannels | null => {
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    return null;
  }

  const [r, g, b] = match[1]
    .split(',')
    .slice(0, 3)
    .map((part) => Number.parseFloat(part.trim()));

  if ([r, g, b].some((component) => Number.isNaN(component))) {
    return null;
  }

  return { r, g, b };
};

export const parseColorChannels = (value: string): RgbChannels => {
  const parsed = value.startsWith('#') ? parseHexColor(value) : parseRgbColor(value);

  return parsed ?? DEFAULT_ACTIVE_TINT;
};
