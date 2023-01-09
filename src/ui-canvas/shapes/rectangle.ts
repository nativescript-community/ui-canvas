import { CoreTypes, PercentLength, Utils } from '@nativescript/core';
import { Canvas, Rect, RectF, createRectF } from '..';
import Shape, { numberProperty, percentLengthProperty } from './shape';

export { Rect, RectF };
export default class Rectangle extends Shape {
    drawOnCanvas(canvas: Canvas) {
        if (this.borderRadius) {
            canvas.drawRoundRect(this.getRect(canvas), this.borderRadius, this.borderRadius, this.paint);
        } else {
            canvas.drawRect(this.getRect(canvas), this.paint);
        }
    }

    @percentLengthProperty left: CoreTypes.PercentLengthType = 0;
    @percentLengthProperty top: CoreTypes.PercentLengthType = 0;
    @numberProperty borderRadius: number;
    getRect(canvas: Canvas) {
        const availableWidth = Utils.layout.toDevicePixels(canvas.getWidth());
        const availableHeight = Utils.layout.toDevicePixels(canvas.getHeight());
        const rect = createRectF(
            Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.left)),
            Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.top)),
            Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.width, 0, availableWidth)),
            Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.height, 0, availableHeight))
        );
        return rect;
    }
}
