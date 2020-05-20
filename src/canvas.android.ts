import { ImageSource } from '@nativescript/core/image-source/image-source';
import { Color } from '@nativescript/core/color/color';
import { layout, View } from '@nativescript/core/ui/core/view';
import { android as androidApp } from '@nativescript/core/application';

import { Canvas as ICanvas, Paint as IPaint } from './canvas';
import { CanvasBase, DEFAULT_SCALE, hardwareAcceleratedProperty } from './canvas.common';
import { Font, FontStyle, FontWeight } from '@nativescript/core/ui/styling/font';
import { profile } from '@nativescript/core/profiling/profiling';

export * from './canvas.common';

function createArrayBuffer(length: number, useInts = false) {
    let bb: java.nio.ByteBuffer;
    if (useInts) {
        bb = java.nio.ByteBuffer.allocateDirect(length);
    } else {
        bb = java.nio.ByteBuffer.allocateDirect(length * 4).order(java.nio.ByteOrder.LITTLE_ENDIAN);
    }
    // var bb = java.nio.ByteBuffer.allocateDirect(length * 4).order(java.nio.ByteOrder.LITTLE_ENDIAN);
    const result = (ArrayBuffer as any).from(bb);
    // result.bb = bb;
    return result;
}
function pointsFromBuffer(buffer: ArrayBuffer, useInts = false) {
    if (useInts) {
        return ((buffer as any).nativeObject as java.nio.ByteBuffer).array();
    }
    const length = buffer.byteLength / 4;
    const testArray = Array.create('float', length);
    ((buffer as any).nativeObject as java.nio.ByteBuffer).asFloatBuffer().get(testArray, 0, length);
    return testArray as number[];
}

export function arrayoNativeArray(array, useInts = false) {
    if (!Array.isArray(array)) {
        return array;
    }
    const length = array.length;
    const buffer = createArrayBuffer(length, useInts);
    var arrayBuffer = useInts ? new Int8Array(buffer) : new Float32Array(buffer);
    arrayBuffer.set(array);

    return pointsFromBuffer(buffer, useInts);
}

export function parseDashEffect(value: string) {
    const array = value.split(' ').map(parseFloat);
    const length = array.length;
    const phase = array[length - 1];
    // const nNative = Array.create('float', length - 1);
    // for (let i = 0; i < length - 1; i++) {
    //     nNative[i] = array[i];
    // }
    const result = new DashPathEffect(array, phase);
    return result;
}

function createColorParam(param) {
    if (param instanceof Array) {
        return param.map(createColorParam);
    }
    if (param instanceof Color) {
        return param.android;
    }
    return new Color(param).android;
}

function drawBitmapOnCanvas(canvas: android.graphics.Canvas, param0: any, param1: any, param2: any, param3?: any) {
    if (param0 instanceof ImageSource) {
        param0 = param0.android;
    }
    if (!param3 && (param2 === undefined || param2 instanceof Paint)) {
        canvas.drawBitmap(param0, param1, param2);
    } else {
        canvas.drawBitmap(param0, param1, param2, param3);
    }
}
function drawViewOnCanvas(canvas: android.graphics.Canvas, view: View, rect?: android.graphics.Rect) {
    if (!view.nativeView) {
        const activity = androidApp.foregroundActivity as android.app.Activity;
        (view as any)._setupAsRootView(activity);
        (view as any)._isAddedToNativeVisualTree = true;
        (view as any).callLoaded();
    }
    if (view.nativeView) {
        if (rect) {
            // Lay the view out with the known dimensions
            view.layout(0, 0, rect.width(), rect.height());

            // Translate the canvas so the view is drawn at the proper coordinates
            canvas.save();
            canvas.translate(rect.left, rect.top);
        }
        (view.nativeView as android.view.View).draw(canvas as any);
        if (rect) {
            canvas.restore();
        }
    }
}

