import { Length, PercentLength, zeroLength } from '@nativescript/core/ui/styling/style-properties';
import { layout } from '@nativescript/core/utils/utils';
import { Canvas, Rect, RectF, createRectF } from '../canvas';
import Shape, { lengthProperty, numberProperty, percentLengthProperty } from './shape';

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

    @lengthProperty left: Length = zeroLength;
    @lengthProperty top: Length = zeroLength;
    @numberProperty borderRadius: number;
    getRect(canvas: Canvas) {
        const availableWidth = layout.toDevicePixels(canvas.getWidth());
        const availableHeight = layout.toDevicePixels(canvas.getHeight());
        const marginLeft = this.marginLeft ? PercentLength.toDevicePixels(this.marginLeft, 0, availableWidth) : 0;
        const marginTop = this.marginTop ? PercentLength.toDevicePixels(this.marginTop, 0, availableHeight) : 0;
        const marginRight = this.marginRight ? PercentLength.toDevicePixels(this.marginRight, 0, availableWidth) : 0;
        const marginBottom = this.marginBottom ? PercentLength.toDevicePixels(this.marginBottom, 0, availableHeight) : 0;
        const rect = createRectF(
            layout.toDeviceIndependentPixels(marginLeft + Length.toDevicePixels(this.left)),
            layout.toDeviceIndependentPixels(marginTop + Length.toDevicePixels(this.top)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.width, 0, availableWidth) - marginLeft - marginRight),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.height, 0, availableHeight) - marginTop - marginBottom)
        );
        return rect;
    }
}
