import { CSSType, Color, Font, ImageSource, View } from '@nativescript/core';
import { FontStyle, FontWeight } from '@nativescript/core/ui/styling/font';
import { android as androidApp } from '@nativescript/core/application';
import lazy from '@nativescript/core/utils/lazy';
import { layout } from '@nativescript/core/utils/utils';
import { Canvas as ICanvas, Paint as IPaint } from './canvas';
import { CanvasBase, hardwareAcceleratedProperty } from './canvas.common';

declare global {
    const __runtimeVersion: string;
}

export * from './canvas.common';
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
    PorterDuffXfermode
};

let SDK_INT = -1;
function getSDK() {
    if (SDK_INT === -1) {
        SDK_INT = android.os.Build.VERSION.SDK_INT;
    }
    return SDK_INT;
}

let _runtimeVersion;
let _supportsDirectArrayBuffers;
export function supportsDirectArrayBuffers() {
    if (_supportsDirectArrayBuffers === undefined) {
        if (!_runtimeVersion) {
            _runtimeVersion = __runtimeVersion;
        }
        _supportsDirectArrayBuffers = parseInt(_runtimeVersion[0], 10) > 8 || (parseInt(_runtimeVersion[0], 10) === 8 && parseInt(_runtimeVersion[2], 10) >= 2);
    }
    return _supportsDirectArrayBuffers;
}

export function createArrayBufferOrNativeArray(length: number, useInts = false) {
    if (!supportsDirectArrayBuffers()) {
        return createNativeArray(length, useInts);
    } else {
        return createArrayBuffer(length, useInts);
    }
}
export function createArrayBuffer(length: number, useInts = false) {
    if (!supportsDirectArrayBuffers()) {
        let bb: java.nio.ByteBuffer;
        if (useInts) {
            bb = java.nio.ByteBuffer.allocateDirect(length);
        } else {
            bb = java.nio.ByteBuffer.allocateDirect(length * 4).order(java.nio.ByteOrder.LITTLE_ENDIAN);
        }
        const result = (ArrayBuffer as any).from(bb);
        return useInts ? new Int8Array(result) : new Float32Array(result);
    }
    return useInts ? new Int8Array(length) : new Float32Array(length);
}
export function pointsFromBuffer(typedArray: Float32Array | Int8Array, useInts = false) {
    if (!supportsDirectArrayBuffers()) {
        if (useInts) {
            const buffer = typedArray.buffer;
            return ((buffer as any).nativeObject as java.nio.ByteBuffer).array();
        }
        const buffer = typedArray.buffer;
        const length = typedArray.length;
        const testArray = Array.create('float', length);
        ((buffer as any).nativeObject as java.nio.ByteBuffer).asFloatBuffer().get(testArray, 0, length);
        return testArray as number[];
    }
    return typedArray;
}

export function arrayToNativeArray(array, useInts = false) {
    if (!Array.isArray(array)) {
        return array;
    }
    const length = array.length;
    const typedArray = createArrayBuffer(length, useInts);

    return pointsFromBuffer(typedArray, useInts);
}

// export const nativeArrayToArray = profile('nativeArrayToArray', function(array) {
export function nativeArrayToArray(array): number[] {
    if (!supportsDirectArrayBuffers()) {
        const result = [];
        for (let index = 0; index < array.length; index++) {
            result[index] = array[index];
        }

        return result as number[];
    }
    return array;
}
export function createNativeArray(length, useInts = false): number[] {
    if (useInts) {
        return Array.create('int', length);
    } else {
        return Array.create('float', length);
    }
}

export function parseDashEffect(value: string) {
    const array = value.split(' ').map(parseFloat);
    const length = array.length;
    const phase = array[length - 1];
    const result = new DashPathEffect(array, phase);
    return result;
}

function createColorParam(param) {
    if (param instanceof Array) {
        return param.map(createColorParam);
    } else if (param instanceof Color) {
        return param.android;
    } else if (param) {
        return new Color(param).android;
    }
}

// function drawBitmapOnCanvas(canvas: android.graphics.Canvas, param0: any, param1: any, param2: any, param3?: any) {
//     if (param0 instanceof ImageSource) {
//         param0 = param0.android;
//     }
//     if (!param3 && (param2 === undefined || param2 instanceof Paint)) {
//         canvas.drawBitmap(param0, param1, param2);
//     } else {
//         canvas.drawBitmap(param0, param1, param2, param3);
//     }
// }
function drawViewOnCanvas(canvas: android.graphics.Canvas, view: View, rect?: android.graphics.Rect) {
    if (!view.nativeView) {
        const activity = androidApp.foregroundActivity;
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
        view.nativeView.draw(canvas as any);
        if (rect) {
            canvas.restore();
        }
    }
}

