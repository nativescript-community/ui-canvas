import { DrawingCanvas } from '../DrawingCanvas';

const DrawingCanvasPlugin = {
    install(Vue: any, _options?: any) {
        Vue.registerElement('DrawingCanvas', () => DrawingCanvas);
    }
};

export default DrawingCanvasPlugin;
