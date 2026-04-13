import React from 'react';
import { render } from '@testing-library/react';

const scheduledCallbacks: Array<{ fn: (...args: unknown[]) => void; args: unknown[] }> = [];
let animatedReactionCallback:
  | ((index: number, previous: number | null) => void)
  | null = null;

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: (...args: unknown[]) => void, ...args: unknown[]) => {
    scheduledCallbacks.push({ fn, args });
  }
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');

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
    createAnimatedComponent: (Component: React.ComponentType<any>) => Component
  };
});

import { useMatrixAnimationDriver } from '../useMatrixAnimationDriver';

const DriverProbe: React.FC<{
  autoplay: boolean;
  fps: number;
  frameCount: number;
  loop: boolean;
  mode: 'default' | 'vu';
  onFrame?: (index: number) => void;
  paused?: boolean;
}> = (props) => {
  useMatrixAnimationDriver(props);
  return null;
};

describe('useMatrixAnimationDriver race handling', () => {
  beforeEach(() => {
    scheduledCallbacks.length = 0;
    animatedReactionCallback = null;
  });

  test('ignores a stale queued frame callback after reset', () => {
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
        paused
      />
    );

    expect(onFrame).toHaveBeenCalledTimes(1);
    expect(onFrame).toHaveBeenLastCalledWith(0);
    onFrame.mockClear();

    const staleCallback = scheduledCallbacks.shift();
    staleCallback?.fn(...(staleCallback?.args ?? []));

    expect(onFrame).not.toHaveBeenCalled();
  });
});
