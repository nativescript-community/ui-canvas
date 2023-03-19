import Vue from 'nativescript-vue';
import Simple from './Simple.vue';
import Animation from './Animation.vue';
import Shapes from './Shapes.vue';
import Image from './Image.vue';
import Complex from './Complex.vue';
import SVG from './SVG.vue';
import CanvasPlugin from '@nativescript-community/ui-canvas/vue';
import SVGPlugin from '@nativescript-community/ui-svg/vue';

export function installPlugin() {
    Vue.use(CanvasPlugin);
    Vue.use(SVGPlugin);
}

export const demos = [
    { name: 'Simple', path: 'Simple', component: Simple },
    { name: 'Animation', path: 'Animation', component: Animation },
    { name: 'Shapes', path: 'Shapes', component: Shapes },
    { name: 'Image', path: 'Image', component: Image },
    { name: 'Complex', path: 'Complex', component: Complex },
    { name: 'SVG', path: 'SVG', component: SVG }
];
