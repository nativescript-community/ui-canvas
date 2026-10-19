import { arrayToNativeArray } from '@nativescript-community/arraybuffers';
import type { View } from '@nativescript/core';
import { Application, Color, Font, ImageSource, Utils } from '@nativescript/core';
import { FontStyleType, FontWeightType } from '@nativescript/core/ui/styling/font-interfaces';
import { sdkVersion } from './canvas.common';

export * from './canvas.common';
export * from './utils';

export { Align, Canvas, Cap, Direction, DrawFilter, FillType, FontMetrics, Join, LayoutAlignment, Matrix, Op, PathEffect, PorterDuffMode, PorterDuffXfermode, Rect, RectF, Style, TileMode };

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
        const activity = Application.android.foregroundActivity;
        view._setupAsRootView(activity);
        view._isAddedToNativeVisualTree = true;
        view.callLoaded();
    }
    if (view.nativeView) {
        if (rect) {
            // Lay the view out with the known dimensions
            view.layout(0, 0, rect.width(), rect.height());

            // Translate the canvas so the view is drawn at the proper coordinates
            canvas.save();
            canvas.translate(rect.left, rect.top);
        }
        view.nativeView.draw(canvas);
        if (rect) {
            canvas.restore();
        }
    }
}

function unwrapArg(element: any) {
    // numbers, strings and booleans are the bulk of the args: leave them first
    if (typeof element === 'object' && element !== null) {
        if (element instanceof ProxyClass) {
            return element.getNative();
        }
        if (element.getNative) {
            return element.getNative();
        }
        if (Array.isArray(element)) {
            return arrayToNativeArray(element, false, false);
        }
    }
    return element;
}

/** Forwarder for a native method that no `handleCustomMethods` branch cares about: no args array, no spread for the usual arities. */
function createForwarder(name: string) {
    return function (this: ProxyClass<any>) {
        const native = this.getNative();
        // eslint-disable-next-line prefer-rest-params
        const args = arguments;
        switch (args.length) {
            case 0:
                return native[name]();
            case 1:
                return native[name](unwrapArg(args[0]));
            case 2:
                return native[name](unwrapArg(args[0]), unwrapArg(args[1]));
            case 3:
                return native[name](unwrapArg(args[0]), unwrapArg(args[1]), unwrapArg(args[2]));
            case 4:
                return native[name](unwrapArg(args[0]), unwrapArg(args[1]), unwrapArg(args[2]), unwrapArg(args[3]));
            case 5:
                return native[name](unwrapArg(args[0]), unwrapArg(args[1]), unwrapArg(args[2]), unwrapArg(args[3]), unwrapArg(args[4]));
            case 6:
                return native[name](unwrapArg(args[0]), unwrapArg(args[1]), unwrapArg(args[2]), unwrapArg(args[3]), unwrapArg(args[4]), unwrapArg(args[5]));
            case 7:
                return native[name](unwrapArg(args[0]), unwrapArg(args[1]), unwrapArg(args[2]), unwrapArg(args[3]), unwrapArg(args[4]), unwrapArg(args[5]), unwrapArg(args[6]));
            default: {
                const unwrapped = new Array(args.length);
                for (let i = 0; i < args.length; i++) {
                    unwrapped[i] = unwrapArg(args[i]);
                }
                return native[name](...unwrapped);
            }
        }
    };
}

/** Forwarder for the names listed in `customMethods`: `handleCustomMethods` may rewrite the args or answer on its own. */
function createCustomForwarder(name: string) {
    return function (this: ProxyClass<any>) {
        const native = this.getNative();
        // eslint-disable-next-line prefer-rest-params
        const args = arguments;
        const unwrapped = new Array(args.length);
        for (let i = 0; i < args.length; i++) {
            unwrapped[i] = unwrapArg(args[i]);
        }
        const result = this.handleCustomMethods(this, native, name, unwrapped);
        if (result !== undefined) {
            return result;
        }
        return native[name](...unwrapped);
    };
}

const hasOwn = Object.prototype.hasOwnProperty;

