import React from 'react';
import { render } from '@testing-library/react';

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
});
