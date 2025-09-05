import { CSSType, Utils } from '@nativescript/core';
import { Canvas, Paint } from './canvas';
import { CanvasBase, hardwareAcceleratedProperty } from './index.common';
import { sdkVersion } from './canvas.common';

export * from './canvas';

@CSSType('CanvasView')
export class CanvasView extends CanvasBase {
    augmentedCanvas = new Canvas();
    frameRatePaint: Paint;
    shapePaint: Paint;
    onDraw(canvas: Canvas) {
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
            const shapes = this.shapes;
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
        // if (sdkVersion >= 28) {
        //     view.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        // } else {
        //     view.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
        // }
        return view;
    }
    [hardwareAcceleratedProperty.getDefault](value) {
        return sdkVersion >= 28;
    }

    [hardwareAcceleratedProperty.setNative](value) {
        this.nativeViewProtected.setLayerType(value ? android.view.View.LAYER_TYPE_HARDWARE : android.view.View.LAYER_TYPE_SOFTWARE, null);
    }
    initNativeView() {
        super.initNativeView();
        const that = new WeakRef(this);
        this.nativeViewProtected.sizeChangedListener = new com.akylas.canvas.SizeChangedListener({
            onSizeChanged: (w, h, oldW, oldH) => {
                that?.get()?.onSizeChanged(Utils.layout.toDeviceIndependentPixels(w), Utils.layout.toDeviceIndependentPixels(h), oldW, oldH);
            }
        });
        this.nativeViewProtected.drawListener = new com.akylas.canvas.DrawListener({
            onDraw: (canvas: android.graphics.Canvas) => {
                const owner = that?.get();
                if (owner) {
                    const drawFrameRate = this.drawFrameRate;
                    let startTime;
                    if (drawFrameRate) {
                        startTime = Date.now();
                    }
                    const scale = this.density;
                    canvas.save();
                    canvas.scale(scale, scale); // always scale to device density to work with dp
                    this.augmentedCanvas.setNative(canvas);
                    this.onDraw(this.augmentedCanvas as any);
                    if (drawFrameRate) {
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
