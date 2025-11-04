const sharedValue = (initial) => ({ value: initial });

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
  Easing: {},
  Extrapolation: {},
  createAnimatedComponent: (Comp) => Comp
};

module.exports = ReanimatedMock;
