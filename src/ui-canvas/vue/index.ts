const Plugin = {
    install(Vue) {
        Vue.registerElement('CanvasView', () => require('../index').CanvasView, {});
        Vue.registerElement('Rectangle', () => require('../shapes/rectangle').default, {});
        Vue.registerElement('Arc', () => require('../shapes/arc').default, {});
        Vue.registerElement('Text', () => require('../shapes/text').default, {});
        Vue.registerElement('Line', () => require('../shapes/line').default, {});
        Vue.registerElement('Circle', () => require('../shapes/circle').default, {});
    }
};

export default Plugin;
