const React = require('react');

const sharedValue = (initial) => ({ value: initial });

const createAnimatedComponent = (Component) => {
  // If it's already a React component, return it
  if (typeof Component === 'function') {
    return Component;
  }

  // Otherwise, wrap it in a forwardRef component
  return React.forwardRef((props, ref) => {
    return React.createElement(Component, { ...props, ref });
  });
};

const ReanimatedMock = {
  useSharedValue: sharedValue,
  useAnimatedStyle: (updater) => ({ __mocked: true, updater }),
  useAnimatedProps: (updater) => updater(),
  useDerivedValue: (factory) => ({ value: factory() }),
  useAnimatedReaction: () => {},
  withTiming: (value) => value,
  withRepeat: (value) => value,
  cancelAnimation: () => {},
  runOnJS: (fn) => fn,
  Easing: {
    linear: (x) => x,
    ease: (x) => x,
    quad: (x) => x,
    cubic: (x) => x
  },
  Extrapolation: {},
  createAnimatedComponent
};

ReanimatedMock.default = ReanimatedMock;

module.exports = ReanimatedMock;
