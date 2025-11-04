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

module.exports = {
  View: 'View',
  Text: 'Text',
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
