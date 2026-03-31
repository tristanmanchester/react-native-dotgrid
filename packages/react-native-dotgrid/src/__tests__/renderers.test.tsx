import React from 'react';
import { render } from '@testing-library/react';

import { Matrix } from '../Matrix';

describe('renderer startup smoke tests', () => {
  test('default Skia renderer mounts without throwing', () => {
    expect(() =>
      render(
        <Matrix
          rows={3}
          cols={3}
          pattern={[
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1]
          ]}
        />
      )
    ).not.toThrow();
  });

  test('SVG renderer mounts when selected explicitly', () => {
    expect(() =>
      render(
        <Matrix
          rows={3}
          cols={3}
          renderer="svg"
          pattern={[
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1]
          ]}
        />
      )
    ).not.toThrow();
  });
});
