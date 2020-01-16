import { ImageSource } from '@nativescript/core/image-source/image-source';
import { Color } from '@nativescript/core/color/color';
import { layout, View } from '@nativescript/core/ui/core/view';
import { android as androidApp } from '@nativescript/core/application';

import { Canvas as ICanvas, Paint as IPaint } from './canvas';
import { CanvasBase, DEFAULT_SCALE } from './canvas.common';
import { Font } from '@nativescript/core/ui/styling/font';
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
let Canvas: new (imageOrWidth: ImageSource | android.graphics.Bitmap | number, height?: number) => ICanvas;
function initCanvasClass() {
    if (Canvas) {
        return Canvas;
    }
    class CanvasImpl extends android.graphics.Canvas {
        _bitmap: android.graphics.Bitmap;
        _shouldReleaseBitmap = false;
        constructor(imageOrWidth: ImageSource | android.graphics.Bitmap | number, height?: number) {
            super();
            // this.setDensity(Math.round(DEFAULT_SCALE * 160));
            // this.scale(DEFAULT_SCALE, DEFAULT_SCALE); // always scale to device density
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
            this.setBitmap(this._bitmap);
        }

        getImage() {
            return this._bitmap;
        }
        setBitmap(image) {
            if (image instanceof ImageSource) {
                this._bitmap = image.android;
            } else {
                this._bitmap = image;
            }
            super.setBitmap(this._bitmap);
        }

        getWidth() {
            if (this._bitmap) {
                return super.getWidth();
            }
            return Math.round(layout.toDeviceIndependentPixels(super.getWidth()));
        }
        getHeight() {
            if (this._bitmap) {
                return super.getHeight();
            }
            return Math.round(layout.toDeviceIndependentPixels(super.getHeight()));
        }
        drawColor(color: number | Color | string): void {
            const actualColor = color instanceof Color ? color : new Color(color as any);
            super.drawColor(actualColor.android);
        }
        clear() {
            this.drawColor('transparent');
        }
        release() {
            if (this._shouldReleaseBitmap && this._bitmap) {
                this._bitmap.recycle();
                this._bitmap = null;
            }
        }

        // override to allow the use of ImageSource
        public drawBitmap(param0: any, param1: any, param2: any, param3?: any) {
            if (param0 instanceof ImageSource) {
                param0 = param0.android;
            }
            if (!param3 && (param2 === undefined || param2 instanceof Paint)) {
                super.drawBitmap(param0, param1, param2);
            } else {
                super.drawBitmap(param0, param1, param2, param3);
            }
        }

        public drawView(view: View, rect?: android.graphics.Rect) {
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
                    this.save();
                    this.translate(rect.left, rect.top);
                }
                (view.nativeView as android.view.View).draw(this);
                if (rect) {
                    this.restore();
                }
            }
        }
        public drawLines(...params) {
            params[0] = arrayoNativeArray(params[0]);
            const last = params[params.length - 1];
            if (last instanceof android.graphics.Matrix) {
                (last as android.graphics.Matrix).mapPoints(params[0]);
                params.pop();
            }
            // console.log('drawLines', params);
            return super.drawLines.apply(this, params);
        }
    }
    Canvas = CanvasImpl as any;
    return Canvas;
}

