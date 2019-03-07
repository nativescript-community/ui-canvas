const Plugin = {
    install(Vue) {
        Vue.registerElement('CanvasView', () => require('../canvas').CanvasView, {});
        Vue.registerElement('Shapes', () => require('../canvas').Shapes, {});
        Vue.registerElement('Rectangle', () => require('../shapes/rectangle').default, {});
        Vue.registerElement('Arc', () => require('../shapes/arc').default, {});
        Vue.registerElement('Text', () => require('../shapes/text').default, {});
    }
};

export default Plugin;
