module.exports = {
  scheduleOnRN: (fn, ...args) => {
    if (typeof fn === 'function') {
      fn(...args);
    }
  },
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn
};
