const Plugin = {
    install(Vue) {
        Vue.registerElement('CanvasView', () => require('../canvas').CanvasView, {});
        Vue.registerElement('Shapes', () => require('../canvas').Shapes, {});
        Vue.registerElement('Rectangle', () => require('../canvas').Rectangle, {});
    }
};

export default Plugin;
