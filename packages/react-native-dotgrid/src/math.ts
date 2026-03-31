export const clamp = (value: number, min = 0, max = 1): number => {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

export const getFrameDurationMs = (fps: number, frameCount: number): number => {
  if (frameCount <= 1) {
    return 0;
  }

  const safeFps = fps > 0 ? fps : 1;
  return (frameCount / safeFps) * 1000;
};
