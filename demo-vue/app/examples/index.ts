import Complex from './Complex.vue';
import Simple from './Simple.vue';
import Animation from './Animation.vue';
import Shapes from './Shapes.vue';

export { Complex, Simple, Animation, Shapes };
export const getExamples = () => {
    return [
        {
            name: 'Complex',
            component: Complex
        },
        {
            name: 'Simple',
            component: Simple
        },
        {
            name: 'Animation',
            component: Animation
        },
        {
            name: 'Shapes',
            component: Shapes
        }
    ];
};
