import { CoreTypes } from '@nativescript/core';
import { PercentLength } from '@nativescript/core/ui/styling/style-properties';
import { layout } from '@nativescript/core/utils/utils';
import { Canvas, Rect, RectF, createRectF } from '../canvas';
import Shape, { numberProperty, percentLengthProperty } from './shape';

export { Rect, RectF };
export default class Rectangle extends Shape {
    drawOnCanvas(canvas: Canvas) {
        // console.log('Rectangle', 'drawOnCanvas');
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
        const availableWidth = layout.toDevicePixels(canvas.getWidth());
        const availableHeight = layout.toDevicePixels(canvas.getHeight());
        const rect = createRectF(
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.left)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.top)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.width, 0, availableWidth)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.height, 0, availableHeight))
        );
        return rect;
    }
}
