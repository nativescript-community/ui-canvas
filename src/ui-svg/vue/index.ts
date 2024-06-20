import { SVGView } from '..';

const SVGPlugin = {
    install(Vue, options) {
        Vue.registerElement('SVGView', () => SVGView);
    }
};

export default SVGPlugin;
