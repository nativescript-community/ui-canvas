import { ChangedData, GridLayout, Observable, ObservableArray, Property, Screen, Utils, View, booleanConverter, colorProperty } from '@nativescript/core';
import { Canvas, Rect, RectF } from '.';
import Shape from './shapes/shape';

// declare module '@nativescript/core/ui/core/view' {
//     interface ViewCommon {
//         _raiseLayoutChangedEvent();
//     }
// }

declare module '@nativescript/core/ui/core/view' {
    interface ViewCommon {
        _addChildFromBuilder(name: string, value: any);
    }
}

export function createRect(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
}

export function createRectF(x: number, y: number, w: number, h: number) {
    return new RectF(x, y, x + w, y + h);
}

export const DEFAULT_SCALE = Screen.mainScreen.scale;
export const cachedProperty = new Property<CanvasBase, boolean>({ name: 'cached', defaultValue: false, valueConverter: booleanConverter });
export const hardwareAcceleratedProperty = new Property<CanvasBase, boolean>({ name: 'hardwareAccelerated', valueConverter: booleanConverter });
export const callDrawBeforeShapesProperty = new Property<CanvasBase, boolean>({ name: 'callDrawBeforeShapes', defaultValue: false, valueConverter: booleanConverter });
export const densityProperty = new Property<CanvasBase, number>({ name: 'density', defaultValue: DEFAULT_SCALE, valueConverter: parseFloat });

export * from './shapes';

function throttle(fn, limit) {
    let waiting = false;
    return (...args) => {
        if (!waiting) {
            fn.apply(this, args);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}
export abstract class CanvasBase extends GridLayout {
    // Declare events as static variables, so that they can be set in NativeScript Core XML
    public static drawEvent = 'draw';

    protected mShapes: ObservableArray<Shape>;

    callDrawBeforeShapes = false;

    get shapes() {
        return this.mShapes;
    }
    public cached;
    public density;
    public hardwareAccelerated;

    drawFrameRate = false;

    getOrCreateShapes() {
        if (!this.mShapes) {
            this.mShapes = new ObservableArray<Shape>();
            this.mShapes.addEventListener(ObservableArray.changeEvent, this.onShapesCollectionChanged, this);
        }
        return this.mShapes;
    }

    requestDrawShapes() {
        if (this.cached) {
            this.drawShapes();
        } else {
            this.redraw();
        }
    }
    requestDrawShapesThrottled = throttle(() => this.requestDrawShapes(), 5);
    // throttling prevent too fast drawing on multiple properties change
    _onShapesContentsChanged() {
        if (this.nativeViewProtected) {
            if (this.cached) {
                this.requestDrawShapesThrottled();
            } else {
                this.requestDrawShapes();
            }
        }
    }
    // public toString(): string {
    //     let result = super.toString();
    //     if (this._shapes) {
    //         for (let i = 0, length = this._shapes.length; i < length; i++) {
    //             result += this._shapes.getItem(i).toString();
    //         }
    //     }

    //     return result;
    // }

    public addShape(shape: Shape) {
        this.getOrCreateShapes().push(shape);
    }
    public insertShape(shape: Shape, atIndex: number) {
        const shapes = this.getOrCreateShapes();
        if (atIndex >= shapes.length) {
            this.addShape(shape);
        } else {
            shapes.splice(atIndex, 0, shape);
        }
    }

    public removeShape(shape: Shape) {
        if (this.mShapes) {
            const index = this.mShapes.indexOf(shape);
            if (index !== -1) {
                this.mShapes.splice(index, 1);
            }
        }
    }

    public _addArrayFromBuilder(name: string, value: any[]) {
        if (name === 'shapes') {
            value.forEach((v) => {
                this._addChildFromBuilder(null, value);
            });
        }
        // we ignore any other kind of view.
    }

    public _addChildFromBuilder(name: string, value: any): void {
        if (value instanceof Shape) {
            this.addShape(value);
        } else {
            super._addChildFromBuilder(name, value);
        }
        // we ignore any other kind of view.
    }
    public removeChild(view: any) {
        if (view instanceof Shape) {
            this.removeShape(view);
        } else {
            super.removeChild(view);
        }
    }
    public addChild(view: any) {
        if (view instanceof Shape) {
            this.addShape(view);
        } else {
            super.addChild(view);
        }
    }

    private onShapesCollectionChanged(eventData: ChangedData<Shape>) {
        if (eventData.addedCount > 0) {
            for (let i = 0; i < eventData.addedCount; i++) {
                const shape = (eventData.object as ObservableArray<any>).getItem(eventData.index + i);
                // Then attach handlers - we skip the first nofitication because
                // we raise change for the whole instance.
                shape.mParent = new WeakRef(this as any);
                this.addPropertyChangeHandler(shape);
            }
        }

        if (eventData.removed && eventData.removed.length > 0) {
            for (let p = 0; p < eventData.removed.length; p++) {
                const shape = eventData.removed[p];
                // First remove handlers so that we don't listen for changes
                // on inherited properties.
                this.removePropertyChangeHandler(shape);
                shape.mParent = null;
                this.redraw();
            }
        }
    }
    public onSizeChanged(w: number, h: number, oldw: number, oldh: number) {
        if (!!this.mShapes && this.mShapes.length > 0) {
            this.requestDrawShapes();
        }
    }
    onShapePropertyChange() {
        this.requestDrawShapes();
    }
    private addPropertyChangeHandler(shape: Shape) {
        // const style = shape.style;
        shape.on(Observable.propertyChangeEvent, this.onShapePropertyChange, this);
    }
    private removePropertyChangeHandler(shape: Shape) {
        shape.off(Observable.propertyChangeEvent, this.onShapePropertyChange, this);
    }

    [colorProperty.setNative](value) {
        if (!!this.mShapes) {
            this.requestDrawShapes();
        }
    }

    [densityProperty.setNative](value) {
        if (!!this.mShapes) {
            this.requestDrawShapes();
        }
    }
    shapesCanvas: Canvas;
    drawShapes() {
        const width = Utils.layout.toDeviceIndependentPixels(this.getMeasuredWidth());
        const height = Utils.layout.toDeviceIndependentPixels(this.getMeasuredHeight());
        if (this.shapesCanvas) {
            // this.shapesCanvas.release();
            this.shapesCanvas = null;
        }
        if (this.mShapes && this.mShapes.length > 0 && width > 0 && height > 0) {
            const canvas = (this.shapesCanvas = new Canvas(width, height));
            canvas.setDensity(this.density);
            this.mShapes.forEach((s) => s.drawMyShapeOnCanvas(canvas, this as any, width, height));
            this.redraw();
        }
    }
    invalidate() {
        this.redraw();
    }
    abstract redraw();
    protected abstract onDraw(canvas: Canvas);
}

cachedProperty.register(CanvasBase);
hardwareAcceleratedProperty.register(CanvasBase);
callDrawBeforeShapesProperty.register(CanvasBase);
densityProperty.register(CanvasBase);
