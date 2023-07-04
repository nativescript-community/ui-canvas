/* eslint-disable @typescript-eslint/unified-signatures */
declare namespace com {
    export namespace akylas {
        export namespace canvas {
            export class CanvasMatrix extends globalAndroid.graphics.Matrix {
                mapPoints(param0: Float32Array | native.Array<number>, param1: Float32Array | native.Array<number>): void;
                mapPoints(param0: Float32Array | native.Array<number>, param1: number, param2: Float32Array | native.Array<number>, param3: number, param4: number): void;
                mapPoints(param0: Float32Array | native.Array<number>): void;
            }
            export class CanvasDashPathEffect extends globalAndroid.graphics.DashPathEffect {}
            export class CanvasPath extends globalAndroid.graphics.Path {
                addLines(points: number[], offset?: number, length?: number, close?: boolean);
                setLines(points: number[], offset?: number, length?: number, close?: boolean);
                addCubicLines(points: number[], offset?: number, length?: number, close?: boolean);
                setCubicLines(points: number[], offset?: number, length?: number, close?: boolean);
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

            export class StaticLayout {
                static createStaticLayout(
                    source: java.lang.CharSequence,
                    paint: globalAndroid.graphics.Paint | globalAndroid.text.TextPaint,
                    width: number,
                    align: globalAndroid.text.Layout.Alignment,
                    spacingmult: number,
                    spacingadd: number,
                    includepad: boolean,
                    ellipsize: globalAndroid.text.TextUtils.TruncateAt,
                    ellipsizedWidth: number
                ): android.text.StaticLayout;
                static draw(
                    staticLayout: globalAndroid.text.StaticLayout,
                    canvas: globalAndroid.graphics.Canvas,
                    includepad: boolean,
                    ellipsize: globalAndroid.text.TextUtils.TruncateAt,
                    ellipsizedWidth: number,
                    maxHeight: number
                );
            }
        }
    }
}
