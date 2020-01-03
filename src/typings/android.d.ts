declare module com {
    export module akylas {
        export module canvas {
            export class Canvas extends globalAndroid.graphics.Canvas {}
            export class CanvasWrapper extends globalAndroid.graphics.Canvas {
                canvas: globalAndroid.graphics.Canvas;
                constructor(canvas: globalAndroid.graphics.Canvas);
            }
            export class Matrix extends globalAndroid.graphics.Matrix {}
            export class CanvasView extends globalAndroid.view.View {
                bitmap: globalAndroid.graphics.Bitmap;
                paint: globalAndroid.graphics.Paint;
            }
        }
    }
}