export let Paint: typeof IPaint;
export interface Paint extends android.graphics.Paint {
    // tslint:disable-next-line: no-misused-new
    new (): Paint;
}
function initPaintClass() {
    if (Paint) {
        return Paint;
    }
    class PaintImpl extends android.graphics.Paint {
        fontInternal: Font;

        constructor() {
            super();
            super.setTypeface(this.font.getAndroidTypeface());
        }
        setColor(color: Color | number | string) {
            // console.log('setColor', color);
            if (color instanceof Color) {
                super.setColor(color.android);
            } else {
                super.setColor(new Color(color as any).android);
            }
        }
        get font() {
            if (!this.fontInternal) {
                this.fontInternal = Font.default;
            }
            return this.fontInternal;
        }
        setTypeface(font: Font | android.graphics.Typeface): any {
            if (font instanceof Font) {
                this.fontInternal = font;
            } else {
                this.fontInternal['_typeface'] = font as android.graphics.Typeface;
            }
            super.setTypeface(this.font.getAndroidTypeface());
            return this.fontInternal;
            //     let currentFont = this.fontInternal;
            // if (!currentFont || currentFont.fontFamily !== newValue) {
            //     const newFont = currentFont.withFontFamily(newValue);
            //     target.fontInternal = Font.equals(Font.default, newFont) ? unsetValue : newFont;
            // }
        }
        setFontFamily(familyName: string) {
            this.fontInternal = this.font.withFontFamily(familyName);
            super.setTypeface(this.font.getAndroidTypeface());
        }
        // get color() {
        //     return this.getColor();
        // }
        set color(color: Color | number | string) {
            this.setColor(color);
        }
        set strokeWidth(value: number) {
            this.setStrokeWidth(value);
        }
        set strokeCap(value: number) {
            this.setStrokeCap(value);
        }
        set strokeJoin(value: number) {
            this.setStrokeJoin(value);
        }
        set style(value: number) {
            this.setStyle(value);
        }
        set textSize(value: number) {
            this.setTextSize(value);
        }
        set typeface(typeface) {
            this.setTypeface(typeface);
        }
        setShadowLayer(radius: number, dx: number, dy: number, color: any) {
            if (color instanceof Color) {
            } else {
                color = new Color(color);
            }
            super.setShadowLayer(radius, dx, dy, color.android);
        }
        public getTextBounds(text: string, index: number, bounds: number, rect: android.graphics.Rect): void {
            // const maximumSize = CGSizeMake(9999, 9999);
            // const font = this.getTypeface();
            // const fontMetrics = this.getFontMetrics();
            // console.log('fontMetrics', fontMetrics.ascent, fontMetrics.bottom, fontMetrics.descent, fontMetrics.leading, fontMetrics.top);
            // console.log('getTextBounds', text, font.toString());
            super.getTextBounds(text, index, bounds, rect);
        }
    }
    Paint = PaintImpl as any;
    return PaintImpl;
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
export let DashPathEffect: DashPathEffect;
export interface DashPathEffect extends android.graphics.DashPathEffect {
    // tslint:disable-next-line: no-misused-new
    new (intervals: number[], phase: number): DashPathEffect;
}
function initDashPathEffectClass() {
    if (DashPathEffect) {
        return DashPathEffect;
    }
    class DashPathEffectImpl extends android.graphics.DashPathEffect {
        public constructor(intervals: number[], phase: number) {
            super(arrayoNativeArray(intervals), phase);
        }
    }
    DashPathEffect = DashPathEffectImpl as any;
    return DashPathEffect;
}

export let Path: Path;
export interface Path extends com.akylas.canvas.CanvasPath {
    // tslint:disable-next-line: no-misused-new
    new (): Path;
}
function initPathClass() {
    if (!Path) {
        class PathImpl extends com.akylas.canvas.CanvasPath {
            constructor(path?: com.akylas.canvas.CanvasPath) {
                path ? super(path) : super();
            }

            addLines(points: number[], length?: number, close?: boolean) {
                super.addLines(arrayoNativeArray(points), length, close);
            }
            setLines(points: number[], length?: number, close?: boolean) {
                super.setLines(arrayoNativeArray(points), length, close);
            }
            addCubicLines(points: number[], length?: number, close?: boolean) {
                super.addCubicLines(arrayoNativeArray(points), length, close);
            }
            setCubicLines(points: number[], length?: number, close?: boolean) {
                super.setCubicLines(arrayoNativeArray(points), length, close);
            }
        }
        Path = PathImpl as any;
    }
    return Path;
}
let RadialGradient;
function initRadialGradientClass() {
    if (!RadialGradient) {
        class RadialGradientImpl extends android.graphics.RadialGradient {
            public constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any) {
                super(param0, param1, param2, createColorParam(param3), param4 instanceof Array ? param4 : createColorParam(param4), param5);
            }
        }
        RadialGradient = RadialGradientImpl;
    }
    return RadialGradient;
}
let LinearGradient;
function initLinearGradientClass() {
    if (!LinearGradient) {
        class LinearGradientImpl extends android.graphics.LinearGradient {
            public constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any, param6: any) {
                super(param0, param1, param2, param3, createColorParam(param4), param5 instanceof Array ? param5 : createColorParam(param5), param6);
            }
        }
        LinearGradient = LinearGradientImpl;
    }
    return LinearGradient;
}

