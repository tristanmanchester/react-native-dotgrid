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

export const createDotLayout = (rows: number, cols: number, size: number, gap: number): LayoutDot[] => {
  const radius = size / 2;
  const dots: LayoutDot[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = col * (size + gap);
      const y = row * (size + gap);

      dots.push({
        key: `d-${row}-${col}`,
        index: row * cols + col,
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
