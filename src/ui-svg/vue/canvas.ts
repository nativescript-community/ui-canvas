import { CanvasSVG, SVG } from '../canvas';

const CanvasSVGPlugin = {
    install(Vue, options) {
        Vue.registerElement('CanvasSVG', () => CanvasSVG);
        Vue.registerElement('CSVG', () => SVG);
    }
};

export default CanvasSVGPlugin;
