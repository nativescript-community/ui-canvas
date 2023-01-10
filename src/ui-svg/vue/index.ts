import { CanvasSVG, SVG, SVGView } from '..';

const CanvasLabelPlugin = {
    install(Vue, options) {
        Vue.registerElement('CanvasSVG', () => CanvasSVG);
        Vue.registerElement('SVGView', () => SVGView);
        Vue.registerElement('CSVG', () => SVG);
    },
};

export default CanvasLabelPlugin;
