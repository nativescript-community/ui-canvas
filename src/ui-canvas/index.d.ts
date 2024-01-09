/* eslint-disable no-duplicate-imports */
import { GridLayout } from '@nativescript/core';
import type { ObservableArray } from '@nativescript/core';
import Shape from './shapes/shape';
export * from './canvas';

export class CanvasView extends GridLayout {
    cached: boolean;
    hardwareAccelerated: boolean;
    density: number;
    drawFrameRate: boolean;

    shapes: ObservableArray<Shape>;
    //  mShapes: ObservableArray<Shape>;

    onDraw(canvas: Canvas);
    addShape(shape: Shape);
    insertShape(shape: Shape, atIndex: number);
    removeShape(shape: Shape);
    redraw();
    invalidate();
    onSizeChanged(w: number, h: number, oldw: number, oldh: number);

    public _addArrayFromBuilder(name: string, value: any[]);
}
