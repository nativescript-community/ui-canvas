import Vue from 'nativescript-vue';
import Home from './views/Home.vue';

import CanvasPlugin from '@nativescript-community/ui-canvas/vue';
Vue.use(CanvasPlugin);

// for (const comp of getExamples()) {
//     console.log('registering example', comp.component.name);
//     Vue.component(comp.component.name, comp);
// }
Vue.config.silent = true;
Vue.config['debug'] = true;

Vue.config.errorHandler = (e, vm, info) => {
    throw e;
};

Vue.config.warnHandler = function(msg, vm, trace) {
    console.log(msg, new Error().stack);
};
console.log('registering all, ready to start');

new Vue({
    render: h => h('frame', [h(Home)])
}).$start();
