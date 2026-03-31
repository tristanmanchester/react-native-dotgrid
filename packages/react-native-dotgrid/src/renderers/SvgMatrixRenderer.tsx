import React from 'react';

import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import {
  computeDotOpacity,
  getPackedFrameAt,
  getPackedFrameValue
} from '../workletUtils';
import type { AnimatedFrameState, RendererCommonProps } from './types';
import { useRendererFrameState } from './useRendererFrameState';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type AnimatedDotProps = {
  index: number;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  animatedState: AnimatedFrameState;
};

const AnimatedDot: React.FC<AnimatedDotProps> = ({
  index,
  cx,
  cy,
  r,
  fill,
  animatedState
}) => {
  const { framesSV, frameIndex, brightnessSV } = animatedState;

  const animatedProps = useAnimatedProps(() => {
    'worklet';

    const frame = getPackedFrameAt(framesSV.value, frameIndex.value);
    const value = getPackedFrameValue(frame, index);

    return {
      opacity: computeDotOpacity(value, brightnessSV.value)
    } as const;
  }, [index]);

  return <AnimatedCircle cx={cx} cy={cy} r={r} fill={fill} animatedProps={animatedProps} opacity={0} />;
};

export const SvgMatrixRenderer: React.FC<RendererCommonProps> = (props) => {
  const { width, height, dots, palette, brightness, frames, isStatic } = props;
  const animatedState = useRendererFrameState(props);
  const firstFrame = frames[0] ?? [];

  return (
    <Svg width={width} height={height}>
      {dots.map((dot) => (
        <Circle key={`off-${dot.key}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill={palette.off} />
      ))}
      {isStatic
        ? dots.map((dot) => (
            <Circle
              key={`on-${dot.key}`}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={palette.on}
              opacity={computeDotOpacity(firstFrame[dot.index] ?? 0, brightness)}
            />
          ))
        : dots.map((dot) => (
            <AnimatedDot
              key={`on-${dot.key}`}
              index={dot.index}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={palette.on}
              animatedState={animatedState}
            />
          ))}
    </Svg>
  );
};
