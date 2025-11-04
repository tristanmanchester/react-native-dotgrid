const createComponent = (name) => name;

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
