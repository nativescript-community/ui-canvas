/* eslint-disable no-redeclare */
import { CSSType, Font, Utils } from '@nativescript/core';
import { Canvas, Paint } from './canvas.ios';
import { CanvasBase } from './index.common';
import { iosAccessibilityAdjustsFontSizeProperty, iosAccessibilityMaxFontScaleProperty, iosAccessibilityMinFontScaleProperty } from '@nativescript/core/accessibility/accessibility-properties';
import { fontScaleInternalProperty } from '@nativescript/core/ui/styling/style-properties';

export * from './canvas';

export function adjustMinMaxFontScale(value, view) {
    let finalValue;
    if (view.iosAccessibilityAdjustsFontSize) {
        finalValue = value;

        if (view.iosAccessibilityMinFontScale && view.iosAccessibilityMinFontScale > value) {
            finalValue = view.iosAccessibilityMinFontScale;
        }
        if (view.iosAccessibilityMaxFontScale && view.iosAccessibilityMaxFontScale < value) {
            finalValue = view.iosAccessibilityMaxFontScale;
        }
    } else {
        finalValue = 1.0;
    }
    return finalValue;
}

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
            this.mCanvas.view = this.mOwner;
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

    [fontScaleInternalProperty.setNative](value) {
        const font = this.style.fontInternal || Font.default.withFontSize(16);
        const finalValue = adjustMinMaxFontScale(value, this);

        // Request layout on font scale as it's not done automatically
        if (font.fontScale !== finalValue) {
            this.style.fontInternal = font.withFontScale(finalValue);
            this.requestLayout();
        } else {
            if (!this.style.fontInternal) {
                this.style.fontInternal = font;
            }
        }
    }
    [iosAccessibilityAdjustsFontSizeProperty.setNative](value: boolean) {
        this[fontScaleInternalProperty.setNative](this.style.fontScaleInternal);
    }

    [iosAccessibilityMinFontScaleProperty.setNative](value: number) {
        this[fontScaleInternalProperty.setNative](this.style.fontScaleInternal);
    }

    [iosAccessibilityMaxFontScaleProperty.setNative](value: number) {
        this[fontScaleInternalProperty.setNative](this.style.fontScaleInternal);
    }
}
