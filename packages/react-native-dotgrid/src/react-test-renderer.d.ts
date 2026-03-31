declare module 'react-test-renderer' {
  import type { ReactElement } from 'react';

  export type ReactTestRenderer = {
    update(element: ReactElement): void;
    unmount(): void;
    toJSON(): unknown;
    root: unknown;
  };

  export function create(element: ReactElement): ReactTestRenderer;
  export function act(callback: () => void): void;

  const renderer: {
    create: typeof create;
    act: typeof act;
  };

  export default renderer;
}