class CanvasWrapper implements ICanvas {
    canvas: android.graphics.Canvas;
    setBitmap(image: any) {
        if (image instanceof ImageSource) {
            image = image.android;
            // } else {
            // this._bitmap = image;
        }
        // this.setBitmap(image);
        this.canvas.setBitmap(image);
    }
    release() {
        // this.canvas.release();
    }
    clear() {
        // this.canvas.clear();
    }
     concat(mat: android.graphics.Matrix) {
        return this.canvas.concat(mat);
     }
    clipOutRect(...params) {
        return this.canvas.clipOutRect.apply(this.canvas, params);
    }
    drawRoundRect(...params) {
        return this.canvas.drawRoundRect.apply(this.canvas, params);
    }
    drawTextRun(...params) {
        return this.canvas.drawTextRun.apply(this.canvas, params);
    }
    clipPath(...params) {
        return this.canvas.clipPath.apply(this.canvas, params);
    }
    clipOutPath(...params) {
        return this.canvas.clipOutPath.apply(this.canvas, params);
    }
    drawText(...params) {
        return this.canvas.drawText.apply(this.canvas, params);
    }
    drawPoints(...params) {
        return this.canvas.drawPoints.apply(this.canvas, params);
    }
    drawArc(...params) {
        return this.canvas.drawArc.apply(this.canvas, params);
    }
    drawColor(color: number | Color | string): void {
        const actualColor = color instanceof Color ? color : new Color(color as any);
        return this.canvas.drawColor(actualColor.android);
    }
    drawCircle(...params) {
        return this.canvas.drawCircle.apply(this.canvas, params);
    }
    drawOval(...params) {
        return this.canvas.drawOval.apply(this.canvas, params);
    }
    drawPaint(...params) {
        return this.canvas.drawPaint.apply(this.canvas, params);
    }
    drawRect(...params) {
        return this.canvas.drawRect.apply(this.canvas, params);
    }
    drawPath(...params) {
        return this.canvas.drawPath.apply(this.canvas, params);
    }
    drawLines(...params) {
        params[0] = arrayoNativeArray(params[0]);
        const last = params[params.length - 1];
        if (last instanceof android.graphics.Matrix) {
            (last as android.graphics.Matrix).mapPoints(params[0]);
            params.pop();
        }
        
        return this.canvas.drawLines.apply(this.canvas, params);
    }
    drawLine(...params) {
        return this.canvas.drawLine.apply(this.canvas, params);
    }
    drawPosText(...params) {
        return this.canvas.drawPosText.apply(this.canvas, params);
    }
    drawTextOnPath(...params) {
        return this.canvas.drawTextOnPath.apply(this.canvas, params);
    }
    skew(...params) {
        return this.canvas.skew.apply(this.canvas, params);
    }
    translate(...params) {
        return this.canvas.translate.apply(this.canvas, params);
    }
    rotate(...params) {
        return this.canvas.rotate.apply(this.canvas, params);
    }
    scale(...params) {
        return this.canvas.scale.apply(this.canvas, params);
    }
    clipRect(...params) {
        return this.canvas.clipRect.apply(this.canvas, params);
    }
    drawARGB(param0, param1, param2, param3) {
        return this.canvas.drawARGB(param0, param1, param2, param3);
    }
    save() {
        return this.canvas.save();
    }
    restore() {
        return this.canvas.restore();
    }
    restoreToCount(count) {
        return this.canvas.restoreToCount(count);
    }
    setDrawFilter(param0) {
        return this.canvas.setDrawFilter(param0);
    }
    setDensity(param0) {
        return this.canvas.setDensity(param0);
    }
    getWidth() {
        return layout.toDeviceIndependentPixels(this.canvas.getWidth());
    }
    getHeight() {
        return layout.toDeviceIndependentPixels(this.canvas.getHeight());
    }
    getClipBounds() {
        return this.canvas.getClipBounds();
    }
    getDensity() {
        return this.canvas.getDensity();
    }
    getDrawFilter() {
        return this.canvas.getDrawFilter();
    }
    drawPoint(param0, param1, param2) {
        return this.canvas.drawPoint(param0, param1, param2);
    }
    drawRGB(param0, param1, param2) {
        return this.canvas.drawRGB(param0, param1, param2);
    }
    // setShadowLayer(radius: number, dx: number, dy: number, color: any) {
    //     if (color instanceof Color) {
    //     } else {
    //         color = new Color(color);
    //     }
    //     this.canvas.setShadowLayer(radius, dx, dy, color.android);
    // }
    public drawBitmap(param0: any, param1: any, param2: any, param3?: any) {
        drawBitmapOnCanvas(this.canvas, param0, param1, param2, param3);
    }

