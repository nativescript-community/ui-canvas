import Vue from 'nativescript-vue';
import Simple from './Simple.vue';
import Animation from './Animation.vue';
import Shapes from './Shapes.vue';
import Image from './Image.vue';
import Complex from './Complex.vue';
import SVG from './SVG.vue';
import CanvasLabel from './CanvasLabel.vue';
import CanvasPlugin from '@nativescript-community/ui-canvas/vue';
import CanvasLabelPlugin from '@nativescript-community/ui-canvaslabel/vue';
import CollectionViewPlugin from '@nativescript-community/ui-collectionview/vue';
import SVGPlugin from '@nativescript-community/ui-svg/vue';

export function installPlugin() {
    Vue.use(CanvasPlugin);
    Vue.use(SVGPlugin);
    Vue.use(CanvasLabelPlugin);
    Vue.use(CollectionViewPlugin);
}

export const demos = [
    { name: 'Simple', path: 'Simple', component: Simple },
    { name: 'Animation', path: 'Animation', component: Animation },
    { name: 'Shapes', path: 'Shapes', component: Shapes },
    { name: 'Image', path: 'Image', component: Image },
    { name: 'Complex', path: 'Complex', component: Complex },
    { name: 'SVG', path: 'SVG', component: SVG },
    { name: 'CanvasLabel', path: 'CanvasLabel', component: CanvasLabel }
];
