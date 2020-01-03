import { ImageSource } from '@nativescript/core/image-source/image-source';
import { Color } from '@nativescript/core/color/color';
import { layout, View } from '@nativescript/core/ui/core/view';
import { android as androidApp } from '@nativescript/core/application';

import { Canvas as ICanvas, Paint as IPaint } from './canvas';
import { CanvasBase, DEFAULT_SCALE } from './canvas.common';
import { Font } from '@nativescript/core/ui/styling/font';
import { profile } from '@nativescript/core/profiling/profiling';

export * from './canvas.common';

export function arrayoNativeArray(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    const length = array.length;
    const nNative = Array.create('float', length);
    for (let i = 0; i < length; i++) {
        nNative[i] = array[i];
    }
    return nNative;
}

export function parseDashEffect(value: string) {
    const array = value.split(' ').map(parseFloat);
    const length = array.length;
    const phase = array[length - 1];
    // const nNative = Array.create('float', length - 1);
    // for (let i = 0; i < length - 1; i++) {
    //     nNative[i] = array[i];
    // }
    const result = new DashPathEffect(arrayoNativeArray(array), phase);
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
        const activity = androidApp.foregroundActivity as globalAndroid.app.Activity;
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
        (view.nativeView as android.view.View).draw(canvas);
        if (rect) {
            canvas.restore();
        }
    }
}
// let Canvas: new (param0?, param1?) => ICanvas;
export let Canvas: Canvas;
export interface Canvas extends com.akylas.canvas.Canvas {
    new (imageOrWidth: ImageSource | android.graphics.Bitmap | number, height?: number): Canvas;
    drawView(view: View, rect?: any);
    getImage(): any;
    release();
    clear();
}
function initCanvasClass() {
    if (Canvas) {
        return Canvas;
    }
    class CanvasImpl extends com.akylas.canvas.Canvas {
        _bitmap: android.graphics.Bitmap;
        _shouldReleaseBitmap = false;
        constructor(imageOrWidth: ImageSource | android.graphics.Bitmap | number, height?: number) {
            super();
            this.setDensity(Math.round(DEFAULT_SCALE * 160));

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
            return Math.round(layout.toDeviceIndependentPixels(super.getWidth()));
        }
        getHeight() {
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
                const activity = androidApp.foregroundActivity as globalAndroid.app.Activity;
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
        @profile
        public drawLines(...params) {
            // params[0] = arrayoNativeArray(params[0]);
            // console.log('drawLines', params);
            return super.drawLines.apply(this, params);
        }
    }
    Canvas = CanvasImpl as any;
    return Canvas;
}
export let CanvasWrapper: CanvasWrapper;
export interface CanvasWrapper extends com.akylas.canvas.CanvasWrapper {
    new (canvas?): CanvasWrapper;
    drawView(view: View, rect?: any);
    getImage(): any;
    release();
    clear();
}
function initCanvasWrapperClass() {
    if (CanvasWrapper) {
        return CanvasWrapper;
    }
    class CanvasWrapperImpl extends com.akylas.canvas.CanvasWrapper {
        constructor(canvas) {
            super(canvas);
        }
        release() {
            if (this.canvas instanceof Canvas) {
                this.canvas.release();
            }
        }
        clear() {}
        setBitmap(image: any) {
            if (image instanceof ImageSource) {
                image = image.android;
                // } else {
                // this._bitmap = image;
            }
            // this.setBitmap(image);
            super.setBitmap(image);
        }

        drawColor(color: number | Color | string): void {
            const actualColor = color instanceof Color ? color : new Color(color as any);
            // console.log('drawColor', actualColor);
            return super.drawColor(actualColor.android);
        }
        @profile
        drawLines(...params) {
            // const length = params.length;
            // const points = params[0];
            // const paint = params[length - 1] as Paint;

            // const pointLength = points.length / 2;
            // for (let index = 0; index < pointLength -1; index++) {
            //     this.canvas.drawLine(points[index], points[index+1], points[index+2], points[index+3], paint)

            // }
            return super.drawLines.apply(this, params);
        }

        getWidth() {
            return layout.toDeviceIndependentPixels(super.getWidth());
        }
        getHeight() {
            return layout.toDeviceIndependentPixels(super.getHeight());
        }

        public drawView(view: View, rect?: any) {
            drawViewOnCanvas(this.canvas, view, rect);
        }
        getImage() {
            return null;
        }
    }
    CanvasWrapper = CanvasWrapperImpl as any;
    return CanvasWrapper;
}

let Paint: typeof IPaint;
type Paint = new () => IPaint;
function initPaintClass() {
    if (Paint) {
        return Paint;
    }
    class PaintImpl extends android.graphics.Paint {
        fontInternal: Font;
        setColor(color: Color | number | string) {
            // console.log('setColor', color);
            if (color instanceof Color) {
                super.setColor(color.android);
            } else {
                super.setColor(new Color(color as any).android);
            }
        }
        setTypeface(newValue: android.graphics.Typeface) {
            return super.setTypeface(newValue);
            //     let currentFont = this.fontInternal;
            // if (!currentFont || currentFont.fontFamily !== newValue) {
            //     const newFont = currentFont.withFontFamily(newValue);
            //     target.fontInternal = Font.equals(Font.default, newFont) ? unsetValue : newFont;
            // }
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
let RadialGradient;
function initRadialGradientClass() {
    if (RadialGradient) {
        return RadialGradient;
    }
    class RadialGradientImpl extends android.graphics.RadialGradient {
        public constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any) {
            super(param0, param1, param2, createColorParam(param3), param4 instanceof Array ? param4 : createColorParam(param4), param5);
        }
    }
    RadialGradient = RadialGradientImpl;
    return RadialGradientImpl;
}
let LinearGradient;
function initLinearGradientClass() {
    if (LinearGradient) {
        return LinearGradient;
    }
    class LinearGradientImpl extends android.graphics.LinearGradient {
        public constructor(param0: number, param1: number, param2: number, param3: any, param4: any, param5: any, param6: any) {
            super(param0, param1, param2, param3, createColorParam(param4), param5 instanceof Array ? param5 : createColorParam(param5), param6);
        }
    }
    LinearGradient = LinearGradientImpl;
    return LinearGradientImpl;
}

// class CanvasWrapper implements ICanvas {
//     canvas: android.graphics.Canvas;
//     setBitmap(image: any) {
//         if (image instanceof ImageSource) {
//             image = image.android;
//             // } else {
//             // this._bitmap = image;
//         }
//         // this.setBitmap(image);
//         super.setBitmap(image);
//     }

//     drawColor(color: number | Color | string): void {
//         const actualColor = color instanceof Color ? color : new Color(color as any);
//         // console.log('drawColor', actualColor);
//         return super.drawColor(actualColor.android);
//     }
//     @profile
//     drawLines(...params) {
//         // const length = params.length;
//         // const points = params[0];
//         // const paint = params[length - 1] as Paint;

//         // const pointLength = points.length / 2;
//         // for (let index = 0; index < pointLength -1; index++) {
//         //     this.canvas.drawLine(points[index], points[index+1], points[index+2], points[index+3], paint)

//         // }
//         return this.canvas.drawLines.apply(this.canvas, params);
//     }

//     getWidth() {
//         return layout.toDeviceIndependentPixels(super.getWidth());
//     }
//     getHeight() {
//         return layout.toDeviceIndependentPixels(super.getHeight());
//     }

//     public drawView(view: View, rect?: any) {
//         drawViewOnCanvas(this.canvas, view, rect);
//     }
// }

let     AndroidCanvasView;
function initAndroidCanvasViewClass() {
    if (AndroidCanvasView) {
        return AndroidCanvasView;
    }
    class AndroidCanvasViewImpl extends com.akylas.canvas.CanvasView {
        _owner: WeakRef<CanvasView>;
        mCanvas: ICanvas;
        // mBitmap: android.graphics.Bitmap;
        public constructor(owner: CanvasView) {
            super(owner._context);
            this._owner = new WeakRef(owner);
            // initCanvasWrapperClass();
            // this.mCanvas = new Canvas() as any;
            // this.mPaint = new android.graphics.Paint();
            // this.setWillNotDraw(false);
            //default hardware accelerated
            this.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        }
        // augmentedCanvas: ICanvas;

        public __sizeChangedImpl(w: number, h: number, oldw: number, oldh: number) {
            console.log('onSizeChanged', w, h);
            // super.onSizeChanged(w, h, oldw, oldh);
            // if (tiImage != null) {
            // 	TiDrawableReference ref = TiDrawableReference.fromUrl(proxy, tiImage);
            // 	tiBitmap = Bitmap.createScaledBitmap(ref.getBitmap(), w, h, true);
            // } else {
            // const oldBitmap = this.mBitmap;

            // this.mBitmap = android.graphics.Bitmap.createBitmap(w, h, android.graphics.Bitmap.Config.ARGB_8888);
            // }
            if (!this.mCanvas) {
                this.mCanvas = new Canvas(this.bitmap) as any;
                this.mCanvas.scale(DEFAULT_SCALE, DEFAULT_SCALE); // always scale to device density
            } else {
                this.mCanvas.setBitmap(this.bitmap);
            }
            // this.mCanvas.setBitmap(this.mBitmap);
            // if (oldBitmap) {
                // oldBitmap.recycle();
            // }
            const owner = this._owner && this._owner.get();
            if (owner) {
                owner.onSizeChanged(w, h, oldw, oldh);
            }
            // tiCanvas = new Canvas(tiBitmap);
        }
        onDraw(canvas: android.graphics.Canvas) {
            const owner = this._owner && this._owner.get();
            super.onDraw(canvas);
            console.log('onDraw', this.mCanvas);
            if (owner && this.mCanvas) {
                const scale = owner.density;
                // this.mCanvas.setDensity(Math.round(scale * 160));
                // if (!this.augmentedCanvas) {
                //     this.augmentedCanvas = new CanvasWrapper(canvas) as any;
                // } else {
                //     (this.augmentedCanvas as any).canvas = canvas;
                // }
                // console.log('test');
                if (owner.shapesCanvas) {
                    const shapeCanvas = owner.shapesCanvas;
                    canvas.drawBitmap(shapeCanvas.getImage() as android.graphics.Bitmap, 0, 0, new android.graphics.Paint());
                } else if (!owner.cached) {
                    const shapes = owner.shapes;
                    if (shapes && shapes.shapes.length > 0) {
                        shapes.shapes.forEach(s => s.drawMyShapeOnCanvas(this.mCanvas));
                    }
                }
                owner.onDraw(this.mCanvas);
                canvas.drawBitmap(this.bitmap, 0, 0, this.paint);
            }
        }
    }
    AndroidCanvasView = AndroidCanvasViewImpl;
    return AndroidCanvasViewImpl;
}

let Cap, Direction, DashPathEffect, DrawFilter, FillType, Join, Matrix, Op, Path, PathEffect, Rect, RectF, Style, TileMode, FontMetrics, Align;

function initClasses() {
    initCanvasClass();
    initPaintClass();
    initRadialGradientClass();
    initLinearGradientClass();
    Align = android.graphics.Paint.Align;
    Cap = android.graphics.Paint.Cap;
    Join = android.graphics.Paint.Join;
    Style = android.graphics.Paint.Style;
    Rect = android.graphics.Rect;
    RectF = android.graphics.RectF;
    FontMetrics = android.graphics.Paint.FontMetrics;

    Path = android.graphics.Path;
    DashPathEffect = android.graphics.DashPathEffect;
    PathEffect = android.graphics.PathEffect;
    DrawFilter = android.graphics.DrawFilter;
    Op = android.graphics.Region.Op;
    Direction = android.graphics.Path.Direction;
    FillType = android.graphics.Path.FillType;
    Matrix = com.akylas.canvas.Matrix;
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
        return new AndroidCanvasView(this);
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
export { CanvasView, Cap, DashPathEffect, Direction, DrawFilter, FillType, Join, LinearGradient, Matrix, Op, Paint, Path, PathEffect, RadialGradient, Rect, Style, TileMode, FontMetrics, Align };