class ProxyClass<T> {
    mNative: T;
    static augmentedMethods = [];
    getNative() {
        return this.mNative;
    }
    constructor() {
        const proxy = new Proxy(this, this);
        return proxy;
    }
    handleCustomMethods(target: this, native: T, methodName: string, args: any[]): any {}
    get(target: this, name, receiver) {
        const native = target.getNative();
        if (native && (target.constructor['augmentedMethods'].indexOf(name) >= 0 || native[name])) {
            return function (...args) {
                const methodName = name;
                for (let index = 0; index < args.length; index++) {
                    const element = args[index];
                    if (element && element.getNative) {
                        args[index] = element.getNative();
                    } else if (Array.isArray(element)) {
                        args[index] = arrayToNativeArray(element);
                    }
                }
                const result = target.handleCustomMethods(target, native, methodName, args);
                if (result) {
                    return result;
                }
                return native[methodName](...args);
            };
        } else {
            return Reflect.get(target, name, receiver);
        }
    }
}

class Canvas extends ProxyClass<android.graphics.Canvas> {
    _bitmap: android.graphics.Bitmap;
    _shouldReleaseBitmap = false;
    static augmentedMethods = ['clear', 'drawBitmap', 'drawView'];
    constructor(imageOrWidth?: ImageSource | android.graphics.Bitmap | number, height?: number) {
        super();
        if (imageOrWidth) {
            if (imageOrWidth instanceof ImageSource) {
                this._bitmap = imageOrWidth.android;
            } else if (imageOrWidth instanceof android.graphics.Bitmap) {
                this._bitmap = imageOrWidth;
            } else {
                this._shouldReleaseBitmap = true;
                this._bitmap = android.graphics.Bitmap.createBitmap(imageOrWidth, height, android.graphics.Bitmap.Config.ARGB_8888);
            }
            if (!this._bitmap.isMutable()) {
                this._shouldReleaseBitmap = true;
                this._bitmap = this._bitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
            }
            this.mNative = new android.graphics.Canvas(this._bitmap);
        }

        return this;
    }
    override handleCustomMethods(target, native, methodName, args): any {
        if (methodName === 'setBitmap') {
            if (args[0] instanceof ImageSource) {
                args[0] = args[0].android;
            }
        } else if (methodName === 'drawColor') {
            args[0] = createColorParam(args[0]);
        } else if (methodName === 'drawLines') {
            args[0] = arrayToNativeArray(args[0]);
            const last = args[args.length - 1];
            if (last instanceof android.graphics.Matrix) {
                last.mapPoints(args[0]);
                args.pop();
            }
        } else if (methodName === 'getWidth' || methodName === 'getHeight') {
            if (!target._bitmap) {
                return layout.toDeviceIndependentPixels(native[methodName]());
            }
        } else if (methodName === 'clear') {
            native.drawColor(android.graphics.Color.TRANSPARENT);
            return true;
        } else if (methodName === 'drawBitmap') {
            if (args[0] instanceof ImageSource) {
                args[0] = args[0].android;
            }
        } else if (methodName === 'drawView') {
            drawViewOnCanvas(native, args[0], args[1]);
            return true;
        }
    }
    getImage() {
        return this._bitmap;
    }
    release() {
        if (this._shouldReleaseBitmap && this._bitmap) {
            this._bitmap.recycle();
            this._bitmap = null;
        }
    }
}

