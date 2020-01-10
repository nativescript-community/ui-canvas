import { Canvas, Cap, DashPathEffect, Join, Rect, RectF, Style } from './canvas';
import { Property } from '@nativescript/core/ui/core/properties';
import { AddArrayFromBuilder, AddChildFromBuilder, booleanConverter, layout, View, ViewBase } from '@nativescript/core/ui/core/view';
import { ChangedData, ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { Observable, PropertyChangeData } from '@nativescript/core/data/observable';
import { screen } from '@nativescript/core/platform';
import Shape from './shapes/shape';

export function parseCap(value: string | number) {
    if (typeof value === 'string') {
        switch (value) {
            case 'square':
                return Cap.SQUARE;
            case 'butt':
                return Cap.BUTT;
            case 'round':
            default:
                return Cap.ROUND;
        }
    } else {
        return value;
    }
}
export function parseType(value: string | number) {
    if (typeof value === 'string') {
        switch (value) {
            case 'fill':
                return Style.FILL;
            case 'stroke':
                return Style.STROKE;
            case 'fill_and_stroke':
            default:
                return Style.FILL_AND_STROKE;
        }
    } else {
        return value;
    }
}
export function parseJoin(value: string | number) {
    if (typeof value === 'string') {
        switch (value) {
            case 'bevel':
                return Join.BEVEL;
            case 'round':
                return Join.ROUND;
            default:
            case 'miter':
                return Join.MITER;
        }
    } else {
        return value;
    }
}

export function parseDashEffect(value: string) {
    const array = value.split(' ').map(parseFloat);
    const result = new DashPathEffect(array.slice(0, -1), array[array.length - 1]);
    return result;
}

declare module '@nativescript/core/ui/core/view' {
    interface View {
        _raiseLayoutChangedEvent();
        _onSizeChanged();

    }
}

function createGetter(key) {
    return function() {
        return this.style[key];
    };
}
function createSetter(key) {
    return function(newVal) {
        this.style[key] = newVal;
    };
}

export const nsProperty = (target: Object, key: string | symbol) => {
    Object.defineProperty(target, key, {
        get: createGetter(key),
        set: createSetter(key),
        enumerable: true,
        configurable: true
    });
};

export namespace knownCollections {
    export const shapes = 'shapes';
}

const CHILD_SHAPES = 'Shapes';

function onShapesPropertyChanged(canvasBase: CanvasBase, oldValue: Shapes, newValue: Shapes) {
    if (oldValue) {
        oldValue.off(Observable.propertyChangeEvent, canvasBase._onShapesContentsChanged, canvasBase);
        canvasBase._removeView(oldValue);
    }

    if (newValue) {
        const oldParent = newValue.parent;
        // In case formattedString is attached to new TextBase
        if (oldParent) {
            oldParent._removeView(newValue);
        }
        canvasBase._addView(newValue);
        newValue.on(Observable.propertyChangeEvent, canvasBase._onShapesContentsChanged, canvasBase);
    }
}

export class Shapes extends ViewBase implements AddArrayFromBuilder, AddChildFromBuilder {
    private _shapes: ObservableArray<Shape>;

    constructor() {
        super();
        this._shapes = new ObservableArray<Shape>();
        this._shapes.addEventListener(ObservableArray.changeEvent, this.onShapesCollectionChanged, this);
    }
    get shapes(): ObservableArray<Shape> {
        if (!this._shapes) {
            this._shapes = new ObservableArray<Shape>();
        }
        return this._shapes;
    }
    public toString(): string {
        let result = super.toString();
        for (let i = 0, length = this._shapes.length; i < length; i++) {
            result += this._shapes.getItem(i).toString();
        }
        return result;
    }

    public _addArrayFromBuilder(name: string, value: any[]) {
        if (name === knownCollections.shapes) {
            this.shapes.push(value);
        }
    }

    public _addChildFromBuilder(name: string, value: any): void {
        console.log('Shapes', '_addChildFromBuilder', name, value);
        // if (value instanceof Shape) {
        this.shapes.push(value);
        // }
    }

    private addPropertyChangeHandler(shape: Shape) {
        const style = shape.style;
        shape.on(Observable.propertyChangeEvent, this.onPropertyChange, this);
    }

    private removePropertyChangeHandler(shape: Shape) {
        const style = shape.style;
        shape.off(Observable.propertyChangeEvent, this.onPropertyChange, this);
    }

    private onShapesCollectionChanged(eventData: ChangedData<Shape>) {
        console.log('onShapesCollectionChanged');
        if (eventData.addedCount > 0) {
            for (let i = 0; i < eventData.addedCount; i++) {
                const shape = (eventData.object as ObservableArray<Shape>).getItem(eventData.index + i);

                // First add to logical tree so that inherited properties are set.
                this._addView(shape);

                // Then attach handlers - we skip the first nofitication because
                // we raise change for the whole instance.
                this.addPropertyChangeHandler(shape);
            }
        }

        if (eventData.removed && eventData.removed.length > 0) {
            for (let p = 0; p < eventData.removed.length; p++) {
                const span = eventData.removed[p];

                // First remove handlers so that we don't listen for changes
                // on inherited properties.
                this.removePropertyChangeHandler(span);

                // Then remove the element.
                this._removeView(span);
            }
        }

        this.notifyPropertyChange('.', this);
        console.log('onShapesCollectionChanged done');
    }
    private onPropertyChange(data: PropertyChangeData) {
        console.log('onPropertyChange', data.propertyName);
        this.notifyPropertyChange(data.propertyName, this);
    }

    eachChild(callback: (child: ViewBase) => boolean): void {
        this.shapes.forEach((v, i, arr) => callback(v));
    }
}

export function createRect(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
}

export function createRectF(x: number, y: number, w: number, h: number) {
    return new RectF(x, y, x + w, y + h);
}

export const shapesProperty = new Property<CanvasBase, Shapes>({ name: 'shapes', valueChanged: onShapesPropertyChanged });
export const cachedProperty = new Property<CanvasBase, boolean>({ name: 'cached', defaultValue: false, valueConverter: booleanConverter });
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
    public shapes: Shapes;
    public cached = false;
    public density = DEFAULT_SCALE;

    requestDrawShapes() {
        console.log('requestDrawShapes');
        if (this.cached) {
            this.drawShapes();
        } else {
            this.redraw();
        }
    }
    requestDrawShapesThrottled = throttle(() => this.requestDrawShapes(), 5);
    // throttling prevent too fast drawing on multiple properties change
    _onShapesContentsChanged() {
        console.log('CanvasBase', '_onShapesContentsChanged');
        if (this.nativeViewProtected) {
            if (this.cached) {
                this.requestDrawShapesThrottled();
            } else {
                this.requestDrawShapes();
            }
        }
    }

    public _addChildFromBuilder(name: string, value: any): void {
        console.log('CanvasBase', '_addChildFromBuilder', name);
        // if (name === CHILD_SHAPES) {
        //     if (!this.shapes) {
        //         const shapes = new Shapes();
        //         shapes.shapes.push(value);
        //         this.shapes = shapes;
        //     } else {
        //         this.shapes.shapes.push(value);
        //     }
        // } else
        if (name === CHILD_SHAPES) {
            this.shapes = value;
        }
        console.log('CanvasBase done', '_addChildFromBuilder', name);
    }

    eachChild(callback: (child: ViewBase) => boolean): void {
        const shapes = this.shapes;
        if (shapes) {
            callback(shapes);
        }
    }
    public onSizeChanged(w: number, h: number, oldw: number, oldh: number) {
        if (!!this.shapes) {
            this.requestDrawShapes();
        }
    }
    // _raiseLayoutChangedEvent() {
    //     super._raiseLayoutChangedEvent();
    //     console.log('_raiseLayoutChangedEvent', !!this.shapes)
    //     if (!!this.shapes) {
    //         this.requestDrawShapes();
    //     }
    //     this.onSizeChanged();
    // }
    [shapesProperty.setNative](value: Shapes) {
        this.requestDrawShapes();
    }
    [densityProperty.setNative](value) {
        if (!!this.shapes) {
            this.requestDrawShapes();
        }
    }
    shapesCanvas: Canvas;
    drawShapes() {
        console.log('CanvasBase', 'drawShapes');
        const width = layout.toDeviceIndependentPixels(this.getMeasuredWidth());
        const height = layout.toDeviceIndependentPixels(this.getMeasuredHeight());
        if (this.shapesCanvas) {
            // this.shapesCanvas.release();
            this.shapesCanvas = null;
        }
        if (this.shapes && this.shapes.shapes.length > 0 && width > 0 && height > 0) {
            const canvas = (this.shapesCanvas = new Canvas(width, height));
            canvas.setDensity(this.density);
            this.shapes.shapes.forEach(s => s.drawMyShapeOnCanvas(canvas));
            this.redraw();
        }
    }
    abstract redraw();
}

shapesProperty.register(CanvasBase);
cachedProperty.register(CanvasBase);
densityProperty.register(CanvasBase);
