import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  Easing,
  cancelAnimation,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { getFrameDurationMs } from './math';
import type { MatrixMode } from './types';

type UseMatrixAnimationDriverOptions = {
  autoplay: boolean;
  fps: number;
  frameCount: number;
  loop: boolean;
  mode: MatrixMode;
  onFrame?: (index: number) => void;
  paused?: boolean;
};

export const useMatrixAnimationDriver = ({
  autoplay,
  fps,
  frameCount,
  loop,
  mode,
  onFrame,
  paused
}: UseMatrixAnimationDriverOptions) => {
  const progress = useSharedValue(0);
  const duration = useMemo(() => getFrameDurationMs(fps, frameCount), [fps, frameCount]);
  const onFrameRef = useRef(onFrame);
  const lastReportedFrameRef = useRef<number | null>(null);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  const reportFrame = useCallback((index: number) => {
    if (!onFrameRef.current || lastReportedFrameRef.current === index) {
      return;
    }

    lastReportedFrameRef.current = index;
    onFrameRef.current(index);
  }, []);

  useEffect(() => {
    const shouldAnimate = autoplay && !paused && frameCount > 1 && duration > 0 && mode !== 'vu';

    cancelAnimation(progress);
    progress.value = 0;

    if (shouldAnimate) {
      progress.value = withRepeat(
        withTiming(frameCount, { duration, easing: Easing.linear }),
        loop ? -1 : 1,
        false
      );
    }

    return () => {
      cancelAnimation(progress);
    };
  }, [autoplay, duration, frameCount, loop, mode, paused, progress]);

  const frameIndex = useDerivedValue(() => {
    if (frameCount <= 1) {
      return 0;
    }

    const index = Math.floor(progress.value) % frameCount;
    return index < 0 ? 0 : index;
  }, [frameCount]);

  useAnimatedReaction(
    () => frameIndex.value,
    (index, previous) => {
      if (onFrameRef.current && index !== previous) {
        scheduleOnRN(reportFrame, index);
      }
    },
    [reportFrame]
  );

  useEffect(() => {
    lastReportedFrameRef.current = null;
    reportFrame(0);
  }, [autoplay, frameCount, mode, paused, reportFrame]);

  return {
    frameIndex
  };
};
