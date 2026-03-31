const React = require('react');

const createComponent = (name) => {
  return React.forwardRef((props, ref) =>
    React.createElement(name.toLowerCase(), { ...props, ref }, props.children)
  );
};

module.exports = new Proxy(
  {},
  {
    get: (_target, key) => {
      if (key === '__esModule') {
        return true;
      }
      if (key === 'default') {
        return createComponent('svg');
      }
      return createComponent(String(key));
    }
  }
);