const canvasAugmentedMethods = ['clear', 'drawBitmap', 'drawView'];
class Canvas {
    _native: android.graphics.Canvas;
    getNative() {
        return this._native;
    }
    _bitmap: android.graphics.Bitmap;
    _shouldReleaseBitmap = false;
    constructor(imageOrWidth?: ImageSource | android.graphics.Bitmap | number, height?: number) {
        // if no args must be a canvas wrapper
        if (imageOrWidth) {
            if (imageOrWidth instanceof ImageSource) {
                this._bitmap = imageOrWidth.android;
            } else if (imageOrWidth instanceof android.graphics.Bitmap) {
                this._bitmap = imageOrWidth;
            } else {
                this._shouldReleaseBitmap = true;
                // console.log('create canvas with size', imageOrWidth, height);
                // const options = new android.graphics.BitmapFactory.Options();
                // options.inMutable = true;
                // (options as any).outConfig = android.graphics.Bitmap.Config.ARGB_8888;
                // console.log('create canvas with size about to create bitmap');
                this._bitmap = android.graphics.Bitmap.createBitmap(imageOrWidth, height, android.graphics.Bitmap.Config.ARGB_8888);
                // console.log('create canvas with size created bitmap', this._bitmap);
            }
            if (!this._bitmap.isMutable()) {
                this._shouldReleaseBitmap = true;
                this._bitmap = this._bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
            }
            // this.setBitmap(this._bitmap);
            this._native = new android.graphics.Canvas(this._bitmap);
        }

        const proxy = new Proxy(this, this);
        return proxy;
    }
    get(target: Canvas, name, receiver) {
        const native = this._native;
        if (canvasAugmentedMethods.indexOf(name) >= 0 || native[name]) {
            // assume methods live on the prototype
            return function (...args) {
                var methodName = name;
                for (let index = 0; index < args.length; index++) {
                    const element = args[index];
                    if (element && element._native) {
                        args[index] = element.getNative();
                    }
                }
                if (methodName === 'setBitmap') {
                    if (args[0] instanceof ImageSource) {
                        args[0] = args[0].android;
                    }
                } else if (methodName === 'drawColor') {
                    args[0] = createColorParam(args[0]);
                } else if (methodName === 'drawLines') {
                    args[0] = arrayoNativeArray(args[0]);
                    const last = args[args.length - 1];
                    if (last instanceof android.graphics.Matrix) {
                        (last as android.graphics.Matrix).mapPoints(args[0]);
                        args.pop();
                    }
                } else if (methodName === 'getWidth' || methodName === 'getHeight') {
                    if (!target._bitmap) {
                        // return super.getWidth();
                        return layout.toDeviceIndependentPixels(native[methodName]());
                    }
                } else if (methodName === 'clear') {
                    return native.drawColor(android.graphics.Color.TRANSPARENT);
                    // return drawBitmapOnCanvas(native, args[0], args[1], args[2], args[3]);
                } else if (methodName === 'drawBitmap') {
                    return drawBitmapOnCanvas(native, args[0], args[1], args[2], args[3]);
                } else if (methodName === 'drawView') {
                    return drawViewOnCanvas(native, args[0], args[1]);
                }
                return native[methodName](...args);
                // we now have access to both methodName and arguments
            };
        } else {
            // assume instance vars like on the target
            return Reflect.get(target, name, receiver);
        }
    }
    getImage() {
        return this._bitmap;
    }
    // clear() {
    //     this.drawColor('transparent');
    // }
    release() {
        if (this._shouldReleaseBitmap && this._bitmap) {
            this._bitmap.recycle();
            this._bitmap = null;
        }
    }
}
// let Canvas: new (imageOrWidth: ImageSource | android.graphics.Bitmap | number, height?: number) => ICanvas;
// function initCanvasClass() {
//     if (Canvas) {
//         return Canvas;
//     }
//     class CanvasImpl extends android.graphics.Canvas {
//         _bitmap: android.graphics.Bitmap;
//         _shouldReleaseBitmap = false;
//         constructor(imageOrWidth: ImageSource | android.graphics.Bitmap | number, height?: number) {
//             super();
//             // this.setDensity(Math.round(DEFAULT_SCALE * 160));
//             // this.scale(DEFAULT_SCALE, DEFAULT_SCALE); // always scale to device density
//             if (imageOrWidth instanceof ImageSource) {
//                 this._bitmap = imageOrWidth.android;
//             } else if (imageOrWidth instanceof android.graphics.Bitmap) {
//                 this._bitmap = imageOrWidth;
//             } else {
//                 this._shouldReleaseBitmap = true;
//                 // console.log('create canvas with size', imageOrWidth, height);
//                 // const options = new android.graphics.BitmapFactory.Options();
//                 // options.inMutable = true;
//                 // (options as any).outConfig = android.graphics.Bitmap.Config.ARGB_8888;
//                 // console.log('create canvas with size about to create bitmap');
//                 this._bitmap = android.graphics.Bitmap.createBitmap(imageOrWidth, height, android.graphics.Bitmap.Config.ARGB_8888);
//                 // console.log('create canvas with size created bitmap', this._bitmap);
//             }
//             if (!this._bitmap.isMutable()) {
//                 this._shouldReleaseBitmap = true;
//                 this._bitmap = this._bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
//             }
//             this.setBitmap(this._bitmap);
//         }

