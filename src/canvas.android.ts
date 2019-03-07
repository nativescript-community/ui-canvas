import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { Color } from 'tns-core-modules/color/color';
import { layout, View } from 'tns-core-modules/ui/core/view';
import { android as androidApp } from 'tns-core-modules/application';
import { screen } from 'tns-core-modules/platform';

import { Canvas as ICanvas, Paint as IPaint } from './canvas';
import { CanvasBase, DEFAULT_SCALE } from './canvas.common';

export * from './canvas.common';

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
let Canvas: new (param0?, param1?) => ICanvas;
function initCanvasClass() {
    if (Canvas) {
        return Canvas;
    }
    class CanvasImpl extends android.graphics.Canvas {
        _bitmap: android.graphics.Bitmap;
        _shouldReleaseBitmap = false;
        constructor(imageOrWidth: ImageSource | android.graphics.Bitmap | number, height?: number) {
            super();
            // console.log('create canvas', screen.mainScreen.scale, imageOrWidth, height);
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
    }
    Canvas = CanvasImpl as any;
    return Canvas;
}

let Paint: typeof IPaint;
type Paint = new () => IPaint;
function initPaintClass() {
    if (Paint) {
        return Paint;
    }
    class PaintImpl extends android.graphics.Paint {
        setColor(color: Color | number | string) {
            if (color instanceof Color) {
                super.setColor(color.android);
            } else {
                super.setColor(new Color(color as any).android);
            }
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

class CanvasWrapper implements ICanvas {
    canvas: any;
    release() {
        this.canvas.release();
    }
    clear() {
        this.canvas.clear();
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
    setShadowLayer(radius: number, dx: number, dy: number, color: any) {
        if (color instanceof Color) {
        } else {
            color = new Color(color);
        }
        this.canvas.setShadowLayer(radius, dx, dy, color.android);
    }
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

let AndroidCanvasView;
function initAndroidCanvasViewClass() {
    if (AndroidCanvasView) {
        return AndroidCanvasView;
    }
    class AndroidCanvasViewImpl extends android.view.View {
        _owner: WeakRef<CanvasView>;
        public constructor(owner: CanvasView) {
            super(owner._context);
            this._owner = new WeakRef(owner);
            this.augmentedCanvas = new CanvasWrapper();
        }
        augmentedCanvas: CanvasWrapper;
        onDraw(canvas: android.graphics.Canvas) {
            const owner = this._owner && this._owner.get();
            super.onDraw(canvas);
            if (owner) {
                const scale = owner.density;
                // console.log('set canvas density', scale, Math.round(scale * 160), canvas.isHardwareAccelerated() );
                canvas.setDensity(Math.round(scale * 160));
                canvas.scale(DEFAULT_SCALE, DEFAULT_SCALE); // always scale to device density
                this.augmentedCanvas.canvas = canvas;
                if (owner.shapesCanvas) {
                    const shapeCanvas = owner.shapesCanvas;
                    canvas.drawBitmap(shapeCanvas.getImage() as android.graphics.Bitmap, 0, 0, new android.graphics.Paint());
                } else if (!owner.cached) {
                    const shapes = owner.shapes;
                    if (shapes && shapes.shapes.length > 0) {
                        shapes.shapes.forEach(s => s.drawMyShapeOnCanvas(this.augmentedCanvas));
                    }
                }
                owner.notify({ eventName: 'draw', object: owner, canvas: this.augmentedCanvas });
            }
        }
    }
    AndroidCanvasView = AndroidCanvasViewImpl;
    return AndroidCanvasViewImpl;
}

let Cap, Direction, DrawFilter, FillType, Join, Matrix, Op, Path, Rect, Style, TileMode;

function initClasses() {
    initCanvasClass();
    initPaintClass();
    initRadialGradientClass();
    initLinearGradientClass();
    Cap = android.graphics.Paint.Cap;
    Join = android.graphics.Paint.Join;
    Style = android.graphics.Paint.Style;
    Rect = android.graphics.RectF;

    Path = android.graphics.Path;
    DrawFilter = android.graphics.DrawFilter;
    Op = android.graphics.Region.Op;
    Direction = android.graphics.Path.Direction;
    FillType = android.graphics.Path.FillType;
    Matrix = android.graphics.Matrix;
    TileMode = android.graphics.Shader.TileMode;
}

declare module 'tns-core-modules/ui/core/view' {
    interface View {
        setOnLayoutChangeListener();
    }
}
class CanvasView extends CanvasBase {
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
    public initNativeView() {
        super.initNativeView();
        // needed to update the cache canvas size on size change
        this.setOnLayoutChangeListener();
    }
}
initClasses();
export { Canvas, CanvasView, Cap, Direction, DrawFilter, FillType, Join, LinearGradient, Matrix, Op, Paint, Path, RadialGradient, Rect, Style, TileMode };
