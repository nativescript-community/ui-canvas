import { Canvas, Paint, Rect } from './canvas';
import { Color } from 'tns-core-modules/color/color';
import { PercentLength } from 'tns-core-modules/ui/styling/style-properties';
import { Property } from 'tns-core-modules/ui/core/properties';
import { AddArrayFromBuilder, AddChildFromBuilder, View, ViewBase } from 'tns-core-modules/ui/core/view';
import { ChangedData, ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Observable, PropertyChangeData } from 'tns-core-modules/data/observable';
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
        shape.on(Observable.propertyChangeEvent, this.onPropertyChange, this);
        // style.on('fontFamilyChange', this.onPropertyChange, this);
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
        this.notifyPropertyChange(data.propertyName, this);
    }

    eachChild(callback: (child: ViewBase) => boolean): void {
        this.shapes.forEach((v, i, arr) => callback(v));
    }
}

export function createRect(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
}

export abstract class Shape extends ViewBase {
    paint = new Paint();
    abstract drawOnCanvas(canvas: Canvas);

    @nsProperty color: Color;
}

export class Rectangle extends Shape {
    drawOnCanvas(canvas: Canvas) {
        console.log('Rectangle', 'drawOnCanvas', canvas.getWidth(), canvas.getHeight());
        canvas.drawRect(this.getRect(canvas), this.paint);
    }
    @nsProperty width: PercentLength;
    @nsProperty heigth: PercentLength;
    @nsProperty x: PercentLength;
    @nsProperty y: PercentLength;

    getRect(canvas: Canvas) {
        const availableWidth = canvas.getWidth();
        const availableHeight = canvas.getHeight();
        const style = this.style;
        PercentLength.toDevicePixels(style.marginTop, 0, availableHeight);
        return createRect(
            PercentLength.toDevicePixels(style['x'], 0, availableWidth),
            PercentLength.toDevicePixels(style['y'], 0, availableHeight),
            PercentLength.toDevicePixels(style.width, 0, availableWidth),
            PercentLength.toDevicePixels(style.height, 0, availableHeight)
        );
    }
}

export const shapesProperty = new Property<CanvasBase, Shapes>({ name: 'shapes', valueChanged: onShapesPropertyChanged });

export abstract class CanvasBase extends View {
    public shapes: Shapes;

    public _onShapesContentsChanged(data: PropertyChangeData) {
        if (this.nativeViewProtected) {
            // Notifications from the FormattedString start arriving before the Android view is even created.
            this[shapesProperty.setNative](data.value);
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
        console.log('CanvasBase', '_onSizeChanged');
        if (this.shapes) {
            this.drawShapes();
        }
    }
    [shapesProperty.setNative](value: Shapes) {
        this.drawShapes();
    }

    abstract drawShapes();
}

shapesProperty.register(CanvasBase);
