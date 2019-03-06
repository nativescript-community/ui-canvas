import { Canvas, Cap, Join, Paint, Style } from '../canvas';
import { Color } from 'tns-core-modules/color/color';
import { Length, PercentLength } from 'tns-core-modules/ui/styling/style-properties';
import { booleanConverter, ViewBase } from 'tns-core-modules/ui/core/view';
import { Observable } from 'tns-core-modules/data/observable/observable';
import { parseCap, parseJoin, parseType } from '../canvas.common';

function createGetter(key, options: ShapePropertyOptions) {
    return function() {
        if (options.paintGetterName && this.paint[options.paintGetterName]) {
            return this.paint[options.paintGetterName]();
        } else {
            return this.style[key];
        }
    };
}

function hasSetter(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    return descriptor && !!descriptor['set'];
}

interface ShapePropertyOptions {
    converter?: Function;
    paintGetterName?: string;
    paintSetterName?: string;
    paintSetter?: (paint: Paint, value: any) => void;
}
function createSetter(key, options: ShapePropertyOptions) {
    return function(newVal) {
        const actualVal = options.converter ? options.converter(newVal) : newVal;
        this.style[key] = actualVal;
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: key, value: actualVal });
        if (options.paintSetter) {
            options.paintSetter(this.paint, actualVal);
        } else if (options.paintSetterName) {
            if (this.paint[options.paintSetterName]) {
                this.paint[options.paintSetterName](actualVal);
            }
        } else {
            if ((this.paint && this.paint.hasOwnProperty(key)) || hasSetter(this.paint, key)) {
                this.paint[key] = actualVal;
            } else {
                const setter = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
                if (this.paint[setter]) {
                    this.paint[setter](actualVal);
                }
            }
        }
    };
}

function shapePropertyGenerator(target: Object, key: string | symbol, options?: ShapePropertyOptions) {
    Object.defineProperty(target, key, {
        get: createGetter(key, options),
        set: createSetter(key, options),
        enumerable: true,
        configurable: true
    });
}
export function shapeProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function shapeProperty(options: ShapePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function shapeProperty(converter, ...args) {
    const options = args[0];
    if (typeof options === 'object' && (!!options.converter || !!options.paintGetterName || !!options.paintSetterName)) {
        // factory
        if (!options.converter) {
            options.converter = converter;
        }
        return function(target: any, key?: string, descriptor?: PropertyDescriptor) {
            return shapePropertyGenerator(target, key, options);
        };
    } else {
        return shapePropertyGenerator(args[0], args[1], { converter });
    }
}

export function colorProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function colorProperty(options: ShapePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function colorProperty(...args) {
    return shapeProperty(v => new Color(v), ...args);
}
export function lengthProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function lengthProperty(options: ShapePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function lengthProperty(...args) {
    return shapeProperty(v => Length.parse(v), ...args);
}
export function percentLengthProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function percentLengthProperty(options: ShapePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function percentLengthProperty(...args) {
    return shapeProperty(v => PercentLength.parse(v), ...args);
}
export function numberProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function numberProperty(options: ShapePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function numberProperty(...args) {
    return shapeProperty(v => parseFloat(v), ...args);
}
export function booleanProperty(target: any, k?, desc?: PropertyDescriptor): any;
export function booleanProperty(options: ShapePropertyOptions): (target: any, k?, desc?: PropertyDescriptor) => any;
export function booleanProperty(...args) {
    return shapeProperty(v => booleanConverter(v), ...args);
}

interface Shadow {
    dx: number;
    dy: number;
    radius: number;
    color: Color;
}

function parseShadow(value: string) {
    console.log('parseShadow', value);
    if (value === 'none') {
        return null;
    }
    const args = value.split(' ');
    const hasRadius = args.length === 4;
    return {
        radius: hasRadius ? Length.parse(args[2]) : 3,
        dx: Length.toDevicePixels(Length.parse(args[0])),
        dy: Length.toDevicePixels(Length.parse(args[1])),
        color: new Color(args[hasRadius ? 3 : 2])
    };
}

function applyShadow(paint: Paint, shadow: Shadow) {
    if (shadow) {
        paint.setShadowLayer(shadow.radius, shadow.dx, shadow.dy, shadow.color);
    } else {
        paint.clearShadowLayer();
    }
}
export default abstract class Shape extends ViewBase {
    paint = new Paint();
    @colorProperty fillColor: Color;
    @colorProperty strokeColor: Color;
    @colorProperty color: Color;
    @lengthProperty strokeWidth: number;
    @numberProperty({ converter: parseType, paintSetterName: 'setStyle' }) paintStyle: Style;
    @numberProperty({ converter: parseCap }) strokeCap: Cap;
    @numberProperty({ converter: parseJoin }) strokeJoin: Join;
    @numberProperty textSize: number;
    @booleanProperty({ paintGetterName: 'isAntiAlias', paintSetterName: 'setAntiAlias' }) antiAlias: boolean;
    @colorProperty({
        converter: parseShadow,
        paintSetter: applyShadow
    })
    shadow: Shadow;
    abstract drawOnCanvas(canvas: Canvas);

    drawMyShapeOnCanvas(canvas: Canvas) {
        const paint = this.paint;

        if (this.strokeColor || this.fillColor) {
            const oldStyle = paint.getStyle();
            const oldColor = paint.getColor();
            if (this.fillColor) {
                paint.setStyle(Style.FILL);
                paint.setColor(this.fillColor);
                // paint.color = this.fillColor;
                this.drawOnCanvas(canvas);
                paint.setStyle(oldStyle);
                paint.setColor(oldColor);
            }
            if (this.strokeColor) {
                const clearShadow = this.fillColor && this.shadow;
                if (clearShadow) {
                    paint.clearShadowLayer();
                }
                paint.setStyle(Style.STROKE);
                paint.setColor(this.strokeColor);
                this.drawOnCanvas(canvas);
                paint.setStyle(oldStyle);
                paint.setColor(oldColor);
                if (clearShadow) {
                    applyShadow(paint, this.shadow);
                }
            }
        } else {
            this.drawOnCanvas(canvas);
        }
    }
}