/**
 * The native methods of the wrapped object are exposed on the wrapper without listing them.
 * The first time a name is read on a class and found on the native object, a real forwarder is
 * defined on that class prototype, so every later call is a plain prototype method call.
 * Names that are neither on the class nor on the native object are cached as `undefined` the same way.
 * Instances are not proxied: only this object, sitting at the end of the prototype chain, is, and it
 * is only reached for a name the class prototype does not know yet.
 */
const nativeMethodsResolver = new Proxy(Object.create(Object.prototype), {
    get(target, name, receiver) {
        // `mNative` is read raw: getNative() can be overridden (Paint applies its pending font there), and reading a
        // prototype (receiver === class prototype) must not recurse into this trap
        const native = typeof name === 'string' && hasOwn.call(receiver, 'mNative') ? receiver.mNative : null;
        if (!native) {
            return Reflect.get(target, name, receiver);
        }
        const methodName = name as string;
        const ctor = receiver.constructor as typeof ProxyClass;
        if (ctor.nonNativeMethods.indexOf(methodName) >= 0) {
            return undefined;
        }
        const proto = Object.getPrototypeOf(receiver);
        let value;
        if (ctor.augmentedMethods.indexOf(methodName) >= 0 || typeof native[methodName] === 'function') {
            const custom = ctor.customMethods === null || ctor.customMethods.indexOf(methodName) >= 0 || ctor.augmentedMethods.indexOf(methodName) >= 0;
            value = custom ? createCustomForwarder(methodName) : createForwarder(methodName);
        } else if (native[methodName]) {
            // not something we can forward
            return undefined;
        }
        // writable so that a later `this.name = x` still creates an own property
        Object.defineProperty(proto, methodName, { value, writable: true, configurable: true, enumerable: false });
        return value;
    }
});

class ProxyClass<T> {
    mNative: T;
    static augmentedMethods: string[] = [];
    static nonNativeMethods: string[] = [];
    /**
     * Names `handleCustomMethods` has a branch for (those calls go through it).
     * Every other native method is forwarded directly. null: send every method through `handleCustomMethods`.
     */
    static customMethods: string[] | null = [];
    getNative() {
        return this.mNative;
    }
    setNative(nativeObj) {
        this.mNative = nativeObj;
    }
    handleCustomMethods(target: this, native: T, methodName: string, args: any[]): any {}
}
Object.setPrototypeOf(ProxyClass.prototype, nativeMethodsResolver);