//         getImage() {
//             return this._bitmap;
//         }
//         // setBitmap(image) {
//         //     if (image instanceof ImageSource) {
//         //         this._bitmap = image.android;
//         //     } else {
//         //         this._bitmap = image;
//         //     }
//         //     super.setBitmap(this._bitmap);
//         // }

//         getWidth() {
//             if (this._bitmap) {
//                 return super.getWidth();
//             }
//             return Math.round(layout.toDeviceIndependentPixels(super.getWidth()));
//         }
//         getHeight() {
//             if (this._bitmap) {
//                 return super.getHeight();
//             }
//             return Math.round(layout.toDeviceIndependentPixels(super.getHeight()));
//         }
//         drawColor(color: number | Color | string): void {
//             const actualColor = color instanceof Color ? color : new Color(color as any);
//             super.drawColor(actualColor.android);
//         }
//         clear() {
//             this.drawColor('transparent');
//         }
//         release() {
//             if (this._shouldReleaseBitmap && this._bitmap) {
//                 this._bitmap.recycle();
//                 this._bitmap = null;
//             }
//         }

//         // override to allow the use of ImageSource
//         public drawBitmap(param0: any, param1: any, param2: any, param3?: any) {
//             if (param0 instanceof ImageSource) {
//                 param0 = param0.android;
//             }
//             if (!param3 && (param2 === undefined || param2 instanceof Paint)) {
//                 super.drawBitmap(param0, param1, param2);
//             } else {
//                 super.drawBitmap(param0, param1, param2, param3);
//             }
//         }

//         public drawView(view: View, rect?: android.graphics.Rect) {
//             if (!view.nativeView) {
//                 const activity = androidApp.foregroundActivity as android.app.Activity;
//                 (view as any)._setupAsRootView(activity);
//                 (view as any)._isAddedToNativeVisualTree = true;
//                 (view as any).callLoaded();
//             }
//             if (view.nativeView) {
//                 if (rect) {
//                     // Lay the view out with the known dimensions
//                     view.layout(0, 0, rect.width(), rect.height());

//                     // Translate the canvas so the view is drawn at the proper coordinates
//                     this.save();
//                     this.translate(rect.left, rect.top);
//                 }
//                 (view.nativeView as android.view.View).draw(this);
//                 if (rect) {
//                     this.restore();
//                 }
//             }
//         }
//         public drawLines(...params) {
//             params[0] = arrayoNativeArray(params[0]);
//             const last = params[params.length - 1];
//             if (last instanceof android.graphics.Matrix) {
//                 (last as android.graphics.Matrix).mapPoints(params[0]);
//                 params.pop();
//             }
//             // console.log('drawLines', params);
//             return super.drawLines.apply(this, params);
//         }
//     }
//     Canvas = CanvasImpl as any;
//     return Canvas;
// }

