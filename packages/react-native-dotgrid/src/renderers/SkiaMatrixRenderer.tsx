import {
  Canvas,
  Picture,
  Skia,
  createPicture,
  type SkCanvas,
  type SkPaint
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';

import { parseColorChannels } from '../colorUtils';
import type { PackedFrame, RgbChannels } from '../internalTypes';
import {
  computeDotOpacity,
  getPackedFrameAt,
  getPackedFrameValue,
  rgbaFromChannels
} from '../workletUtils';

import type { RendererCommonProps } from './types';
import { useRendererFrameState } from './useRendererFrameState';

const drawPackedFrame = (
  canvas: SkCanvas,
  paint: SkPaint,
  dots: RendererCommonProps['dots'],
  frame: PackedFrame,
  brightness: number,
  tint: RgbChannels
) => {
  'worklet';

  for (const dot of dots) {
    const value = getPackedFrameValue(frame, dot.index);
    const alpha = computeDotOpacity(value, brightness);

    if (alpha <= 0) {
      continue;
    }

    paint.setColor(Skia.Color(rgbaFromChannels(tint, alpha)));
    canvas.drawCircle(dot.cx, dot.cy, dot.r, paint);
  }
};

export const SkiaMatrixRenderer: React.FC<RendererCommonProps> = (props) => {
  const { width, height, dots, palette, brightness, frames, isStatic } = props;
  const { frameIndex, framesSV, brightnessSV } = useRendererFrameState(props);
  const tint = useMemo(() => parseColorChannels(palette.on), [palette.on]);

  const backgroundPicture = useMemo(
    () =>
      createPicture((canvas) => {
        'worklet';

        const paint = Skia.Paint();
        paint.setAntiAlias(true);
        paint.setColor(Skia.Color(palette.off));

        for (const dot of dots) {
          canvas.drawCircle(dot.cx, dot.cy, dot.r, paint);
        }
      }, { width, height }),
    [dots, height, palette.off, width]
  );

  const staticPicture = useMemo(
    () =>
      createPicture((canvas) => {
        'worklet';

        const paint = Skia.Paint();
        paint.setAntiAlias(true);

        drawPackedFrame(canvas, paint, dots, frames[0] ?? [], brightness, tint);
      }, { width, height }),
    [brightness, dots, frames, height, tint, width]
  );

  const activePicture = useDerivedValue(() => {
    const frame = getPackedFrameAt(framesSV.value, frameIndex.value);

    return createPicture((canvas) => {
      'worklet';

      const paint = Skia.Paint();
      paint.setAntiAlias(true);

      drawPackedFrame(canvas, paint, dots, frame, brightnessSV.value, tint);
    }, { width, height });
  }, [dots, height, tint, width]);

  return (
    <Canvas style={{ width, height }}>
      <Picture picture={backgroundPicture} />
      <Picture picture={isStatic ? staticPicture : activePicture} />
    </Canvas>
  );
};
