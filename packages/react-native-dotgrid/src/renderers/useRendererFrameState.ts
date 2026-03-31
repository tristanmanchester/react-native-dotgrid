import { useEffect } from 'react';

import { useSharedValue } from 'react-native-reanimated';

import { useMatrixAnimationDriver } from '../useMatrixAnimationDriver';
import type { AnimatedFrameState, RendererCommonProps } from './types';
import { clampForRender } from '../workletUtils';

export const useRendererFrameState = (props: RendererCommonProps): AnimatedFrameState => {
  const { frames, brightness } = props;
  const framesSV = useSharedValue(frames);
  const brightnessSV = useSharedValue(clampForRender(brightness));
  const { frameIndex } = useMatrixAnimationDriver(props);

  useEffect(() => {
    framesSV.value = frames;
  }, [frames, framesSV]);

  useEffect(() => {
    brightnessSV.value = clampForRender(brightness);
  }, [brightness, brightnessSV]);

  return {
    framesSV,
    frameIndex,
    brightnessSV
  };
};
