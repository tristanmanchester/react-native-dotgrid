import '@testing-library/jest-native/extend-expect';

// React 19's test renderer expects an explicit act-enabled environment.
declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export {};
