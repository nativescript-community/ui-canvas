/* eslint-disable no-redeclare */
import { CSSType, Utils } from '@nativescript/core';
import { Canvas, Paint } from './canvas.ios';
import { CanvasBase } from './index.common';

export * from './canvas';

@NativeClass
export class UICustomCanvasView extends UIView {
    mCanvas: Canvas; // CGContextRef;
    public mOwner: WeakRef<CanvasView>;

    public static initWithOwner(owner: WeakRef<CanvasView>): UICustomCanvasView {
        const view = UICustomCanvasView.new() as UICustomCanvasView;
        // view.contentMode = UIViewContentMode.Redraw;
        // view.opaque = false;
        view.mOwner = owner;
        return view;
    }

    drawRect(dirtyRect) {
        const startTime = Date.now();
        const context = UIGraphicsGetCurrentContext();
        const size = this.bounds.size;
        const owner = this.mOwner && this.mOwner.get();
        if (!owner) {
            return;
        }
        const drawFrameRate = owner.drawFrameRate;
        if (drawFrameRate) {
        }
        if (!this.mCanvas) {
            this.mCanvas = new Canvas(0, 0);
        }
        this.mCanvas.setContext(context, size.width, size.height);
        if (owner.callDrawBeforeShapes) {
            owner.onDraw(this.mCanvas);
        }
        // this._canvas.scale(1 / owner.density, 1 / owner.density);
        // this._canvas.setDensity(owner.density);
        if (owner.shapesCanvas) {
            const canvas = owner.shapesCanvas as any as Canvas;
            // canvas.setDensity(owner.density);
            const viewport = CGRectMake(0, 0, size.width, size.height);
            const image = canvas.getCGImage();
            CGContextDrawImage(context, viewport, image);
        } else if (!owner.cached && owner.shapes) {
            const shapes = owner.shapes;
            if (shapes.length > 0) {
                //@ts-ignore
                shapes.forEach((s) => s.drawMyShapeOnCanvas(this.mCanvas, owner, size.width, size.height));
            }
        }
        if (!owner.callDrawBeforeShapes) {
            owner.onDraw(this.mCanvas);
        }
        if (drawFrameRate) {
            const end = Date.now();
            if (!this.frameRatePaint) {
                this.frameRatePaint = new Paint();
                this.frameRatePaint.color = 'blue';
                this.frameRatePaint.setTextSize(12);
            }
            this.mCanvas.drawText(Math.round(1000 / (end - startTime)) + 'fps', 0, 14, this.frameRatePaint);
        }
    }

    frameRatePaint: Paint;
}

@CSSType('CanvasView')
export class CanvasView extends CanvasBase {
    //@ts-ignore
    onDraw(canvas: Canvas) {
        this.notify({ eventName: 'draw', object: this, canvas });
    }
    nativeViewProtected: UICustomCanvasView;
    createNativeView() {
        const view = UICustomCanvasView.initWithOwner(new WeakRef(this));
        view.backgroundColor = UIColor.clearColor;
        this.style['css:background-color'] = 'transparent';
        return view;
    }
    _onSizeChanged() {
        super._onSizeChanged();
        this.onSizeChanged(Utils.layout.toDeviceIndependentPixels(this.getMeasuredWidth()), Utils.layout.toDeviceIndependentPixels(this.getMeasuredHeight()), -1, -1);
        this.nativeViewProtected?.setNeedsDisplay();
    }
    redraw() {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.setNeedsDisplay();
        }
    }
    invalidate() {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.setNeedsDisplay();
        }
    }
}