export class Paint {
    _native: android.graphics.Paint;
    fontInternal: Font;
    _needsFontUpdate = true;
    getNative() {
        if (this._needsFontUpdate) {
            // const startTime = Date.now();
            this._needsFontUpdate = false;
            const font = this.font;
            const nTypeface = font.getAndroidTypeface();
            this._native.setTypeface(nTypeface);
            // console.log('[Paint]', 'setTypeface', font.fontFamily, nTypeface, Date.now() - startTime, 'ms');
        }
        return this._native;
    }
    constructor() {
        const native = (this._native = new android.graphics.Paint());
        // native.setTypeface(this.font.getAndroidTypeface());
        return new Proxy(this, {
            get: function (target, name, receiver) {
                if (native[name]) {
                    // assume methods live on the prototype
                    return function (...args) {
                        var methodName = name;
                        for (let index = 0; index < args.length; index++) {
                            const element = args[index];
                            if (element && element._native) {
                                args[index] = element.getNative();
                            }
                        }
                        if (methodName === 'setShadowLayer') {
                            args[3] = createColorParam(args[3]);
                        } else if (methodName === 'setColor') {
                            args[0] = createColorParam(args[0]);
                        } else if (methodName === 'setTypeface') {
                            if (args[0] instanceof Font) {
                                this.fontInternal = args[0];
                            } else {
                                this.fontInternal['_typeface'] = args[0] as android.graphics.Typeface;
                            }
                            this._needsFontUpdate = true;
                            // native.setTypeface(this.font.getAndroidTypeface());
                            return this.fontInternal;
                        }
                        return native[methodName](...args);
                        // we now have access to both methodName and arguments
                    };
                } else {
                    // assume instance vars like on the target
                    return Reflect.get(target, name, receiver);
                }
            },
        });
    }
    get font() {
        if (!this.fontInternal) {
            this.fontInternal = Font.default;
        }
        return this.fontInternal;
    }
    getFontFamily() {
        return this.font.fontFamily;
    }
    get fontFamily() {
        return this.getFontFamily();
    }
    setFontFamily(familyName: string) {
        if (this.font.fontFamily !== familyName) {
            this.fontInternal = this.font.withFontFamily(familyName);
            this._needsFontUpdate = true;
        }
    }
    set fontFamily(familyName: string) {
        this.setFontFamily(familyName);
    }
    setFont(font: Font) {
        this.fontInternal = font;
        this._needsFontUpdate = true;
        // this._native.setTypeface(this.font.getAndroidTypeface());
    }
    set font(font: Font) {
        this.setFont(font);
    }
    set fontWeight(weight: FontWeight) {
        this.setFontWeight(weight);
    }
    setFontWeight(weight: FontWeight) {
        if (this.font.fontWeight !== weight) {
            this.fontInternal = this.font.withFontWeight(weight);
            this._needsFontUpdate = true;
        }
        // this._native.setTypeface(this.font.getAndroidTypeface());
    }
    set fontStyle(style: FontStyle) {
        this.setFontStyle(style);
    }
    setFontStyle(style: FontStyle) {
        if (this.font.fontStyle !== style) {
            this.fontInternal = this.font.withFontStyle(style);
            this._needsFontUpdate = true;
        }
        // this._native.setTypeface(this.font.getAndroidTypeface());
    }
    set color(color) {
        (this as any).setColor(color);
    }
    set strokeWidth(value: number) {
        this._native.setStrokeWidth(value);
    }
    set strokeCap(value: number) {
        this._native.setStrokeCap(value);
    }
    set strokeJoin(value: number) {
        this._native.setStrokeJoin(value);
    }
    set style(value: number) {
        this._native.setStyle(value);
    }
    set textSize(value: number) {
        this._native.setTextSize(value);
    }
    public setTypeface(font: Font | android.graphics.Typeface): Font {
        if (font instanceof Font) {
            this.fontInternal = font;
        } else if (font) {
            this.fontInternal['_typeface'] = font as android.graphics.Typeface;
        } else {
            this.fontInternal = null;
        }
        this._needsFontUpdate = true;
        // this._native.setTypeface(this.fontInternal.getAndroidTypeface());
        return this.fontInternal;
    }
    set typeface(typeface) {
        this.setTypeface(typeface);
    }
}

