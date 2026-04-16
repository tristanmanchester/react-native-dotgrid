import { render } from '@testing-library/react';
import React from 'react';

import { useMatrixAnimationDriver } from '../useMatrixAnimationDriver';

type DriverProbeProps = Parameters<typeof useMatrixAnimationDriver>[0];

const DriverProbe: React.FC<DriverProbeProps> = (props) => {
  useMatrixAnimationDriver(props);
  return null;
};

describe('useMatrixAnimationDriver', () => {
  test('reports frame zero once on mount', () => {
    const onFrame = jest.fn();

    render(
      <DriverProbe
        autoplay
        fps={12}
        frameCount={3}
        loop
        mode="default"
        onFrame={onFrame}
      />
    );

    expect(onFrame).toHaveBeenCalledTimes(1);
    expect(onFrame).toHaveBeenCalledWith(0);
  });

  test('re-reports frame zero when playback state resets', () => {
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

    expect(onFrame).toHaveBeenCalledTimes(2);
    expect(onFrame).toHaveBeenNthCalledWith(1, 0);
    expect(onFrame).toHaveBeenNthCalledWith(2, 0);
  });

  test('re-reports frame zero when fps changes', () => {
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

    rerender(
      <DriverProbe
        autoplay
        fps={24}
        frameCount={3}
        loop
        mode="default"
        onFrame={onFrame}
        paused={false}
      />
    );

    expect(onFrame).toHaveBeenCalledTimes(2);
    expect(onFrame).toHaveBeenNthCalledWith(1, 0);
    expect(onFrame).toHaveBeenNthCalledWith(2, 0);
  });

  test('re-reports frame zero when loop changes', () => {
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

    rerender(
      <DriverProbe
        autoplay
        fps={12}
        frameCount={3}
        loop={false}
        mode="default"
        onFrame={onFrame}
        paused={false}
      />
    );

    expect(onFrame).toHaveBeenCalledTimes(2);
    expect(onFrame).toHaveBeenNthCalledWith(1, 0);
    expect(onFrame).toHaveBeenNthCalledWith(2, 0);
  });
});
