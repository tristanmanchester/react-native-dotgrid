export type LayoutDot = {
  key: string;
  index: number;
  row: number;
  col: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  r: number;
};

export const normaliseGridDimension = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.floor(value);
};

export const getMatrixAxisSize = (count: number, size: number, gap: number): number => {
  const safeCount = normaliseGridDimension(count);

  if (safeCount <= 0) {
    return 0;
  }

  return safeCount * size + (safeCount - 1) * gap;
};

export const createDotLayout = (rows: number, cols: number, size: number, gap: number): LayoutDot[] => {
  const safeRows = normaliseGridDimension(rows);
  const safeCols = normaliseGridDimension(cols);

  if (safeRows <= 0 || safeCols <= 0) {
    return [];
  }

  const radius = size / 2;
  const dots: LayoutDot[] = [];

  for (let row = 0; row < safeRows; row += 1) {
    for (let col = 0; col < safeCols; col += 1) {
      const x = col * (size + gap);
      const y = row * (size + gap);

      dots.push({
        key: `d-${row}-${col}`,
        index: row * safeCols + col,
        row,
        col,
        x,
        y,
        cx: x + radius,
        cy: y + radius,
        r: radius
      });
    }
  }

  return dots;
};