export class Paint extends ProxyClass<android.graphics.Paint> {
    mNative: android.graphics.Paint;
    mFontInternal: Font;
    mNeedsFontUpdate = false;
    handlesFont = false;
    getNative() {
        if (!this.handlesFont && this.mNeedsFontUpdate) {
            this.mNeedsFontUpdate = false;
            const font = this.font;
            const nTypeface = font.getAndroidTypeface();
            this.mNative.setTypeface(nTypeface);
        }
        return this.mNative;
    }
    constructor() {
        super();
        this.mNative = new android.graphics.Paint();
        this.mNative.setLinearText(true); // ensure we are drawing fonts correctly
        return this;
    }
    handleCustomMethods(target, native, methodName: string, args: any[]): any {
        if (methodName === 'setShadowLayer') {
            args[3] = createColorParam(args[3]);
        } else if (methodName === 'setColor') {
            if (!args[0]) {
                return;
            }
            args[0] = createColorParam(args[0]);
        } else if (methodName === 'setTypeface') {
            if (args[0] instanceof Font) {
                this.mFontInternal = args[0];
            } else {
                this.font['_typeface'] = args[0] as android.graphics.Typeface;
            }
            this.mNeedsFontUpdate = true;
            return this.mFontInternal;
        }
    }
    setFont(font: Font) {
        this.mFontInternal = font;
        if (this.handlesFont) {
            return;
        }
        this.mNative.setTextSize(font.fontSize);
        this.mNeedsFontUpdate = true;
    }
    getFont() {
        if (!this.mFontInternal) {
            this.mFontInternal = Font.default;
        }
        return this.mFontInternal;
    }
    get font() {
        return this.getFont();
    }
    set font(font: Font) {
        this.setFont(font);
    }
    getFontFamily() {
        return this.font.fontFamily;
    }
    get fontFamily() {
        return this.getFontFamily();
    }
    set fontFamily(familyName: string) {
        this.setFontFamily(familyName);
    }
    setFontFamily(familyName: string) {
        if (this.font.fontFamily !== familyName) {
            this.mFontInternal = this.font.withFontFamily(familyName);
            if (!this.handlesFont) {
                this.mNeedsFontUpdate = true;
            }
        }
    }
    set fontWeight(weight: FontWeight) {
        this.setFontWeight(weight);
    }
    setFontWeight(weight: FontWeight) {
        if (this.font.fontWeight !== weight) {
            this.mFontInternal = this.font.withFontWeight(weight);
            if (!this.handlesFont) {
                this.mNeedsFontUpdate = true;
            }
        }
    }
    set fontStyle(style: FontStyle) {
        this.setFontStyle(style);
    }
    setFontStyle(style: FontStyle) {
        if (this.font.fontStyle !== style) {
            this.mFontInternal = this.font.withFontStyle(style);
            if (!this.handlesFont) {
                this.mNeedsFontUpdate = true;
            }
        }
    }
    set color(color) {
        (this as any).setColor(color);
    }
    set strokeWidth(value: number) {
        this.mNative.setStrokeWidth(value);
    }
    set strokeCap(value: number) {
        this.mNative.setStrokeCap(value);
    }
    set strokeJoin(value: number) {
        this.mNative.setStrokeJoin(value);
    }
    set style(value: number) {
        this.mNative.setStyle(value);
    }
    set textSize(value: number) {
        this.mNative.setTextSize(value);
    }
    get textSize() {
        return this.getTextSize();
    }
    public getTextSize(): number {
        return this.mNative.getTextSize();
    }
    public setTypeface(font: Font | android.graphics.Typeface): Font {
        if (font instanceof Font) {
            this.setFont(font);
            return this.mFontInternal;
        } else if (font) {
            this.mFontInternal['_typeface'] = font;
        } else {
            this.mFontInternal = null;
        }
        if (!this.handlesFont) {
            this.mNeedsFontUpdate = true;
        }
        return this.mFontInternal;
    }
    set typeface(typeface) {
        this.setTypeface(typeface);
    }
}

export class DashPathEffect extends ProxyClass<android.graphics.DashPathEffect> {
    constructor(intervals: number[], phase: number) {
        super();
        this.mNative = new android.graphics.DashPathEffect(arrayToNativeArray(intervals), phase);
        return this;
    }
}

export class Path extends ProxyClass<com.akylas.canvas.CanvasPath> {
    constructor(path?: com.akylas.canvas.CanvasPath) {
        super();
        this.mNative = path ? new com.akylas.canvas.CanvasPath(path) : new com.akylas.canvas.CanvasPath();
        return this;
    }
}
export class RadialGradient extends ProxyClass<android.graphics.RadialGradient> {
    constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any) {
        super();
        this.mNative = new android.graphics.RadialGradient(param0, param1, param2, createColorParam(param3), param4 instanceof Array ? param4 : createColorParam(param4), param5);
        return this;
    }
}

export class LinearGradient extends ProxyClass<android.graphics.LinearGradient> {
    mNative: android.graphics.LinearGradient;
    getNative() {
        return this.mNative;
    }
    constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any, param6: any) {
        super();
        if (param4 != null) {
            if (Array.isArray(param4)) {
                const testArray = Array.create('int', param4.length);
                param4.forEach((c, i) => (testArray[i] = createColorParam(c)));
                param4 = testArray;
            } else {
                param4 = createColorParam(param4);
            }
        }
        if (param5 != null) {
            if (Array.isArray(param5)) {
                const testArray = Array.create('float', param4.length);
                param5.forEach((c, i) => (testArray[i] = c));
                param5 = testArray;
            } else {
                param5 = createColorParam(param5);
            }
        }
        this.mNative = new android.graphics.LinearGradient(param0, param1, param2, param3, param4, param5, param6);
        return this;
    }
}

export class BitmapShader extends ProxyClass<android.graphics.BitmapShader> {
    mNative: android.graphics.BitmapShader;
    constructor(bitmap: any, tileX: any, tileY: any) {
        super();
        if (bitmap instanceof ImageSource) {
            bitmap = bitmap.android;
        }
        this.mNative = new android.graphics.BitmapShader(bitmap, tileX, tileY);
        return this;
    }
}

