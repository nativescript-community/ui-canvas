import { Canvas, Cap, DashPathEffect, Join, Rect, RectF, Style } from './canvas';
import { Property } from '@nativescript/core/ui/core/properties';
import { Color } from '@nativescript/core/color';
import { Length } from '@nativescript/core/ui/styling/style-properties';
import { booleanConverter, layout, View, Observable } from '@nativescript/core/ui/core/view';
import { ObservableArray, ChangedData } from '@nativescript/core/data/observable-array/observable-array';
import { screen } from '@nativescript/core/platform';
import Shape from './shapes/shape';

declare module '@nativescript/core/ui/core/view' {
    interface View {
        _raiseLayoutChangedEvent();
        _onSizeChanged();
    }
}

// export namespace knownCollections {
//     export const shapes = 'shapes';
// }

// const CHILD_SHAPES = 'Shapes';

// function onShapesPropertyChanged(canvasBase: CanvasBase, oldValue: Shapes, newValue: Shapes) {
//     if (oldValue) {
//         oldValue.off(Observable.propertyChangeEvent, canvasBase._onShapesContentsChanged, canvasBase);
//         canvasBase._removeView(oldValue);
//     }

//     if (newValue) {
//         const oldParent = newValue.parent;
//         // In case formattedString is attached to new TextBase
//         if (oldParent) {
//             oldParent._removeView(newValue);
//         }
//         canvasBase._addView(newValue);
//         newValue.on(Observable.propertyChangeEvent, canvasBase._onShapesContentsChanged, canvasBase);
//     }
// }

// export class Shapes extends ViewBase implements AddArrayFromBuilder, AddChildFromBuilder {
//     private _shapes: ObservableArray<Shape>;

//     constructor() {
//         super();
//         this._shapes = new ObservableArray<Shape>();
//         this._shapes.addEventListener(ObservableArray.changeEvent, this.onShapesCollectionChanged, this);
//     }
//     get shapes(): ObservableArray<Shape> {
//         if (!this._shapes) {
//             this._shapes = new ObservableArray<Shape>();
//         }
//         return this._shapes;
//     }
//     public toString(): string {
//         let result = super.toString();
//         for (let i = 0, length = this._shapes.length; i < length; i++) {
//             result += this._shapes.getItem(i).toString();
//         }
//         return result;
//     }

//     public _addArrayFromBuilder(name: string, value: any[]) {
//         if (name === knownCollections.shapes) {
//             this.shapes.push(value);
//         }
//     }

//     public _addChildFromBuilder(name: string, value: any): void {
//         // if (value instanceof Shape) {
//         this.shapes.push(value);
//         // }
//     }

// private addPropertyChangeHandler(shape: Shape) {
//     // const style = shape.style;
//     shape.on(Observable.propertyChangeEvent, this.onPropertyChange, this);
// }

//     private removePropertyChangeHandler(shape: Shape) {
//         const style = shape.style;
//         shape.off(Observable.propertyChangeEvent, this.onPropertyChange, this);
//     }

//     private onShapesCollectionChanged(eventData: ChangedData<Shape>) {
//         if (eventData.addedCount > 0) {
//             for (let i = 0; i < eventData.addedCount; i++) {
//                 const shape = (eventData.object as ObservableArray<Shape>).getItem(eventData.index + i);

//                 // First add to logical tree so that inherited properties are set.
//                 this._addView(shape);

//                 // Then attach handlers - we skip the first nofitication because
//                 // we raise change for the whole instance.
//                 this.addPropertyChangeHandler(shape);
//             }
//         }

//         if (eventData.removed && eventData.removed.length > 0) {
//             for (let p = 0; p < eventData.removed.length; p++) {
//                 const span = eventData.removed[p];

//                 // First remove handlers so that we don't listen for changes
//                 // on inherited properties.
//                 this.removePropertyChangeHandler(span);

//                 // Then remove the element.
//                 this._removeView(span);
//             }
//         }

//         this.notifyPropertyChange('.', this);
//     }
//     private onPropertyChange(data: PropertyChangeData) {
//         this.notifyPropertyChange(data.propertyName, this);
//     }

//     // eachChild(callback: (child: ViewBase) => boolean): void {
//     //     this.shapes.forEach((v, i, arr) => callback(v));
//     // }
// }

export function createRect(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
}

export function createRectF(x: number, y: number, w: number, h: number) {
    return new RectF(x, y, x + w, y + h);
}

// export const shapesProperty = new Property<CanvasBase, Shapes>({ name: 'shapes', valueChanged: onShapesPropertyChanged });
export const cachedProperty = new Property<CanvasBase, boolean>({ name: 'cached', defaultValue: false, valueConverter: booleanConverter });
export const hardwareAcceleratedProperty = new Property<CanvasBase, boolean>({ name: 'hardwareAccelerated', defaultValue: true, valueConverter: booleanConverter });
export const densityProperty = new Property<CanvasBase, number>({ name: 'density', valueConverter: parseFloat });

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
export const DEFAULT_SCALE = screen.mainScreen.scale;
export abstract class CanvasBase extends View {
    protected _shapes: ObservableArray<Shape>;

