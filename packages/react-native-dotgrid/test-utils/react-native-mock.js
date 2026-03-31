const React = require('react');

const select = (options) => {
  if (options == null) {
    return undefined;
  }
  if (Object.prototype.hasOwnProperty.call(options, 'test')) {
    return options.test;
  }
  if (Object.prototype.hasOwnProperty.call(options, 'default')) {
    return options.default;
  }
  if (Object.prototype.hasOwnProperty.call(options, 'ios')) {
    return options.ios;
  }
  if (Object.prototype.hasOwnProperty.call(options, 'android')) {
    return options.android;
  }
  return undefined;
};

const createComponent = (tagName) =>
  React.forwardRef(({ accessible, accessibilityRole, accessibilityLabel, ...props }, ref) =>
    React.createElement(tagName, { ...props, ref }, props.children)
  );

module.exports = {
  View: createComponent('div'),
  Text: createComponent('span'),
  ScrollView: createComponent('div'),
  SafeAreaView: createComponent('div'),
  Pressable: createComponent('button'),
  Platform: {
    OS: 'test',
    select
  },
  StyleSheet: {
    create: (styles) => styles
  },
  AccessibilityInfo: {
    announceForAccessibility: () => {}
  }
};