export class DashPathEffect {
    _native: android.graphics.DashPathEffect;
    getNative() {
        return this._native;
    }
    constructor(intervals: number[], phase: number) {
        this._native = new android.graphics.DashPathEffect(arrayoNativeArray(intervals), phase);
        return new Proxy(this, this);
    }
    get(target, name, receiver) {
        const native = this._native;
        if (native[name]) {
            return function (...args) {
                var methodName = name;
                return native[methodName](...args);
            };
        } else {
            return Reflect.get(target, name, receiver);
        }
    }
}

export class Path {
    _native: com.akylas.canvas.CanvasPath;
    getNative() {
        return this._native;
    }
    constructor(path?: com.akylas.canvas.CanvasPath) {
        this._native = path ? new com.akylas.canvas.CanvasPath(path) : new com.akylas.canvas.CanvasPath();
        return new Proxy(this, this);
    }
    get(target, name, receiver) {
        const native = this._native;
        if (native[name]) {
            return function (...args) {
                var methodName = name;
                for (let index = 0; index < args.length; index++) {
                    const element = args[index];
                    if (element && element._native) {
                        args[index] = element.getNative();
                    }
                }
                if (methodName === 'addLines' || methodName === 'setLines' || methodName === 'addCubicLines' || methodName === 'setCubicLines') {
                    args[0] = arrayoNativeArray(args[0]);
                }
                return native[methodName](...args);
            };
        } else {
            return Reflect.get(target, name, receiver);
        }
    }
}
export class RadialGradient {
    _native: android.graphics.LinearGradient;
    constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any) {
        this._native = new android.graphics.RadialGradient(param0, param1, param2, createColorParam(param3), param4 instanceof Array ? param4 : createColorParam(param4), param5);
        return new Proxy(this, this);
    }
    get(target, name, receiver) {
        const native = this._native;
        if (native[name]) {
            return function (...args) {
                var methodName = name;
                return native[methodName](...args);
            };
        } else {
            return Reflect.get(target, name, receiver);
        }
    }
}

export class LinearGradient {
    _native: android.graphics.LinearGradient;
    getNative() {
        return this._native;
    }
    constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any, param6: any) {
        this._native = new android.graphics.LinearGradient(param0, param1, param2, param3, createColorParam(param4), param5 instanceof Array ? param5 : createColorParam(param5), param6);
        return new Proxy(this, this);
    }
    get(target, name, receiver) {
        const native = this._native;
        if (native[name]) {
            return function (...args) {
                var methodName = name;
                return native[methodName](...args);
            };
        } else {
            return Reflect.get(target, name, receiver);
        }
    }
}

export class StaticLayout {
    _native: android.text.StaticLayout;
    getNative() {
        return this._native;
    }
    constructor(text: any, paint: android.graphics.Paint, width: number, align, spacingmult, spacingadd, includepad) {
        paint = paint['_native'] || paint;
        this._native = new android.text.StaticLayout(text, paint instanceof android.text.TextPaint ? paint : new android.text.TextPaint(paint), width, align, spacingmult, spacingadd, includepad);
        return new Proxy(this, this);
    }
    get(target, name, receiver) {
        const native = this._native;
        if (native[name]) {
            return function (...args) {
                var methodName = name;
                for (let index = 0; index < args.length; index++) {
                    const element = args[index];
                    if (element && element._native) {
                        args[index] = element.getNative();
                    }
                }
                return native[methodName](...args);
            };
        } else {
            return Reflect.get(target, name, receiver);
        }
    }
}