    get shapes() {
        return this._shapes;
    }
    public cached = false;
    public density = DEFAULT_SCALE;

    drawFameRate = false;

    getOrCreateShapes() {
        if (!this._shapes) {
            this._shapes = new ObservableArray<Shape>();
            this._shapes.addEventListener(ObservableArray.changeEvent, this.onShapesCollectionChanged, this);
        }
        return this._shapes;
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
    public toString(): string {
        let result = super.toString();
        if (this._shapes) {
            for (let i = 0, length = this._shapes.length; i < length; i++) {
                result += this._shapes.getItem(i).toString();
            }
        }

        return result;
    }

    public addShape(shape: Shape) {
        this.getOrCreateShapes().push(shape);
        // shape._parent = new WeakRef(this);
    }
    public removeShape(shape: Shape) {
        if (this._shapes) {
            const index = this._shapes.indexOf(shape);
            if (index !== -1) {
                this._shapes.splice(index, 1);
            }
        }
    }

    public _addArrayFromBuilder(name: string, value: any[]) {
        value.forEach((v) => {
            this._addChildFromBuilder(null, value);
        });
        // we ignore any other kind of view.
    }

    public _addChildFromBuilder(name: string, value: any): void {
        if (value instanceof Shape) {
            this.addShape(value);
        }
        // we ignore any other kind of view.
    }

    // private addPropertyChangeHandler(shape: Shape) {
    //     const style = shape.style;
    //     shape.on(Observable.propertyChangeEvent, this.onPropertyChange, this);
    // }

    // private removePropertyChangeHandler(shape: Shape) {
    //     const style = shape.style;
    //     shape.off(Observable.propertyChangeEvent, this.onPropertyChange, this);
    // }

    private onShapesCollectionChanged(eventData: ChangedData<Shape>) {
        if (eventData.addedCount > 0) {
            for (let i = 0; i < eventData.addedCount; i++) {
                const shape = (eventData.object as ObservableArray<Shape>).getItem(eventData.index + i);

                // First add to logical tree so that inherited properties are set.
                // this.addShape(shape);

                // Then attach handlers - we skip the first nofitication because
                // we raise change for the whole instance.
                shape._parent = new WeakRef(this as any);
                this.addPropertyChangeHandler(shape);
            }
        }

        if (eventData.removed && eventData.removed.length > 0) {
            for (let p = 0; p < eventData.removed.length; p++) {
                const shape = eventData.removed[p];

                // First remove handlers so that we don't listen for changes
                // on inherited properties.
                this.removePropertyChangeHandler(shape);
                shape._parent = null;
                this.redraw();

                // Then remove the element.
                // this.removeShape(shape);
            }
        }
    }
    // private onPropertyChange(data: PropertyChangeData) {
    //     this.notifyPropertyChange(data.propertyName, this);
    // }

    // public _addChildFromBuilder(name: string, value: any): void {
    //     // if (name === CHILD_SHAPES) {
    //     //     if (!this.shapes) {
    //     //         const shapes = new Shapes();
    //     //         shapes.shapes.push(value);
    //     //         this.shapes = shapes;
    //     //     } else {
    //     //         this.shapes.shapes.push(value);
    //     //     }
    //     // } else
    //     if (name === CHILD_SHAPES) {
    //         this.shapes = value;
    //     }
    // }

    // eachChild(callback: (child: ViewBase) => boolean): void {
    //     const shapes = this.shapes;
    //     if (shapes) {
    //         callback(shapes);
    //     }
    // }
    public onSizeChanged(w: number, h: number, oldw: number, oldh: number) {
        if (!!this._shapes && this._shapes.length > 0) {
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
    // _raiseLayoutChangedEvent() {
    //     super._raiseLayoutChangedEvent();
    //     console.log('_raiseLayoutChangedEvent', !!this.shapes)
    //     if (!!this.shapes) {
    //         this.requestDrawShapes();
    //     }
    //     this.onSizeChanged();
    // }
    // [shapesProperty.setNative](value: Shapes) {
    //     this.requestDrawShapes();
    // }
    [densityProperty.setNative](value) {
        if (!!this._shapes) {
            this.requestDrawShapes();
        }
    }
    shapesCanvas: Canvas;
    drawShapes() {
        const width = layout.toDeviceIndependentPixels(this.getMeasuredWidth());
        const height = layout.toDeviceIndependentPixels(this.getMeasuredHeight());
        if (this.shapesCanvas) {
            // this.shapesCanvas.release();
            this.shapesCanvas = null;
        }
        if (this._shapes && this._shapes.length > 0 && width > 0 && height > 0) {
            const canvas = (this.shapesCanvas = new Canvas(width, height));
            canvas.setDensity(this.density);
            this._shapes.forEach((s) => s.drawMyShapeOnCanvas(canvas, this as any));
            this.redraw();
        }
    }
    invalidate() {
        this.redraw(); 
    }
    abstract redraw();
    protected abstract onDraw(canvas: Canvas);
}

// shapesProperty.register(CanvasBase);
cachedProperty.register(CanvasBase);
hardwareAcceleratedProperty.register(CanvasBase);
densityProperty.register(CanvasBase);
