const React = require('react');

const createComponent = (name) => {
  return React.forwardRef((props, ref) =>
    React.createElement(name, { ...props, ref })
  );
};

module.exports = new Proxy(
  {},
  {
    get: (_target, key) => {
      if (key === '__esModule') {
        return false;
      }
      if (key === 'default') {
        return createComponent('Svg');
      }
      return createComponent(String(key));
    }
  }
);