// class CanvasWrapper {
//     _native: android.graphics.Canvas;
//     constructor(canvas?: android.graphics.Canvas) {
//         this._native = canvas;
//         const proxy = new Proxy(this, this);
//         return proxy;
//     }
//     get(target, name, receiver) {
//         const native = this._native;
//         if (native[name]) {
//             // assume methods live on the prototype
//             return function (...args) {
//                 var methodName = name;
//                 for (let index = 0; index < args.length; index++) {
//                     const element = args[index];
//                     if (element && element._native) {
//                         args[index] = element._native;
//                     }
//                 }
//                 if (methodName === 'setBitmap') {
//                     if (args[0] instanceof ImageSource) {
//                         args[0] = args[0].android;
//                     }
//                 } else if (methodName === 'drawColor') {
//                     args[0] = createColorParam(args[0]);
//                 } else if (methodName === 'drawLines') {
//                     args[0] = arrayoNativeArray(args[0]);
//                     const last = args[args.length - 1];
//                     if (last instanceof android.graphics.Matrix) {
//                         (last as android.graphics.Matrix).mapPoints(args[0]);
//                         args.pop();
//                     }
//                 } else if (methodName === 'getWidth' || methodName === 'getHeight') {
//                     return layout.toDeviceIndependentPixels(native[methodName]());
//                 } else if (methodName === 'drawBitmap') {
//                     return drawBitmapOnCanvas(native, args[0], args[1], args[2], args[3]);
//                 } else if (methodName === 'drawView') {
//                     return drawViewOnCanvas(native, args[0], args[1]);
//                 }
//                 return native[methodName](...args);
//                 // we now have access to both methodName and arguments
//             };
//         } else {
//             // assume instance vars like on the target
//             return Reflect.get(target, name, receiver);
//         }
//     }
// }

// let NativeCanvasView;
// function initAndroidCanvasViewClass() {
//     if (!NativeCanvasView) {
//         class NativeCanvasViewImpl extends com.akylas.canvas.CanvasView {
//             _owner: WeakRef<CanvasView>;
//             augmentedCanvas: any;
//             public constructor(context: android.content.Context, owner: CanvasView) {
//                 super(context);
//                 this._owner = new WeakRef(owner);
//                 this.augmentedCanvas = new Canvas();
//                 //default hardware accelerated
//             }
//             public __sizeChangedImpl(w: number, h: number, oldw: number, oldh: number) {
//                 const owner = this._owner && this._owner.get();
//                 if (owner) {
//                     owner.onSizeChanged(layout.toDeviceIndependentPixels(w), layout.toDeviceIndependentPixels(h), oldw, oldh);
//                 }
//             }
//             frameRatePaint: IPaint;
//             onDraw(canvas: android.graphics.Canvas) {
//                 const owner = this._owner && this._owner.get();
//                 super.onDraw(canvas);
//                 if (owner) {
//                 }
//             }
//         }
//         NativeCanvasView = NativeCanvasViewImpl;
//     }
//     return NativeCanvasView;
// }

let Cap, Direction, DrawFilter, FillType, Join, Matrix, Op, PathEffect, Rect, RectF, Style, TileMode, FontMetrics, Align, LayoutAlignment;
let PorterDuffMode, PorterDuffXfermode;
function initClasses() {
    Align = android.graphics.Paint.Align;
    Cap = android.graphics.Paint.Cap;
    Join = android.graphics.Paint.Join;
    Style = android.graphics.Paint.Style;
    Rect = android.graphics.Rect;
    RectF = android.graphics.RectF;
    FontMetrics = android.graphics.Paint.FontMetrics;
    PathEffect = android.graphics.PathEffect;
    DrawFilter = android.graphics.DrawFilter;
    Op = android.graphics.Region.Op;
    Direction = android.graphics.Path.Direction;
    FillType = android.graphics.Path.FillType;
    Matrix = android.graphics.Matrix;
    TileMode = android.graphics.Shader.TileMode;
    LayoutAlignment = android.text.Layout.Alignment;
    PorterDuffMode = android.graphics.PorterDuff.Mode;
    PorterDuffXfermode = android.graphics.PorterDuffXfermode;
}