    public drawView(view: View, rect?: any) {
        drawViewOnCanvas(this.canvas, view, rect);
    }
    getImage() {
        return null;
    }
}

let NativeCanvasView;
function initAndroidCanvasViewClass() {
    if (!NativeCanvasView) {
        class NativeCanvasViewImpl extends com.akylas.canvas.CanvasView {
            _owner: WeakRef<CanvasView>;
            augmentedCanvas: CanvasWrapper;
            public constructor(context: android.content.Context, owner: CanvasView) {
                super(context);
                this._owner = new WeakRef(owner);
                this.augmentedCanvas = new CanvasWrapper();

                //default hardware accelerated
            }
            public __sizeChangedImpl(w: number, h: number, oldw: number, oldh: number) {
                const owner = this._owner && this._owner.get();
                if (owner) {
                    owner.onSizeChanged(layout.toDeviceIndependentPixels(w), layout.toDeviceIndependentPixels(h), oldw, oldh);
                }
            }
            onDraw(canvas: android.graphics.Canvas) {
                const owner = this._owner && this._owner.get();
                super.onDraw(canvas);
                if (owner) {
                    const scale = owner.density;
                    // console.log('set canvas density', scale, Math.round(scale * 160), canvas.isHardwareAccelerated() );
                    canvas.setDensity(Math.round(scale * 160));
                    canvas.scale(scale, scale); // always scale to device density to work with dp
                    this.augmentedCanvas.canvas = canvas;
                    const shapeCanvas = owner.shapesCanvas;
                    if (shapeCanvas) {
                        canvas.drawBitmap(shapeCanvas.getImage() as android.graphics.Bitmap, 0, 0, new android.graphics.Paint());
                    } else if (!owner.cached) {
                        const shapes = owner.shapes;
                        if (shapes && shapes.shapes.length > 0) {
                            shapes.shapes.forEach(s => s.drawMyShapeOnCanvas(this.augmentedCanvas));
                        }
                    }
                    owner.onDraw(this.augmentedCanvas);
                }
            }
        }
        NativeCanvasView = NativeCanvasViewImpl;
    }
    return NativeCanvasView;
}

let Cap, Direction, DrawFilter, FillType, Join, Matrix, Op, PathEffect, Rect, RectF, Style, TileMode, FontMetrics, Align;

function initClasses() {
    initCanvasClass();
    initPaintClass();
    initDashPathEffectClass();
    initPathClass();
    initRadialGradientClass();
    initLinearGradientClass();
    Align = android.graphics.Paint.Align;
    Cap = android.graphics.Paint.Cap;
    Join = android.graphics.Paint.Join;
    Style = android.graphics.Paint.Style;
    Rect = android.graphics.Rect;
    RectF = android.graphics.RectF;
    FontMetrics = android.graphics.Paint.FontMetrics;

    // Path = android.graphics.Path;
    // DashPathEffect = android.graphics.DashPathEffect;
    PathEffect = android.graphics.PathEffect;
    DrawFilter = android.graphics.DrawFilter;
    Op = android.graphics.Region.Op;
    Direction = android.graphics.Path.Direction;
    FillType = android.graphics.Path.FillType;
    Matrix = android.graphics.Matrix;
    TileMode = android.graphics.Shader.TileMode;
}

declare module '@nativescript/core/ui/core/view' {
    interface View {
        setOnLayoutChangeListener();
    }
}
class CanvasView extends CanvasBase {
    onDraw(canvas: ICanvas) {
        this.notify({ eventName: 'draw', object: this, canvas: canvas });
    }
    nativeViewProtected: android.view.View;
    createNativeView() {
        initAndroidCanvasViewClass();
        const view = new NativeCanvasView(this._context, this);
        view.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        return view;
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
export { Canvas, CanvasView, Cap, Direction, DrawFilter, FillType, Join, LinearGradient, Matrix, Op, PathEffect, RadialGradient, Rect, RectF, Style, TileMode, FontMetrics, Align };
