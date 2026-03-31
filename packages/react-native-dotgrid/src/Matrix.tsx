import React, { useEffect, useMemo } from 'react';
import { View, AccessibilityInfo } from 'react-native';

import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_FPS,
  DEFAULT_GAP,
  DEFAULT_PALETTE,
  DEFAULT_RENDERER,
  DEFAULT_SIZE,
  MatrixProps
} from './types';
import { compileFrames } from './frameCompiler';
import { createDotLayout } from './layout';
import { SkiaMatrixRenderer } from './renderers/SkiaMatrixRenderer';

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
  const width = cols * size + (cols - 1) * gap;
  const height = rows * size + (rows - 1) * gap;
  const dots = useMemo(() => createDotLayout(rows, cols, size, gap), [rows, cols, size, gap]);
  const compiled = useMemo(
    () => compileFrames({ pattern, frames, rows, cols, mode, levels }),
    [pattern, frames, rows, cols, mode, levels]
  );

  const label = ariaLabel || accessibilityLabel || presetLabel || 'Dot matrix display';

  useEffect(() => {
    // Announce for screen readers on initial mount
    AccessibilityInfo.announceForAccessibility?.(label);
  }, [label]);

  const rendererProps = {
    rows,
    cols,
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

export default Matrix;