// declare module '@nativescript/core/ui/core/view' {
//     interface View {
//         setOnLayoutChangeListener();
//     }
// }
class CanvasView extends CanvasBase {
    augmentedCanvas = new Canvas();
    frameRatePaint: IPaint;
    shapePaint: IPaint;
    onDraw(canvas: ICanvas) {
        const shapeCanvas = this.shapesCanvas;
        if (shapeCanvas) {
            if (!this.shapePaint) {
                this.shapePaint = new android.graphics.Paint() as any;
            }
            canvas.drawBitmap(shapeCanvas.getImage() as android.graphics.Bitmap, 0, 0, this.shapePaint);
        } else if (!this.cached) {
            const shapes = this._shapes;
            if (shapes && shapes.length > 0) {
                shapes.forEach((s) => s.drawMyShapeOnCanvas(this.augmentedCanvas as any, this as any));
            }
        }
        this.notify({ eventName: 'draw', object: this, canvas: this.augmentedCanvas });
    }
    nativeViewProtected: com.akylas.canvas.CanvasView;
    createNativeView() {
        // initAndroidCanvasViewClass();
        const view = new com.akylas.canvas.CanvasView(this._context);
        // const view = new NativeCanvasView(this._context, this);
        view.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        return view;
    }

    [hardwareAcceleratedProperty.setNative](value) {
        this.nativeViewProtected.setLayerType(value ? android.view.View.LAYER_TYPE_HARDWARE : android.view.View.LAYER_TYPE_SOFTWARE, null);
    }
    initNativeView() {
        super.initNativeView();
        this.nativeViewProtected.sizeChangedListener = new com.akylas.canvas.SizeChangedListener({
            onSizeChanged: (w, h, oldW, oldH) => {
                this.onSizeChanged(layout.toDeviceIndependentPixels(w), layout.toDeviceIndependentPixels(h), oldW, oldH);
            },
        });
        this.nativeViewProtected.drawListener = new com.akylas.canvas.DrawListener({
            onDraw: (canvas: android.graphics.Canvas) => {
                const drawFameRate = this.drawFameRate;
                let startTime;
                if (drawFameRate) {
                    startTime = Date.now();
                }
                const scale = this.density;
                // console.log('set canvas density', scale, Math.round(scale * 160), canvas.isHardwareAccelerated() );
                canvas.setDensity(Math.round(scale * 160));
                canvas.scale(scale, scale); // always scale to device density to work with dp
                this.augmentedCanvas._native = canvas;
                this.onDraw(this.augmentedCanvas as any);
                if (drawFameRate) {
                    const end = Date.now();
                    if (!this.frameRatePaint) {
                        this.frameRatePaint = new Paint() as any;
                        this.frameRatePaint.color = 'blue';
                        this.frameRatePaint.setTextSize(12);
                        this.frameRatePaint.setTextSize(12);
                    }
                    canvas.drawText(Math.round(1000 / (end - startTime)) + 'fps', 0, 14, this.frameRatePaint as any);
                }
            },
        });
    }
    disposeNativeView() {
        this.nativeViewProtected.sizeChangedListener = null;
        this.nativeViewProtected.drawListener = null;
        super.disposeNativeView();
    }
    redraw() {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.invalidate();
        }
    }
    invalidate() {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.invalidate();
        }
    }
    // public initNativeView() {
    //     super.initNativeView();
    //     // needed to update the cache canvas size on size change
    //     this.setOnLayoutChangeListener();
    // }
}

export function createImage(options: { width: number; height: number; scale?: number; config?: android.graphics.Bitmap.Config }) {
    ImageSource.fromData;
    return new ImageSource(android.graphics.Bitmap.createBitmap(options.width, options.height, options.config || android.graphics.Bitmap.Config.ARGB_4444));
}
export function releaseImage(image: ImageSource) {
    if (image.android) {
        (image.android as android.graphics.Bitmap).recycle();
        image.setNativeSource(null);
    }
}

initClasses();
export {
    Canvas,
    CanvasView,
    Cap,
    Direction,
    DrawFilter,
    FillType,
    Join,
    Matrix,
    Op,
    PathEffect,
    Rect,
    RectF,
    Style,
    TileMode,
    FontMetrics,
    Align,
    LayoutAlignment,
    PorterDuffMode,
    PorterDuffXfermode,
};