let FONT_SIZE_FACTOR;
let SCREEN_DENSITY;
class Canvas extends ProxyClass<android.graphics.Canvas> {
    mBitmap: android.graphics.Bitmap;
    mShouldReleaseBitmap = false;
    static augmentedMethods = ['clear', 'drawBitmap', 'drawView'];
    static customMethods = ['setBitmap', 'drawColor', 'drawLines', 'getWidth', 'getHeight', 'clear', 'drawBitmap', 'drawView'];
    constructor(imageOrWidth?: ImageSource | android.graphics.Bitmap | number | android.graphics.Canvas, height?: number) {
        super();
        if (imageOrWidth) {
            if (imageOrWidth instanceof android.graphics.Canvas) {
                this.mNative = imageOrWidth;
                return this;
            } else if (imageOrWidth instanceof ImageSource) {
                this.mBitmap = imageOrWidth.android;
            } else if (imageOrWidth instanceof android.graphics.Bitmap) {
                this.mBitmap = imageOrWidth;
            } else {
                this.mShouldReleaseBitmap = true;
                this.mBitmap = android.graphics.Bitmap.createBitmap(imageOrWidth, height, android.graphics.Bitmap.Config.ARGB_8888);
            }
            if (!this.mBitmap.isMutable()) {
                this.mShouldReleaseBitmap = true;
                this.mBitmap = this.mBitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
            }
            this.mNative = new android.graphics.Canvas(this.mBitmap);
        }

        return this;
    }
    override handleCustomMethods(target: Canvas, native, methodName, args): any {
        if (methodName === 'setBitmap') {
            if (args[0] instanceof ImageSource) {
                args[0] = args[0].android;
            }
        } else if (methodName === 'drawColor') {
            args[0] = createColorParam(args[0]);
        } else if (methodName === 'drawLines') {
            const last = args[args.length - 1];
            if (last instanceof android.graphics.Matrix) {
                last.mapPoints(args[0]);
                args.pop();
            }
        } else if (methodName === 'getWidth' || methodName === 'getHeight') {
            if (!target.mBitmap) {
                return Utils.layout.toDeviceIndependentPixels(native[methodName]());
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
            // } else if (methodName === 'drawText') {
            //     // TODO move that to native
            //     const paint = args[args.length - 1];
            //     const textSize = paint.getTextSize();
            //     if (!FONT_SIZE_FACTOR) {
            //         SCREEN_DENSITY = Screen.mainScreen.scale;
            //         FONT_SIZE_FACTOR = com.akylas.canvas.CanvasView.getFontSizeFactor(Utils.android.getApplicationContext(), 1);
            //     }
            //     paint.setTextSize((textSize * FONT_SIZE_FACTOR) / SCREEN_DENSITY);
            //     native[methodName](...args);
            //     paint.setTextSize(textSize);
            //     return true;
        }
    }
    getImage() {
        return this.mBitmap;
    }
    release() {
        if (this.mShouldReleaseBitmap && this.mBitmap) {
            this.mBitmap.recycle();
            this.mBitmap = null;
        }
    }
}

export class Paint extends ProxyClass<android.graphics.Paint> {
    static customMethods = ['setColor', 'setLetterSpacing', 'getLetterSpacing', 'setShadowLayer'];
    mNative: android.graphics.Paint;
    mFontInternal: Font;
    mNeedsFontUpdate;
    handlesFont;
    getNative() {
        if (!this.handlesFont && this.mNeedsFontUpdate) {
            this.mNeedsFontUpdate = false;
            const font = this.font;
            const nTypeface = font.getAndroidTypeface();
            this.mNative.setTypeface(nTypeface);
        }
        return this.mNative;
    }
    constructor(paint?: Paint) {
        super();
        if (paint) {
            // getNative() applies any pending font update so the native typeface is copied up to date
            this.mNative = new android.graphics.Paint(paint.getNative());
            //we need to clone the typeface or it is shared
            const original = this.mNative.getTypeface();
            if (original) {
                const style = original.getStyle();
                const cloned = android.graphics.Typeface.create(original, style);
                this.mNative.setTypeface(cloned);
            }
            // keep the font so later setFontWeight/setFontStyle/getFontFamily start from it and not from Font.default
            this.mFontInternal = paint.mFontInternal;
            this.handlesFont = paint.handlesFont;
        } else {
            this.mNative = new android.graphics.Paint(1); //android.graphics.Paint.ANTI_ALIAS_FLAG
        }
        this.mNative.setLinearText(true); // ensure we are drawing fonts correctly
        return this;
    }
    handleCustomMethods(target: Paint, native, methodName: string, args: any[]): any {
        if (methodName === 'setColor') {
            if (!args[0]) {
                return;
            }
            args[0] = createColorParam(args[0]);
        } else if (methodName === 'setLetterSpacing' && sdkVersion < 21) {
            return true;
        } else if (methodName === 'getLetterSpacing' && sdkVersion < 21) {
            return 0;
        } else if (methodName === 'setShadowLayer') {
            args[3] = createColorParam(args[3]);
        }
    }
    setTextSize(size: number) {
        this.mNative.setTextSize(size);
    }
    setFont(font: Font) {
        this.mFontInternal = font;
        if (this.handlesFont) {
            return;
        }
        this.setTextSize(font.fontSize);
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
    get letterSpacing() {
        return this['getLetterSpacing']();
    }
    set letterSpacing(spacing: number) {
        this['setLetterSpacing'](spacing);
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
    set fontWeight(weight: FontWeightType) {
        this.setFontWeight(weight);
    }
    setFontWeight(weight: FontWeightType) {
        if (this.font.fontWeight !== weight) {
            this.mFontInternal = this.font.withFontWeight(weight);
            if (!this.handlesFont) {
                this.mNeedsFontUpdate = true;
            }
        }
    }
    set fontStyle(style: FontStyleType) {
        this.setFontStyle(style);
    }
    setFontStyle(style: FontStyleType) {
        if (this.font.fontStyle !== style) {
            this.mFontInternal = this.font.withFontStyle(style);
            if (!this.handlesFont) {
                this.mNeedsFontUpdate = true;
            }
        }
    }
    set color(color) {
        this['setColor'](color);
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
        this.setTextSize(value);
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
            // Font instances are shared (Font.default, fonts passed to several paints) and cache their typeface:
            // attach the native typeface to a private copy so it does not leak into other paints
            const fontCopy = this.font.withFontFamily(this.font.fontFamily);
            fontCopy['_typeface'] = font;
            this.mFontInternal = fontCopy;
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
        this.mNative = new com.akylas.canvas.CanvasDashPathEffect(arrayToNativeArray(intervals, false, false), phase);
        return this;
    }
}
export class ColorMatrixColorFilter extends ProxyClass<android.graphics.ColorMatrixColorFilter> {
    constructor(values: number[]) {
        super();
        this.mNative = new android.graphics.ColorMatrixColorFilter(arrayToNativeArray(values, false, false));
        return this;
    }
}

export class Path extends ProxyClass<com.akylas.canvas.CanvasPath> {
    constructor(path?: com.akylas.canvas.CanvasPath) {
        super();

        if (path) {
            const param = (path as any).getNative ? (path as any).getNative() : path;
            this.mNative = new com.akylas.canvas.CanvasPath(param);
        } else {
            this.mNative = new com.akylas.canvas.CanvasPath();
        }

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
                param5 = arrayToNativeArray(param5, false, false);
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

function lineBreakToEllipsize(value) {
    if (typeof value === 'string') {
        switch (value) {
            case 'end':
                return android.text.TextUtils.TruncateAt.END;
            case 'start':
                return android.text.TextUtils.TruncateAt.START;
            case 'marquee':
                return android.text.TextUtils.TruncateAt.MARQUEE;
            case 'middle':
                return android.text.TextUtils.TruncateAt.MIDDLE;
            default:
                return null;
        }
    }
    return value;
}

export class StaticLayout extends ProxyClass<android.text.StaticLayout> {
    // ellipsize: android.text.TextUtils.TruncateAt;
    static nonNativeMethods = ['draw'];
    constructor(
        text: any,
        paint: android.graphics.Paint,
        width: number,
        align = LayoutAlignment.ALIGN_NORMAL,
        spacingmult = 1,
        spacingadd = 0,
        includepad = true,
        ellipsize = null,
        ellipsizedWidth = width,
        height
    ) {
        super();
        paint = (paint as any).getNative ? (paint as any).getNative() : paint;

        if (typeof text === 'boolean' || typeof text === 'number') {
            // in case it is a number or a boolean
            text = text + '';
        }
        this.mNative = com.akylas.canvas.StaticLayout.createStaticLayout(
            text,
            paint,
            width,
            align,
            spacingmult,
            spacingadd,
            includepad,
            lineBreakToEllipsize(ellipsize),
            ellipsizedWidth,
            Math.round(height)
        );
        return this;
    }

    public static getDesiredWidth(...args) {
        for (let index = 0; index < args.length; index++) {
            const element = args[index];
            if (element && element.getNative) {
                args[index] = element.getNative();
            } else if (Array.isArray(element)) {
                args[index] = arrayToNativeArray(element, false, false);
            }
            if (index === args.length - 1 && !(args[index] instanceof android.text.TextPaint)) {
                args[index] = new android.text.TextPaint(args[index]);
            }
        }
        //@ts-ignore
        return android.text.StaticLayout.getDesiredWidth(...args);
    }

    draw(canvas: Canvas, maxHeight = -1) {
        this.getNative().draw(canvas.getNative());
        // com.akylas.canvas.StaticLayout.draw(this.getNative(), canvas.getNative(), this.includepad, this.ellipsize, this.ellipsizedWidth, maxHeight);
    }

    getActualWidth() {
        let maxLineWidth = 0;
        for (let i = 0; i < this.getNative().getLineCount(); i++) {
            maxLineWidth = Math.max(maxLineWidth, this.getNative().getLineWidth(i));
        }
        return maxLineWidth;
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