export class StaticLayout extends ProxyClass<android.text.StaticLayout> {
    constructor(text: any, paint: android.graphics.Paint, width: number, align = LayoutAlignment.ALIGN_NORMAL, spacingmult = 1, spacingadd = 0, includepad = true) {
        super();
        paint = (paint as any).getNative ? (paint as any).getNative() : paint;

        if (typeof text === 'boolean' || typeof text === 'number') {
            // in case it is a number or a boolean
            text = text + '';
        }
        this.mNative = com.akylas.canvas.StaticLayout.createStaticLayout(text, paint, width, align, spacingmult, spacingadd, includepad);

        return this;
    }
}
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
    Matrix = com.akylas.canvas.CanvasMatrix;
    TileMode = android.graphics.Shader.TileMode;
    LayoutAlignment = android.text.Layout.Alignment;
    PorterDuffMode = android.graphics.PorterDuff.Mode;
    PorterDuffXfermode = android.graphics.PorterDuffXfermode;
}

@CSSType('CanvasView')
class CanvasView extends CanvasBase {
    augmentedCanvas = new Canvas();
    frameRatePaint: IPaint;
    shapePaint: IPaint;
    onDraw(canvas: ICanvas) {
        const shapeCanvas = this.shapesCanvas;
        if (this.callDrawBeforeShapes) {
            this.notify({ eventName: 'draw', object: this, canvas: this.augmentedCanvas });
        }
        if (shapeCanvas) {
            if (!this.shapePaint) {
                this.shapePaint = new android.graphics.Paint() as any;
            }
            canvas.drawBitmap(shapeCanvas.getImage() as android.graphics.Bitmap, 0, 0, this.shapePaint);
        } else if (!this.cached) {
            const shapes = this.mShapes;
            const width = canvas.getWidth();
            const height = canvas.getHeight();
            if (shapes && shapes.length > 0) {
                shapes.forEach((s) => s.drawMyShapeOnCanvas(this.augmentedCanvas as any, this as any, width, height));
            }
        }
        if (!this.callDrawBeforeShapes) {
            this.notify({ eventName: 'draw', object: this, canvas: this.augmentedCanvas });
        }
    }
    nativeViewProtected: com.akylas.canvas.CanvasView;
    createNativeView() {
        const view = new com.akylas.canvas.CanvasView(this._context);
        if (getSDK() >= 28) {
            view.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        } else {
            view.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
        }
        return view;
    }
    [hardwareAcceleratedProperty.getDefault](value) {
        return getSDK() >= 28;
    }

    [hardwareAcceleratedProperty.setNative](value) {
        this.nativeViewProtected.setLayerType(value ? android.view.View.LAYER_TYPE_HARDWARE : android.view.View.LAYER_TYPE_SOFTWARE, null);
    }
    initNativeView() {
        super.initNativeView();
        this.nativeViewProtected.sizeChangedListener = new com.akylas.canvas.SizeChangedListener({
            onSizeChanged: (w, h, oldW, oldH) => {
                this.onSizeChanged(layout.toDeviceIndependentPixels(w), layout.toDeviceIndependentPixels(h), oldW, oldH);
            }
        });
        this.nativeViewProtected.drawListener = new com.akylas.canvas.DrawListener({
            onDraw: (canvas: android.graphics.Canvas) => {
                const drawFameRate = this.drawFameRate;
                let startTime;
                if (drawFameRate) {
                    startTime = Date.now();
                }
                const scale = this.density;
                canvas.save();
                // canvas.setDensity(Math.round(scale * 160));
                canvas.scale(scale, scale); // always scale to device density to work with dp
                this.augmentedCanvas.mNative = canvas;
                this.onDraw(this.augmentedCanvas as any);
                if (drawFameRate) {
                    const end = Date.now();
                    if (!this.frameRatePaint) {
                        this.frameRatePaint = new Paint() as any;
                        this.frameRatePaint.color = 'blue';
                        this.frameRatePaint.setTextSize(12);
                    }
                    (this.augmentedCanvas as any).drawText(Math.round(1000 / (end - startTime)) + 'fps', 0, 14, this.frameRatePaint as any);
                }
                canvas.restore();
            }
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
}

export function createImage(options: { width: number; height: number; scale?: number; config?: android.graphics.Bitmap.Config }) {
    return new ImageSource(android.graphics.Bitmap.createBitmap(options.width, options.height, options.config || android.graphics.Bitmap.Config.ARGB_4444));
}
export function releaseImage(image: ImageSource) {
    if (image.android) {
        image.android.recycle();
        image.setNativeSource(null);
    }
}

initClasses();
