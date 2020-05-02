declare module com {
    export module akylas {
        export module canvas {
            export class CanvasPath extends globalAndroid.graphics.Path {
                addLines(points: number[], length?: number, close?: boolean);
                setLines(points: number[], length?: number, close?: boolean);
                addCubicLines(points: number[], length?: number, close?: boolean);
                setCubicLines(points: number[], length?: number, close?: boolean);
            }

            export class CanvasView extends globalAndroid.view.View {
                sizeChangedListener?: SizeChangedListener;
                drawListener?: DrawListener;
            }
            export class SizeChangedListener {
                constructor(impl?: { onSizeChanged(w: number, h: number, oldw: number, oldh: number) });
                onSizeChanged(w: number, h: number, oldw: number, oldh: number);
            }
            export class DrawListener {
                constructor(impl?: { onDraw(canvas: globalAndroid.graphics.Canvas) });
                onDraw(canvas: globalAndroid.graphics.Canvas);
            }
        }
    }
}
