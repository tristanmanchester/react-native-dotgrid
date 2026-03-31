const React = require('react');

const createComponent = (name) =>
  React.forwardRef((props, ref) =>
    React.createElement(name.toLowerCase(), { ...props, ref }, props.children)
  );

const createMutableBuffer = (size, factory) =>
  Array.from({ length: size }, (_, index) => factory(index));

const createColor = (value = 'transparent') => ({
  value,
  set(next) {
    this.value = next;
  }
});

const createTransform = () => ({
  args: [1, 0, 0, 0],
  set(...args) {
    this.args = args;
  }
});

module.exports = {
  Canvas: createComponent('canvas'),
  Picture: createComponent('div'),
  createPicture: (draw, size) => {
    const canvas = {
      drawCircle: () => {}
    };

    if (typeof draw === 'function') {
      draw(canvas);
    }

    return { draw, size };
  },
  Skia: {
    Color: (value) => value,
    Paint: () => ({
      setAntiAlias: () => {},
      setColor: () => {}
    })
  }
};
