import { render } from '@testing-library/react';
import React from 'react';

import { useMatrixAnimationDriver } from '../useMatrixAnimationDriver';

type DriverProbeProps = Parameters<typeof useMatrixAnimationDriver>[0];
type ReportFrame = (index: number, generation: number) => void;

const scheduledCallbacks: Array<{ fn: ReportFrame; args: Parameters<ReportFrame> }> = [];
let animatedReactionCallback:
  | ((index: number, previous: number | null) => void)
  | null = null;

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: ReportFrame, ...args: Parameters<ReportFrame>) => {
    scheduledCallbacks.push({ fn, args });
  }
}));

jest.mock('react-native-reanimated', () => {
  const sharedValue = (initial: number) => ({ value: initial });

  return {
    __esModule: true,
    default: {},
    useSharedValue: sharedValue,
    useDerivedValue: (factory: () => number) => ({ value: factory() }),
    useAnimatedReaction: (
      _prepare: () => number,
      react: (index: number, previous: number | null) => void
    ) => {
      animatedReactionCallback = react;
    },
    withTiming: (value: number) => value,
    withRepeat: (value: number) => value,
    cancelAnimation: () => {},
    Easing: {
      linear: (value: number) => value
    },
    useAnimatedStyle: (updater: () => unknown) => ({ __mocked: true, updater }),
    useAnimatedProps: (updater: () => unknown) => updater(),
    createAnimatedComponent: <P,>(Component: React.ComponentType<P>) => Component
  };
});

const DriverProbe: React.FC<DriverProbeProps> = (props) => {
  useMatrixAnimationDriver(props);
  return null;
};

const expectStaleQueuedFrameCallbackIgnoredAfterReset = (
  resetProps: Partial<DriverProbeProps>
) => {
  const onFrame = jest.fn();
  const { rerender } = render(
    <DriverProbe
      autoplay
      fps={12}
      frameCount={3}
      loop
      mode="default"
      onFrame={onFrame}
      paused={false}
    />
  );

  expect(onFrame).toHaveBeenCalledTimes(1);
  expect(onFrame).toHaveBeenLastCalledWith(0);
  onFrame.mockClear();

  animatedReactionCallback?.(2, 1);
  expect(scheduledCallbacks).toHaveLength(1);

  rerender(
    <DriverProbe
      autoplay
      fps={12}
      frameCount={3}
      loop
      mode="default"
      onFrame={onFrame}
      paused={false}
      {...resetProps}
    />
  );

  expect(onFrame).toHaveBeenCalledTimes(1);
  expect(onFrame).toHaveBeenLastCalledWith(0);
  onFrame.mockClear();

  const staleCallback = scheduledCallbacks.shift();
  staleCallback?.fn(...(staleCallback?.args ?? []));

  expect(onFrame).not.toHaveBeenCalled();
};

describe('useMatrixAnimationDriver race handling', () => {
  beforeEach(() => {
    scheduledCallbacks.length = 0;
    animatedReactionCallback = null;
  });

  test('ignores a stale queued frame callback after reset', () => {
    expectStaleQueuedFrameCallbackIgnoredAfterReset({ paused: true });
  });

  test('ignores a stale queued frame callback after fps changes', () => {
    expectStaleQueuedFrameCallbackIgnoredAfterReset({ fps: 24 });
  });

  test('ignores a stale queued frame callback after loop changes', () => {
    expectStaleQueuedFrameCallbackIgnoredAfterReset({ loop: false });
  });
});
