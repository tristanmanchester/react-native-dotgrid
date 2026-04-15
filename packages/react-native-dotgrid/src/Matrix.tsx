import React, { useEffect, useMemo, useRef } from 'react';
import { View, AccessibilityInfo } from 'react-native';

import { compileFrames } from './frameCompiler';
import { createDotLayout, getMatrixAxisSize, normaliseGridDimension } from './layout';
import { SkiaMatrixRenderer } from './renderers/SkiaMatrixRenderer';
import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_FPS,
  DEFAULT_GAP,
  DEFAULT_PALETTE,
  DEFAULT_RENDERER,
  DEFAULT_SIZE,
  MatrixProps
} from './types';

export const Matrix: React.FC<MatrixProps> = ({
  rows,
  cols,
  renderer = DEFAULT_RENDERER,
  pattern,
  frames,
  fps = DEFAULT_FPS,
  gap = DEFAULT_GAP,
  size = DEFAULT_SIZE,
  palette = DEFAULT_PALETTE,
  brightness = DEFAULT_BRIGHTNESS,
  autoplay = true,
  loop = true,
  mode = 'default',
  levels,
  onFrame,
  accessibilityLabel,
  ariaLabel,
  presetLabel,
  paused,
  style,
  ...rest
}) => {
  const safeRows = normaliseGridDimension(rows);
  const safeCols = normaliseGridDimension(cols);
  const width = getMatrixAxisSize(safeCols, size, gap);
  const height = getMatrixAxisSize(safeRows, size, gap);
  const dots = useMemo(() => createDotLayout(safeRows, safeCols, size, gap), [safeRows, safeCols, size, gap]);
  const compiled = useMemo(
    () => compileFrames({ pattern, frames, rows: safeRows, cols: safeCols, mode, levels }),
    [pattern, frames, safeRows, safeCols, mode, levels]
  );

  const label = ariaLabel || accessibilityLabel || presetLabel || 'Dot matrix display';
  const initialLabelRef = useRef(label);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility?.(initialLabelRef.current);
  }, []);

  const rendererProps = {
    rows: safeRows,
    cols: safeCols,
    width,
    height,
    size,
    gap,
    dots,
    palette,
    brightness,
    fps,
    autoplay,
    loop,
    paused,
    mode,
    onFrame,
    frameCount: compiled.frameCount,
    isStatic: compiled.isStatic,
    frames: compiled.frames
  };

  const rendererNode =
    renderer === 'svg'
      ? (() => {
          const { SvgMatrixRenderer } = require('./renderers/SvgMatrixRenderer') as typeof import('./renderers/SvgMatrixRenderer');
          return <SvgMatrixRenderer {...rendererProps} />;
        })()
      : <SkiaMatrixRenderer {...rendererProps} />;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[{ backgroundColor: palette.background }, style]}
      {...rest}
    >
      {rendererNode}
    </View>
  );
};
