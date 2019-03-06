import { Cap, Join, Rect, Style } from './canvas';
import { Property } from 'tns-core-modules/ui/core/properties';
import { AddArrayFromBuilder, AddChildFromBuilder, View, ViewBase } from 'tns-core-modules/ui/core/view';
import { ChangedData, ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Observable, PropertyChangeData } from 'tns-core-modules/data/observable';
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

declare module 'tns-core-modules/ui/core/view' {
    interface View {
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
        let result = '';
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
        // if (name === CHILD_SPAN) {
        this.shapes.push(value);
        // }
    }

    private addPropertyChangeHandler(shape: Shape) {
        const style = shape.style;
        console.log('addPropertyChangeHandler', shape);
        shape.on(Observable.propertyChangeEvent, this.onPropertyChange, this);
        // style.on('fontSizeChange', this.onPropertyChange, this);
        // style.on('fontStyleChange', this.onPropertyChange, this);
        // style.on('fontWeightChange', this.onPropertyChange, this);
        // style.on('textDecorationChange', this.onPropertyChange, this);
        // style.on('colorChange', this.onPropertyChange, this);
        // style.on('backgroundColorChange', this.onPropertyChange, this);
    }

    private removePropertyChangeHandler(shape: Shape) {
        const style = shape.style;
        shape.off(Observable.propertyChangeEvent, this.onPropertyChange, this);
        // style.off('fontFamilyChange', this.onPropertyChange, this);
        // style.off('fontSizeChange', this.onPropertyChange, this);
        // style.off('fontStyleChange', this.onPropertyChange, this);
        // style.off('fontWeightChange', this.onPropertyChange, this);
        // style.off('textDecorationChange', this.onPropertyChange, this);
        // style.off('colorChange', this.onPropertyChange, this);
        // style.off('backgroundColorChange', this.onPropertyChange, this);
    }

    private onShapesCollectionChanged(eventData: ChangedData<Shape>) {
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
    }
    private onPropertyChange(data: PropertyChangeData) {
        // console.log('onPropertyChange', data.propertyName);
        this.notifyPropertyChange(data.propertyName, this);
    }

    eachChild(callback: (child: ViewBase) => boolean): void {
        this.shapes.forEach((v, i, arr) => callback(v));
    }
}

export function createRect(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
}

export const shapesProperty = new Property<CanvasBase, Shapes>({ name: 'shapes', valueChanged: onShapesPropertyChanged });

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

export abstract class CanvasBase extends View {
    public shapes: Shapes;
    public cached = false;

    requeestDrawShapes() {
        if (this.cached) {
            this.drawShapes();
        } else {
            this.redraw();
        }
    }
    requeestDrawShapesThrottled = throttle(() => this.requeestDrawShapes(), 5);
    // throttling prevent too fast drawing on multiple properties change
    _onShapesContentsChanged() {
        if (this.nativeViewProtected) {
            if (this.cached) {
                this.requeestDrawShapesThrottled();
            } else {
                this.requeestDrawShapes();
            }
        }
    }

    public _addChildFromBuilder(name: string, value: any): void {
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
    }

    eachChild(callback: (child: ViewBase) => boolean): void {
        const shapes = this.shapes;
        if (shapes) {
            callback(shapes);
        }
    }
    _onSizeChanged() {
        super._onSizeChanged();
        if (this.shapes) {
            this.requeestDrawShapes();
        }
    }
    [shapesProperty.setNative](value: Shapes) {
        this.requeestDrawShapes();
    }

    abstract drawShapes();
    abstract redraw();
}

shapesProperty.register(CanvasBase);
